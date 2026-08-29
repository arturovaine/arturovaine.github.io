# Low-poly right hand — build notes

Generated in Blender 5.1.1, 2026-07-26.

| File | What it is |
|---|---|
| `hand-low-poly-r.build.py` | Parametric generator. Re-run it to rebuild the model from scratch. |
| `hand-low-poly-r.blend` | Editable Blender source (hand + camera + 3-point lighting). |
| `hand-low-poly-r.stl` | Watertight export, **millimetres**, 978 triangles, 48 KB. |
| `hand-low-poly-r-preview.png` | 3/4 render of the back of the hand. |

## Specs

| | |
|---|---|
| Base mesh | 228 verts, 226 faces, **100% quads** |
| Triangles | 412 base / **978** with modifiers applied |
| Manifold | Watertight — 0 non-manifold edges, 0 loose verts, before *and* after modifiers |
| Dimensions | 193 mm long (wrist→middle fingertip), 149 mm span, 31 mm thick |
| Orientation | +Y fingers, +Z back of hand, −X thumb. Right hand, palm down. |
| Modifiers | Bevel (1 segment, 1.8 mm, 33° angle limit) → Weighted Normal |
| Shading | Flat. The bevel chamfer is what produces the faceted low-poly read. |

Scale note: the model is authored in **metres** (0.193 units long). The STL is
exported with `global_scale=1000` to land in millimetres, matching the existing
`3d-model.stl` in this folder (143 × 63 × 311 mm).

## Approach, and why

The obvious way to build a low-poly hand procedurally is to generate a palm box
plus 5 finger tubes and let them intersect. That renders fine but produces
interpenetrating shells: not watertight, not printable, and unpleasant to edit.

This model is instead **one continuous closed quad mesh**:

1. The palm is lofted from 5 cross-section rings running wrist → knuckles.
   Each ring is subdivided across X into **9 columns**, so the knuckle-line end
   of the palm is a strip of 9 quads.
2. Those 9 end quads are the roots everything else grows from:
   - 4 → extruded forward into fingers
   - 3 → extruded into the **webbing** between the fingers
   - 2 → capped flat as the hand's outer edges
3. The thumb is extruded from one quad of the palm's −X side wall.

Because every appendage grows out of a face that was already part of the palm,
the result is manifold by construction. No booleans, no remeshing, no cleanup.

Fingers are built by a single `extrude_chain()` walker: it carries a moving
frame (forward / side / up), and each segment rotates that frame by a yaw and a
pitch, advances it, and scales the cross-section. Each vertex remembers its
`(side, up)` coordinate in the root face's local frame, so the profile is
carried along the chain rather than rebuilt per segment.

## Three things that were wrong, and the fixes

**1. `extrude_face_region` does not delete the face it extrudes from.**
This is the one that actually bites. Passing `geom=[face]` extrudes correctly
but leaves the original face in place, sealing a wall across the middle of
every tube. Result: 122 non-manifold edges (116 with 3 faces, 6 with 4) — a
closed mesh with internal partitions at every single segment boundary. Fix is
an explicit delete after each extrude, keeping the verts and edges that the new
side walls are built on:

```python
ret = bmesh.ops.extrude_face_region(bm, geom=[cur])
nf = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMFace)][0]
if cur.is_valid:
    bmesh.ops.delete(bm, geom=[cur], context='FACES_ONLY')
```

**2. The first manifold check was a no-op.** It read
`sum(1 for e in me.edges if False)`, which is always 0. It reported a clean
mesh for two iterations while the mesh was in fact badly non-manifold. The real
check needs bmesh, because `MeshEdge` has no `link_faces` — only `BMEdge` does:

```python
bm = bmesh.new(); bm.from_mesh(me)
nonman = sum(1 for e in bm.edges if len(e.link_faces) != 2)
```

Worth checking the **evaluated** mesh too, not just the base one — the Bevel
modifier is perfectly capable of introducing problems the base mesh doesn't have.

**3. Anatomy: three passes to get the silhouette right.**

- *Fingers read as loose parallel sticks.* The gaps between them ran straight
  down to the knuckle line, so each finger was visually cut off from the hand.
  Fixed by extruding the 3 gap columns forward 14 mm as thin fins dropped
  toward the palm — the webbing. This was the single biggest improvement.
- *Fingers looked short and stubby from above.* Total curl was **84°**, which
  is a half-closed fist, not a relaxed hand; the fingers were pointing nearly
  straight down and foreshortening away. Reduced to **~32°**.
- *The hand read as a paddle.* The knuckle line was a straight cut across the
  palm, and the index and pinky sat flush with the palm's outer edge (which
  also caused a notch artifact where the pinky splayed). Fixed with the `YOFF`
  knuckle arc — middle knuckle furthest forward, pinky pulled back 10 mm — plus
  narrow margin columns inset on both outer edges.

## Tuning

Everything lives in the `TUNABLES` block at the top of the build script.

| Want to change | Edit |
|---|---|
| How open/closed the hand is | the `pitch` values in `finger()` — they sum to the total curl |
| Finger splay | the `yaw` argument per finger in `FINGERS` |
| Finger lengths | the first argument of each `finger(...)` call |
| Palm shape | `rings_spec` (y, width scale, thickness per ring) |
| Knuckle arc | `YOFF` |
| Palm/finger widths | `xs`, the 9 column boundaries |
| Thumb angle | the `yaw` values in `THUMB` (first one sets the main splay) |
| How faceted it looks | `BEVEL_WIDTH` / `BEVEL_ANGLE` |

To make a **left** hand, mirror on X and flip normals — or negate every `x` in
`xs`, reverse the list, and reverse `YOFF` with it.

## Rigging note

The topology is deliberately rig-friendly: each phalanx is a clean quad ring
loop, so edge loops fall on the joints and vertex groups can be assigned per
segment. There is no armature yet.
