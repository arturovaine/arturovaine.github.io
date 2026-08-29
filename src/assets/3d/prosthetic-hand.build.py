"""
Printable prosthetic hand — parametric part generator (Blender 4.x / 5.x).

STAGE 1: the finger chain (proximal / middle / distal phalanges) with
clevis-and-tang pin joints and a flexor tendon channel.

Units: this file authors in MILLIMETRES (1 Blender unit = 1 mm). The scene's
unit scale is set to 0.001 so Blender's readouts agree.

Local frame of every phalanx:
    +Y  distal (toward the fingertip)      origin = its own proximal pin centre
    +Z  dorsal (back of hand)              -Z = palmar (flexor side)
    +X  across the finger = the pin axis

Joint: each phalanx ends distally in a two-prong CLEVIS and begins proximally
with a TANG that drops into the previous part's clevis, pinned through X.
The tang's rounded proximal end is a cylinder centred exactly on the pin, so
it sweeps a clean circle inside the slot and rotation is unobstructed.
"""

import bpy
import bmesh
import math
from mathutils import Matrix, Vector

# ============================== PRINT SPEC ==============================
PIN_D       = 3.0    # Ø3 steel rod / filament / M3
PIN_HOLE_D  = 3.4    # running clearance on the pin
CLEAR       = 0.4    # per-side clearance between moving parts (FDM)
WALL        = 2.5    # minimum wall
TENDON_D    = 2.2    # flexor tendon channel

W = 18.0             # finger width  (across, = along the pin)
H = 15.0             # finger depth  (dorsal-palmar)
R = H / 2.0          # rounded end radius; the pin sits at its centre

TANG_W  = 7.0
GAP     = TANG_W + 2 * CLEAR      # slot the tang rotates in
PRONG_W = (W - GAP) / 2.0         # each clevis prong

# how far behind the pin the slot / narrowed tang must run for free rotation
Y_FORK     = R + CLEAR + 1.0
Y_SHOULDER = Y_FORK + 0.5

# Extension stop. The slot's proximal end wall is a plane at y = -Y_FORK in the
# joint frame, so a FLAT face on the tang at y = -(Y_FORK - CLEAR) lies parallel
# to it at full contact when the finger is straight, and swings clear as soon as
# the joint flexes. That asymmetry is the whole trick: it blocks hyperextension
# without touching the flexion range.
#
# The flexion limit needs no such feature -- the tang's shoulder corner, at
# radius hypot(Y_SHOULDER, R), sweeps into that same wall at about -98 deg.
STOP_Z0 = 3.0        # lug spans this to STOP_Z1 on the dorsal side
STOP_Z1 = R - 0.5    # kept off R so the lug is not tangent to the rounded cap

# Middle-digit phalanx lengths, pin centre to pin centre. These follow real
# proportions: the proximal phalanx is roughly as long as the other two put
# together. An even 30/24/20 split makes the digits read stubby no matter how
# good the joints are.
L_PROXIMAL, L_MIDDLE, L_DISTAL = 44.0, 26.0, 20.0
SEG = 24             # cylinder resolution

# ------------------------------ HAND LAYOUT ------------------------------
# Digit pitch has to clear W plus room for the knuckle pin hole to be drilled
# without breaking into the neighbouring boss: the hole is W + 1 long, so a
# 20 mm pitch leaves 0.5 mm of material either side. At an 18 mm pitch the
# drill would come out inside the next finger.
PITCH = 20.0
KNUCKLE_SPAN = 3 * PITCH + W          # 78 mm across the knuckles

# (name, x, knuckle y, length scale). -X is the thumb side, +Z dorsal.
# The staggered y values are the knuckle arc: middle furthest forward, pinky
# pulled well back. A straight knuckle line is the single thing that makes a
# hand read as a paddle.
DIGITS = [
    ("Index",  -30.0, 91.0, 0.95),
    ("Middle", -10.0, 95.0, 1.00),
    ("Ring",    10.0, 92.0, 0.95),
    ("Pinky",   30.0, 85.0, 0.80),
]

# --- thumb -----------------------------------------------------------------
# Only 2 phalanges, on a long metacarpal, and the whole chain is tilted out of
# the palm plane. That tilt is what opposition IS: the thumb has to flex ACROSS
# the palm toward the fingertips, not down toward the palm like a finger.
#
# The frame is built from two vectors rather than a stack of Euler angles,
# because the meaningful quantities here are directions, not angles:
#   THUMB_FWD    where the thumb points  (-X thumbward, +Y distal, -Z palmar)
#   THUMB_DORSAL which way the nail faces; flexion drives the tip at -DORSAL,
#                so -DORSAL must aim at the fingers for the tip to oppose them.
# The chain itself stays close to the palm plane -- only a slight palmar tilt.
# Aiming it steeply palmar instead (an early attempt used -0.38 Z) drives the
# tip 56 mm below the palm over a 97 mm chain: the thumb ends up under the hand
# rather than beside it. Opposition is the job of THUMB_DORSAL, not of THUMB_FWD.
#
# The lateral divergence matters as much as the tilt. At 27 deg off the palm's
# long axis the metacarpal runs parallel to the palm's own edge and ploughs
# straight through it (125 mm3 of interference). A real thumb column diverges
# about 45 deg and sits palmar of the slab, which is what these numbers encode.
THUMB_FWD    = (-0.72, 0.66, -0.22)
THUMB_DORSAL = (-0.65, -0.55, 0.52)
#
# The CMC belongs MEDIALLY, near the wrist centre, emerging through the palmar
# face -- not out at the palm's lateral edge. Placing it at the edge and then
# diverging 47 deg further outward puts the thumb MCP 30 mm clear of the hand's
# silhouette and the whole thumb reads as a fifth finger. Sited medially, the
# same divergence lands the MCP at x = -52, about where a real one sits, and the
# metacarpal passes through the thenar bulk instead of hanging in free air.
#
# The metacarpal is NOT a moving link. It is a fixed thenar tower, part of the
# palm, and only the MCP and IP joints articulate -- which is what printed hands
# actually do, because a 2-DOF carpometacarpal joint cannot be driven by a
# tendon anyway. The alternative was tried and abandoned: a medial CMC forces
# the moving metacarpal to cross through the palm slab, and carving out its
# swept volume (11 stacked booleans) severed the palm into 3 shells with 153
# non-manifold edges. A unioned tower has no swept volume to remove.
THUMB_MCP  = (-52.0, 48.0, -21.0)   # thumb MCP pin, world -- the first moving joint
# Root kept distal of y = 22.5: the wrist mortise occupies the slab proximal of
# that, and a root any further back has its cap cut away by it.
THUMB_ROOT = (-14.0, 30.0,   0.0)   # where the tower roots, well inside the slab
# The tower is built in two pieces: an angled STRUT that finds material to root
# in, and a short STUB at the tip that is aligned with the joint frame. Running
# the strut all the way to the pin instead leaves the boss asymmetric about the
# joint axis, and the phalanx's full-width shoulder catches the long side --
# thumb MCP travel collapsed from 100 deg to 26 deg. With an aligned stub the
# joint sees exactly the geometry a finger's knuckle boss presents.
THUMB_STUB_L = 16.0
L_TH_PROX, L_TH_DIST = 31.0, 21.0

# --- wrist + forearm --------------------------------------------------------
# The wrist is a rectangular tongue-and-mortise, pinned transversely. A round
# rotating spigot would be nicer (it would give pronation), but the palm slab is
# 20 mm thick and a bore big enough to carry load would breach both faces.
# A 30 x 12 tongue fits inside it with 3.6 mm of slab left top and bottom.
TONGUE_W, TONGUE_T, TONGUE_L = 30.0, 12.0, 22.0
WRIST_PIN_Y = 11.0    # transverse retaining pin, measured from the palm's face
PLATE_T     = 6.0     # forearm's distal end plate
FOREARM_WALL = 3.0
RING_SEG     = 32
# (y, half-width, half-height) -- an oval section flaring toward the elbow
FOREARM_STATIONS = [
    (   0.0, 23.0, 17.0),
    (  -6.0, 23.0, 17.0),   # = -PLATE_T, straight section for the end plate
    ( -45.0, 29.0, 22.0),
    ( -95.0, 33.0, 26.0),
    (-140.0, 35.0, 28.0),   # proximal opening
]
TENDON_PORTS = [(18.5, 6.0), (18.5, -6.0), (-18.5, 6.0), (-18.5, -6.0)]

# --- panelled shell ---------------------------------------------------------
# Chamfered edges plus recessed panel breaks. The chamfer is what reads as
# "machined" rather than "extruded box"; it is also safe for fit, because a
# chamfer only ever REMOVES material at an edge and so can only increase a
# running clearance, never close one.
PANEL_BEVEL   = 0.8
PANEL_SEGS    = 2
PANEL_ANGLE   = 30.0
GROOVE_D      = 1.2   # panel-break depth
GROOVE_W      = 9.0   # panel-break width across the part
PALM_RECESS   = (52.0, 54.0, 39.0, 1.5)   # width, length, y-centre, depth

PALM_T      = 20.0    # palm slab thickness (dorsal-palmar)
BOSS_ROOT_Y = 70.0    # knuckle bosses start this far out and merge into the slab
PALM_OUTLINE = [      # x, y  -- wrist at y=0, knuckle edge at y=82
    (-29.0,  0.0), (-34.0, 22.0), (-38.0, 50.0), (-40.0, 82.0),
    ( 40.0, 82.0), ( 37.0, 50.0), ( 32.0, 22.0), ( 29.0,  0.0),
]
# ========================================================================


def _new_obj(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def box(name, size, loc):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return _new_obj(name, bm)


def cyl(name, radius, depth, loc, axis='X'):
    """Cylinder built along Z then rotated onto the requested axis."""
    bm = bmesh.new()
    try:
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=SEG,
                              radius1=radius, radius2=radius, depth=depth)
    except TypeError:                      # older signature
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=SEG,
                              diameter1=radius, diameter2=radius, depth=depth)
    if axis == 'X':
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0),
                         matrix=Matrix.Rotation(math.radians(90), 3, 'Y'))
    elif axis == 'Y':
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0),
                         matrix=Matrix.Rotation(math.radians(90), 3, 'X'))
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return _new_obj(name, bm)


def stadium_prism(name, L, width, r, seg=SEG):
    """A capsule-profile prism: rounded ends of radius r at y=0 and y=L,
    extruded along X by `width`.

    Built directly rather than as box UNION cylinder. A cylinder of radius H/2
    unioned with a box of height H is exactly tangent to the box's faces, and
    exact tangency makes the boolean solver produce non-manifold edges.
    """
    n = max(2, seg // 2)
    pts = []
    for i in range(n + 1):                      # proximal cap, 90deg -> 270deg
        a = math.radians(90 + 180 * i / n)
        pts.append((r * math.cos(a), r * math.sin(a)))
    for i in range(n + 1):                      # distal cap, -90deg -> 90deg
        a = math.radians(-90 + 180 * i / n)
        pts.append((L + r * math.cos(a), r * math.sin(a)))

    bm = bmesh.new()
    vs = [bm.verts.new((-width / 2.0, p[0], p[1])) for p in pts]
    f = bm.faces.new(vs)
    # extrude_face_region leaves the source face behind; here that is wanted,
    # it becomes the far cap and the prism closes.
    ret = bmesh.ops.extrude_face_region(bm, geom=[f])
    nf = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMFace)][0]
    bmesh.ops.translate(bm, verts=nf.verts, vec=(width, 0, 0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return _new_obj(name, bm)


def prism(name, pts, z0, z1):
    """Closed solid from an XY outline extruded along Z. Same extrude-and-keep
    trick as stadium_prism: the source face becomes the near cap."""
    bm = bmesh.new()
    vs = [bm.verts.new((p[0], p[1], z0)) for p in pts]
    f = bm.faces.new(vs)
    ret = bmesh.ops.extrude_face_region(bm, geom=[f])
    nf = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMFace)][0]
    bmesh.ops.translate(bm, verts=nf.verts, vec=(0, 0, z1 - z0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return _new_obj(name, bm)


def move(ob, vec):
    """Translate mesh data, not the object transform, so booleans see it."""
    ob.data.transform(Matrix.Translation(Vector(vec)))
    return ob


def xform(ob, M):
    ob.data.transform(M)
    return ob


def frame(fwd, dorsal, origin):
    """Right-handed 4x4 with local +Y along fwd and +Z along dorsal.

    Gram-Schmidt rather than trusting the two inputs to be exactly orthogonal --
    they are hand-chosen directions, not a measured basis.
    """
    y = Vector(fwd).normalized()
    z = (Vector(dorsal) - y * Vector(dorsal).dot(y)).normalized()
    x = y.cross(z)
    M = Matrix.Identity(4)
    for r in range(3):
        M[r][0], M[r][1], M[r][2] = x[r], y[r], z[r]
    return Matrix.Translation(Vector(origin)) @ M


def boolean(a, b, op):
    """Apply a boolean of b onto a with the exact solver, then delete b.

    Evaluates through the depsgraph rather than bpy.ops.object.modifier_apply,
    which needs an operator context that scripts do not reliably have.
    """
    m = a.modifiers.new("bool", 'BOOLEAN')
    m.operation = op
    m.object = b
    m.solver = 'EXACT'

    dg = bpy.context.evaluated_depsgraph_get()
    baked = bpy.data.meshes.new_from_object(a.evaluated_get(dg))

    # The bake inherits a material slot from the cutter, which has no material,
    # so the part comes back with an empty slot 0 that every polygon points at.
    # Anything appended later lands in slot 1 and is never drawn.
    for i in range(len(baked.materials) - 1, -1, -1):
        if baked.materials[i] is None:
            baked.materials.pop(index=i)

    old = a.data
    a.data = baked
    a.modifiers.clear()
    if old.users == 0:
        bpy.data.meshes.remove(old)

    me = b.data
    bpy.data.objects.remove(b, do_unlink=True)
    if me.users == 0:
        bpy.data.meshes.remove(me)
    return a


# NOTE: a global cleanup pass here -- remove_doubles + dissolve_degenerate on
# every part before panel() -- was tried and REMOVED. It fixes the palm's few
# zero-area boolean leftovers, but the same call collapses a distal phalanx
# from 1814 faces to 539 and makes it non-manifold. The degeneracy is handled
# at export time instead, per part, with the result verified. See export.py.


def panel(ob):
    """Chamfer the shell's CONVEX edges only, applied through the depsgraph.

    Beveling by angle instead was tried and silently destroyed the mechanism.
    A chamfer removes material on a convex edge, so it can only widen a running
    clearance -- but on a CONCAVE edge, bevel ADDS material, rounding the inside
    corner outward into the void. That filled the clevis slots onto the tangs:
    MCP range of motion went to zero and three parts interfered, while every
    part stayed perfectly watertight, so nothing but the fit check caught it.

    So convexity is measured per edge and only ridges are weighted. This also
    keeps the triangle count down by a factor of three.
    """
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    thresh = math.radians(PANEL_ANGLE)
    weights = [1.0 if (len(e.link_faces) == 2
                       and e.calc_face_angle_signed() > thresh) else 0.0
               for e in bm.edges]
    bm.free()

    attr = ob.data.attributes.get("bevel_weight_edge")
    if attr is None:
        attr = ob.data.attributes.new("bevel_weight_edge", 'FLOAT', 'EDGE')
    attr.data.foreach_set("value", weights)

    m = ob.modifiers.new("Bevel", 'BEVEL')
    m.width = PANEL_BEVEL
    m.segments = PANEL_SEGS
    m.limit_method = 'WEIGHT'
    m.miter_outer = 'MITER_ARC'

    dg = bpy.context.evaluated_depsgraph_get()
    baked = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    for i in range(len(baked.materials) - 1, -1, -1):
        if baked.materials[i] is None:
            baked.materials.pop(index=i)
    old = ob.data
    ob.data = baked
    ob.modifiers.clear()
    if old.users == 0:
        bpy.data.meshes.remove(old)
    ob.data.polygons.foreach_set("use_smooth", [False] * len(ob.data.polygons))
    return ob


def check(ob):
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    nonman = sum(1 for e in bm.edges if len(e.link_faces) != 2)
    tris = sum(len(f.verts) - 2 for f in bm.faces)
    bm.free()
    return {"name": ob.name, "tris": tris, "non_manifold": nonman,
            "watertight": nonman == 0}


def make_phalanx(name, L, tang=True, clevis=True, tip=False):
    # --- stadium body, pin centres at y=0 and y=L
    body = stadium_prism(name, L, W, R)

    # --- dorsal extension-stop lug, added BEFORE the tang is cut so the tang
    #     cutters trim it to exactly TANG_W. Unioning it at TANG_W instead would
    #     put its side faces exactly coplanar with the tang's, and coplanar
    #     faces are the same boolean degeneracy that exact tangency is.
    if tang:
        y_face = Y_FORK - CLEAR
        lug = box(name + "_st", (W, y_face, STOP_Z1 - STOP_Z0),
                  (0, -y_face / 2.0, (STOP_Z0 + STOP_Z1) / 2.0))
        body = boolean(body, lug, 'UNION')

    # --- proximal tang: cut the body down to TANG_W where it enters the
    #     previous part's clevis
    if tang:
        off = (W + TANG_W) / 4.0 + TANG_W / 4.0
        for sgn in (1, -1):
            cutter = box(name + "_tg", (W, Y_SHOULDER + R + 2.0, H * 2),
                         (sgn * (TANG_W / 2.0 + W / 2.0),
                          (Y_SHOULDER - R - 2.0) / 2.0, 0))
            body = boolean(body, cutter, 'DIFFERENCE')

    # --- distal clevis: slot the fork open
    if clevis:
        slot = box(name + "_sl", (GAP, Y_FORK + R + 2.0, H * 2),
                   (0, L - Y_FORK + (Y_FORK + R + 2.0) / 2.0, 0))
        body = boolean(body, slot, 'DIFFERENCE')

    # --- pin holes
    body = boolean(body, cyl(name + "_p0", PIN_HOLE_D / 2, W * 2, (0, 0, 0), 'X'),
                   'DIFFERENCE')
    if clevis:
        body = boolean(body, cyl(name + "_p1", PIN_HOLE_D / 2, W * 2, (0, L, 0), 'X'),
                       'DIFFERENCE')

    # --- flexor tendon channel on the palmar side, clear of the pin holes
    z_ch = -(R - WALL - TENDON_D / 2.0)
    if tip:
        # distal: channel stops short, plus a transverse hole to knot the tendon
        ln = L * 0.6
        body = boolean(body, cyl(name + "_td", TENDON_D / 2, ln + R,
                                 (0, (ln - R) / 2.0, z_ch), 'Y'), 'DIFFERENCE')
        body = boolean(body, cyl(name + "_kn", TENDON_D / 2, W * 2,
                                 (0, ln * 0.75, z_ch), 'X'), 'DIFFERENCE')
    else:
        body = boolean(body, cyl(name + "_td", TENDON_D / 2, L + 4 * R,
                                 (0, L / 2.0, z_ch), 'Y'), 'DIFFERENCE')

    # --- panel break: a shallow dorsal groove down the shaft, kept clear of the
    #     shoulder and the fork so it never opens into the joint cavity.
    y0 = Y_SHOULDER + 3.0
    y1 = (L - Y_FORK - 3.0) if clevis else (L * 0.55)
    if y1 - y0 > 8.0:
        body = boolean(body, box(name + "_gv", (GROOVE_W, y1 - y0, GROOVE_D + 3.0),
                                 (0.0, (y0 + y1) / 2.0,
                                  R - GROOVE_D + (GROOVE_D + 3.0) / 2.0)),
                       'DIFFERENCE')

    body.data.polygons.foreach_set("use_smooth", [False] * len(body.data.polygons))
    return body


def make_forearm():
    """Hollow oval socket, closed distally by a plate carrying the wrist tongue.

    Built as an explicit two-surface shell rather than by solidifying a tube:
    outer skin, inner skin, a cap at each end of the cavity, and a rim joining
    the two at the open proximal end. Manifold by construction.
    """
    bm = bmesh.new()
    n = RING_SEG

    def ring(y, a, b):
        return [bm.verts.new((a * math.cos(2 * math.pi * i / n), y,
                              b * math.sin(2 * math.pi * i / n))) for i in range(n)]

    def bridge(ra, rb):
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((ra[i], ra[j], rb[j], rb[i]))

    outer = [ring(y, a, b) for (y, a, b) in FOREARM_STATIONS]
    inner = [ring(y, a - FOREARM_WALL, b - FOREARM_WALL)
             for (y, a, b) in FOREARM_STATIONS[1:]]

    for i in range(len(outer) - 1):
        bridge(outer[i], outer[i + 1])
    for i in range(len(inner) - 1):
        bridge(inner[i], inner[i + 1])
    bm.faces.new(outer[0])              # distal face of the end plate
    bm.faces.new(inner[0])              # distal end of the cavity
    bridge(outer[-1], inner[-1])        # open proximal rim

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    body = _new_obj("Forearm", bm)

    body = boolean(body, box("tongue", (TONGUE_W, TONGUE_L, TONGUE_T),
                             (0.0, TONGUE_L / 2.0, 0.0)), 'UNION')
    body = boolean(body, cyl("wpin", PIN_HOLE_D / 2, TONGUE_W + 30.0,
                             (0.0, WRIST_PIN_Y, 0.0), 'X'), 'DIFFERENCE')
    for (x, z) in TENDON_PORTS:
        body = boolean(body, cyl("port", 2.25, PLATE_T + 8.0,
                                 (x, -PLATE_T / 2.0, z), 'Y'), 'DIFFERENCE')

    body.data.polygons.foreach_set("use_smooth", [False] * len(body.data.polygons))
    body.name = "Forearm"
    return body


def build_digit(name, x, yk, s):
    """Three phalanges, scaled per digit, laid out along the chain from the
    knuckle pin at (x, yk, 0)."""
    lp, lm, ld = L_PROXIMAL * s, L_MIDDLE * s, L_DISTAL * s
    parts = [
        make_phalanx(name + "_Proximal", lp, tang=True, clevis=True),
        make_phalanx(name + "_Middle",   lm, tang=True, clevis=True),
        make_phalanx(name + "_Distal",   ld, tang=True, clevis=False, tip=True),
    ]
    for p, dy in zip(parts, (0.0, lp, lp + lm)):
        p.location = (x, yk + dy, 0.0)
    return parts


def make_palm():
    """Slab chassis with a knuckle boss per digit, each carrying an MCP clevis."""
    body = prism("Palm", PALM_OUTLINE, -PALM_T / 2.0, PALM_T / 2.0)

    # bosses first, so the slot and pin cuts below see one merged solid
    for i, (nm, x, yk, s) in enumerate(DIGITS):
        boss = stadium_prism("boss%d" % i, yk - BOSS_ROOT_Y, W, R)
        move(boss, (x, BOSS_ROOT_Y, 0.0))
        body = boolean(body, boss, 'UNION')

    for i, (nm, x, yk, s) in enumerate(DIGITS):
        # The slot is cut only H + 1 deep, not through the full slab. Cutting
        # H exactly would put the cutter face tangent to the boss's radius-R
        # cap, and tangency is what makes the exact solver emit non-manifold
        # edges. The pinky slot reaches proximal of the palm edge, so this also
        # keeps 2 mm of slab above and below it instead of a through-slot.
        slot = box("slot%d" % i, (GAP, Y_FORK + R + 2.0, H + 1.0),
                   (x, yk - Y_FORK + (Y_FORK + R + 2.0) / 2.0, 0.0))
        body = boolean(body, slot, 'DIFFERENCE')
        body = boolean(body, cyl("kp%d" % i, PIN_HOLE_D / 2, W + 1.0,
                                 (x, yk, 0.0), 'X'), 'DIFFERENCE')

    # --- thenar tower: fixed metacarpal, unioned into the slab, carrying the
    #     thumb MCP clevis at its tip.
    M = thumb_frame()
    body = boolean(body, xform(stadium_prism("tstrut", strut_len(), W, R),
                               strut_frame()), 'UNION')
    # stub placed so its DISTAL cap centre lands on the MCP pin, exactly as a
    # finger's knuckle boss does -- material then extends R past the pin to
    # carry the prongs.
    Ms = Matrix.Translation(M.to_3x3() @ Vector((0.0, -THUMB_STUB_L, 0.0))) @ M
    body = boolean(body, xform(stadium_prism("tstub", THUMB_STUB_L, W, R), Ms),
                   'UNION')

    # Clevis is cut in the JOINT frame. With the stub aligned this is now
    # identical to a finger's -- no proximal overcut needed.
    slot = box("tslot", (GAP, Y_FORK + R + 2.0, H + 1.0),
               (0.0, -Y_FORK + (Y_FORK + R + 2.0) / 2.0, 0.0))
    body = boolean(body, xform(slot, M), 'DIFFERENCE')
    body = boolean(body, xform(cyl("tpin", PIN_HOLE_D / 2, W + 8.0,
                                   (0.0, 0.0, 0.0), 'X'), M), 'DIFFERENCE')

    # --- wrist mortise, opening through the palm's proximal face
    ml = TONGUE_L + CLEAR + 2.0
    body = boolean(body, box("mortise",
                             (TONGUE_W + 2 * CLEAR, ml, TONGUE_T + 2 * CLEAR),
                             (0.0, ml / 2.0 - 2.0, 0.0)), 'DIFFERENCE')
    body = boolean(body, cyl("wpin", PIN_HOLE_D / 2, 80.0,
                             (0.0, WRIST_PIN_Y, 0.0), 'X'), 'DIFFERENCE')

    # --- dorsal panel recess
    rw, rl, ry, rd = PALM_RECESS
    body = boolean(body, box("recess", (rw, rl, rd + 4.0),
                             (0.0, ry, PALM_T / 2.0 - rd + (rd + 4.0) / 2.0)),
                   'DIFFERENCE')

    body.data.polygons.foreach_set("use_smooth", [False] * len(body.data.polygons))
    body.name = "Palm"
    return body


def thumb_frame():
    """Joint frame at the thumb MCP: +Y along the thumb, +X the flexion axis."""
    return frame(THUMB_FWD, THUMB_DORSAL, THUMB_MCP)


def thumb_axis():
    return (thumb_frame().to_3x3() @ Vector((1.0, 0.0, 0.0))).normalized()


def stub_base():
    """Where the aligned stub starts, i.e. where the strut has to reach."""
    fwd = (thumb_frame().to_3x3() @ Vector((0.0, 1.0, 0.0))).normalized()
    return Vector(THUMB_MCP) - fwd * THUMB_STUB_L


def strut_len():
    return (stub_base() - Vector(THUMB_ROOT)).length


def strut_frame():
    """Frame for the angled strut.

    Its direction is set by where it has to reach, but its WIDTH must line up
    with the thumb's flexion axis, or it would meet the stub twisted. Passing
    `axis x dir` as the dorsal reference makes frame() resolve local +X back to
    the flexion axis.
    """
    d = (stub_base() - Vector(THUMB_ROOT)).normalized()
    return frame(d, thumb_axis().cross(d), THUMB_ROOT)


def build_thumb():
    """Two moving phalanges. The metacarpal is part of the palm."""
    parts = [
        make_phalanx("Thumb_Proximal", L_TH_PROX, tang=True, clevis=True),
        make_phalanx("Thumb_Distal",   L_TH_DIST, tang=True, clevis=False, tip=True),
    ]
    M = thumb_frame()
    for p, dy in zip(parts, (0.0, L_TH_PROX)):
        p.matrix_world = Matrix.Translation(M.to_3x3() @ Vector((0.0, dy, 0.0))) @ M
    return parts


def build_hand():
    palm = make_palm()
    parts = [palm]
    for (nm, x, yk, s) in DIGITS:
        parts += build_digit(nm, x, yk, s)
    parts += build_thumb()
    parts.append(make_forearm())
    for p in parts:
        panel(p)
    return parts


def main():
    bpy.ops.wm.read_homefile(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    sc.unit_settings.scale_length = 0.001
    sc.unit_settings.length_unit = 'MILLIMETERS'

    parts = build_hand()
    report = [check(p) for p in parts]
    for r in report:
        print(r)
    return report


if __name__ == "__main__":
    main()
