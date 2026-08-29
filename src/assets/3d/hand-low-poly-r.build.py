"""
Parametric low-poly right hand generator (Blender 4.x / 5.x).

Run inside Blender:  Scripting workspace -> paste -> Run
or headless:         blender -b -P hand-low-poly-r.build.py

Rebuilds `Hand_Low_R` from scratch, deleting any previous version.
Everything worth tuning lives in the TUNABLES block.

Orientation (right hand):
    +Y  fingers point forward        -Z  palm faces down
    -X  thumb side                   +Z  back of hand faces up
Units: metres (1.0 = 1 m). Export to STL with global_scale=1000 for millimetres.

Topology: a single closed all-quad manifold. The palm is lofted from 5
cross-section rings that are subdivided across X into 9 columns; 4 of those
columns are extruded forward into fingers, 3 into the webbing between them,
and 2 are capped flat as the hand's outer edges. The thumb is extruded from
one quad of the palm's -X side wall. Nothing is a separate intersecting part.
"""

import bpy
import bmesh
import math
from mathutils import Vector, Matrix

# ============================== TUNABLES ==============================

# X boundaries of the 9 palm columns at the knuckle line (metres).
# margin | index | web | middle | web | ring | web | pinky | margin
xs = [-0.0450, -0.0440, -0.0245, -0.0215, -0.0010,
       0.0020,  0.0210,  0.0240,  0.0400,  0.0450]
FINGER_COLS = [1, 3, 5, 7]
WEB_COLS    = [2, 4, 6]
FLAT_COLS   = [0, 8]

HALF     = 0.045   # palm half-width, used to normalise the palm arch
PALM_LEN = 0.092   # wrist -> knuckle line

# Per-column Y offset of the knuckle line. This is the knuckle arc: the middle
# knuckle sits furthest forward, the pinky knuckle is pulled well back.
YOFF = [0.000, 0.002, 0.005, 0.006, 0.007, 0.006, 0.004, 0.001, -0.004, -0.010]

# Palm cross-sections: (y, width_scale, thickness)
rings_spec = [
    (0.000, 0.62, 0.024),   # wrist
    (0.018, 0.74, 0.028),
    (0.042, 0.87, 0.030),
    (0.068, 0.97, 0.029),
    (PALM_LEN, 1.00, 0.026),  # knuckle line
]

ARCH_TOP, ARCH_BOT = 0.0030, 0.0035   # transverse arch of the palm slab
THENAR, HYPOTHENAR = 0.0080, 0.0042   # fleshy pads on the palm surface

THUMB_RING = 2   # which palm ring interval the thumb grows out of

# A chain segment is (length, yaw_deg, pitch_deg, scale_side, scale_up, up_offset).
#   yaw   rotates about the frame's up axis   (+ = toward -X, i.e. splay outward)
#   pitch rotates about the frame's side axis (- = curl toward the palm)
# Scales are cumulative down the chain, so 0.97 means "97% of the previous ring".


def finger(total, yaw):
    """One finger: knuckle transition, 3 phalanges, then 2 short tip segments.

    Total curl of the main axis is ~32 deg. That number matters more than any
    other here: at 84 deg (the first attempt) the fingers read as a half-closed
    fist and look stubby from above, not as a relaxed open palm.
    """
    return [
        (0.006,        yaw,  -2.0, 0.97, 0.72, -0.001),  # palm slab -> finger thickness
        (total * 0.42, 0.0,  -7.0, 0.97, 0.97,  0.0),    # proximal phalanx
        (total * 0.32, 0.0, -13.0, 0.96, 0.95,  0.0),    # middle phalanx
        (total * 0.24, 0.0, -10.0, 0.96, 0.95,  0.0),    # distal phalanx
        (0.006,        0.0,  -8.0, 0.90, 0.84,  0.0),    # tip bevel
        (0.005,        0.0, -12.0, 0.60, 0.60,  0.0),    # tip cap
    ]


FINGERS = [
    finger(0.077,  4.0),   # index
    finger(0.085,  1.0),   # middle
    finger(0.079, -4.0),   # ring
    finger(0.062, -9.0),   # pinky
]

# The webbing is what stops the fingers reading as four loose sticks: a thin
# fin pushed forward from the gap columns and dropped toward the palm, so the
# fingers appear to merge into the hand instead of being cut to the knuckles.
WEBBING = [(0.014, 0.0, -6.0, 0.95, 0.45, -0.005)]

THUMB = [
    (0.030, -45.0, -10.0, 0.86, 0.78, 0.0),   # metacarpal, swings forward off the palm
    (0.026,  -8.0, -12.0, 0.92, 0.92, 0.0),   # proximal
    (0.022,  -4.0, -14.0, 0.92, 0.92, 0.0),   # distal
    (0.006,   0.0, -10.0, 0.90, 0.84, 0.0),
    (0.005,   0.0, -12.0, 0.60, 0.60, 0.0),
]

BEVEL_WIDTH = 0.0018   # the chamfer that gives the faceted low-poly read
BEVEL_ANGLE = 33.0

# ======================================================================


def ybell(y):
    """0 at the wrist and the knuckles, 1 across the middle of the palm."""
    return math.sin(math.pi * min(max(y / PALM_LEN, 0.0), 1.0))


def palm_bulge(x, y):
    thenar = THENAR * max(0.0, min(1.0, (-x - 0.008) / 0.034))
    hypo   = HYPOTHENAR * max(0.0, min(1.0, (x - 0.012) / 0.030))
    return (thenar + hypo) * ybell(y)


def extrude_chain(bm, root_face, forward, segments):
    """Walk a moving frame forward from root_face, extruding a tapered tube.

    Each vertex keeps its (side, up) coordinate in the root face's local frame,
    so the cross-section is carried along the chain and simply scaled, rather
    than being rebuilt per segment.
    """
    f = Vector(forward).normalized()
    up = Vector((0.0, 0.0, 1.0))
    side = f.cross(up).normalized()
    up = side.cross(f).normalized()

    C0 = root_face.calc_center_median()
    local = {v: ((v.co - C0).dot(side), (v.co - C0).dot(up)) for v in root_face.verts}

    P, cur, cs, cu = C0.copy(), root_face, 1.0, 1.0

    for (ln, yaw, pitch, ss, su, uoff) in segments:
        Ry = Matrix.Rotation(math.radians(yaw), 3, up)
        f = (Ry @ f).normalized()
        side = (Ry @ side).normalized()
        Rp = Matrix.Rotation(math.radians(pitch), 3, side)
        f = (Rp @ f).normalized()
        up = (Rp @ up).normalized()

        P = P + f * ln + up * uoff
        cs *= ss
        cu *= su

        old_vs = list(local.keys())
        ret = bmesh.ops.extrude_face_region(bm, geom=[cur])
        nf = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMFace)][0]

        # extrude_face_region does NOT remove the face it extruded from. Leaving
        # it in place seals a wall across the middle of the tube and makes every
        # one of its edges 3-manifold. Delete it, keeping its verts and edges,
        # which the new side walls are built on.
        if cur.is_valid:
            bmesh.ops.delete(bm, geom=[cur], context='FACES_ONLY')

        # The new verts are positional copies of the old ring, so match by
        # distance to carry the local cross-section coordinates forward.
        nl = {}
        for v in nf.verts:
            b = min(old_vs, key=lambda ov: (ov.co - v.co).length_squared)
            nl[v] = local[b]
        for v, (lu, lv) in nl.items():
            v.co = P + side * (lu * cs) + up * (lv * cu)

        local, cur = nl, nf

    return cur


def build():
    old = bpy.data.objects.get("Hand_Low_R")
    if old:
        me_old = old.data
        bpy.data.objects.remove(old, do_unlink=True)
        if me_old.users == 0:
            bpy.data.meshes.remove(me_old)

    coll = bpy.data.collections.get("Hand")
    if coll is None:
        coll = bpy.data.collections.new("Hand")
        bpy.context.scene.collection.children.link(coll)

    bm = bmesh.new()
    top_rings, bot_rings = [], []
    last = len(rings_spec) - 1

    # --- palm cross-section rings
    for r, (y, ws, th) in enumerate(rings_spec):
        tr, br = [], []
        for i, xi in enumerate(xs):
            x = xi * ws
            yy = y + (YOFF[i] if r == last else 0.0)
            t = (x / HALF) ** 2
            tr.append(bm.verts.new((x, yy,  th * 0.5 + ARCH_TOP * (1.0 - t))))
            br.append(bm.verts.new((x, yy, -th * 0.5 + ARCH_BOT * (1.0 - t)
                                    - palm_bulge(x, y))))
        top_rings.append(tr)
        bot_rings.append(br)

    # --- loft the palm + cap the wrist
    for r in range(last):
        t0, t1 = top_rings[r], top_rings[r + 1]
        b0, b1 = bot_rings[r], bot_rings[r + 1]
        for i in range(len(xs) - 1):
            bm.faces.new((t0[i], t0[i + 1], t1[i + 1], t1[i]))   # back of hand
            bm.faces.new((b0[i], b1[i], b1[i + 1], b0[i + 1]))   # palm side
        bm.faces.new((t0[0], t1[0], b1[0], b0[0]))               # -X wall (thumb side)
        bm.faces.new((t0[-1], b0[-1], b1[-1], t1[-1]))           # +X wall
    for i in range(len(xs) - 1):
        bm.faces.new((top_rings[0][i], bot_rings[0][i],
                      bot_rings[0][i + 1], top_rings[0][i + 1]))

    # --- the knuckle-end quads are the roots everything grows from
    kt, kb = top_rings[last], bot_rings[last]

    def end(i):
        return bm.faces.new((kt[i], kt[i + 1], kb[i + 1], kb[i]))

    for i in FLAT_COLS:
        end(i)
    web_roots = [end(i) for i in WEB_COLS]
    finger_roots = [end(i) for i in FINGER_COLS]

    thumb_root = next(
        f for f in bm.faces
        if set(f.verts) == {top_rings[THUMB_RING][0], top_rings[THUMB_RING + 1][0],
                            bot_rings[THUMB_RING + 1][0], bot_rings[THUMB_RING][0]})

    for segs, root in zip(FINGERS, finger_roots):
        extrude_chain(bm, root, (0.0, 1.0, 0.0), segs)
    for root in web_roots:
        extrude_chain(bm, root, (0.0, 1.0, 0.0), WEBBING)
    extrude_chain(bm, thumb_root, (-1.0, 0.0, 0.0), THUMB)

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    nonman = sum(1 for e in bm.edges if len(e.link_faces) != 2)

    me = bpy.data.meshes.new("Hand_Low_R_Mesh")
    bm.to_mesh(me)
    bm.free()
    me.polygons.foreach_set("use_smooth", [False] * len(me.polygons))

    obj = bpy.data.objects.new("Hand_Low_R", me)
    coll.objects.link(obj)

    bev = obj.modifiers.new("Bevel", 'BEVEL')
    bev.width = BEVEL_WIDTH
    bev.segments = 1
    bev.limit_method = 'ANGLE'
    bev.angle_limit = math.radians(BEVEL_ANGLE)
    bev.miter_outer = 'MITER_ARC'
    obj.modifiers.new("WeightedNormal", 'WEIGHTED_NORMAL')

    mat = bpy.data.materials.get("Skin_LowPoly")
    if mat is None:
        mat = bpy.data.materials.new("Skin_LowPoly")
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.82, 0.55, 0.42, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.55
    obj.data.materials.append(mat)

    assert nonman == 0, f"mesh is not watertight: {nonman} non-manifold edges"
    print(f"Hand_Low_R: {len(me.vertices)} verts, {len(me.polygons)} quads, "
          f"non-manifold edges: {nonman}")
    return obj


if __name__ == "__main__":
    build()
