# Printable prosthetic hand — build notes

A ground-up mechanical rebuild of `concept-20180605-02` (`3d-model.stl`), aimed
at parts that can actually be printed and assembled rather than only rendered.

Generated in Blender 5.1.1, 2026-07-26.

| File | What it is |
|---|---|
| `prosthetic-hand.build.py` | Parametric generator. Re-run to rebuild every part from scratch. |
| `prosthetic-hand.blend` | Editable source (parts + camera + lighting, posed). |
| `prosthetic-hand-preview.png` | Render of the current state. |

## Status

| Stage | State |
|---|---|
| Finger chain, clevis-and-tang pin joints | done |
| Flexion + extension stops | done |
| Palm chassis, 4 knuckle mounts, digit layout | done |
| Thumb — thenar tower + 2 moving phalanges | done |
| Wrist tongue-and-mortise + forearm socket | done |
| Panelled-shell treatment | done |
| STL export + print orientation | not started |

16 parts, 33,918 triangles, **all watertight** (0 non-manifold edges each), no
interference anywhere, **100° of travel at every joint**. Palm and forearm are
each a single connected shell.
Envelope 139 × 332 × 72 mm; the hand alone is 80 × 192.5 × 20 mm — within a few
mm of a real adult hand.

| Preview | |
|---|---|
| `prosthetic-hand-preview.png` | full assembly, dorsal 3/4 |
| `prosthetic-hand-thumb.png` | thumb and wrist junction |

## Print spec

| | |
|---|---|
| Pin | Ø3.0 rod, Ø3.4 hole (running clearance) |
| Clearance | 0.4 mm per side between moving parts |
| Minimum wall | 2.5 mm |
| Tendon channel | Ø2.2 |
| Finger section | 18 mm wide × 15 mm deep |
| Digit pitch | 20 mm |
| Units | **millimetres** (scene `scale_length = 0.001`), matching `3d-model.stl` |

Local frame of every phalanx: `+Y` distal, `+Z` dorsal, `+X` along the pin, and
**the origin is the part's own proximal pin centre**. That one convention makes
posing trivial — placing a part is just `Translation(pin) @ Rotation(angle)`,
with no offset bookkeeping.

## Why the fingers are thicker than the concept

The 2018 concept's digits are only ~8–11 mm in cross-section. A Ø3 pin joint
with a clevis and 2.5 mm walls does not fit inside that. The rebuild uses
18 × 15 mm.

That turns out **not** to be a compromise: a real adult index finger is roughly
18–20 mm wide and 16–18 mm deep at the base, so 18 × 15 mm is close to
anatomical, and four of them at 20 mm pitch give a 78 mm knuckle span — a normal
hand. The concept's slim digits were the stylised ones.

## The joint

Each phalanx ends distally in a two-prong **clevis** and begins proximally with
a **tang** that drops into the previous part's clevis, pinned through X. The
tang's rounded proximal end is a cylinder centred exactly on the pin, so it
sweeps a clean circle inside the slot.

Range of motion, measured by boolean-intersecting the real meshes at 2°
increments rather than by trigonometry:

```
θ = -100° : 0.03 mm³ overlap   ← flexion stop
θ =  -98° … +2° : 0 mm³         ← free travel
θ =   +4° : 0.23 mm³ overlap   ← extension stop
```

**100° of travel, identical at MCP, PIP and DIP.**

The two stops come from different features, which is worth knowing before
changing any dimension:

- **Flexion** is limited by the tang's *shoulder corner*, at radius
  `hypot(Y_SHOULDER, R)`, sweeping into the slot's end wall. It needs no
  dedicated feature — it falls out of the clearance geometry.
- **Extension** needed one. `STOP_Z0/STOP_Z1` add a dorsal lug whose flat face
  lies parallel to that same wall when the finger is straight, giving full-face
  contact at 0° that swings clear the instant the joint flexes. That asymmetry
  is the whole trick: it blocks hyperextension without costing any flexion.

## The thumb

The thumb's metacarpal is **not a moving link**. It is a fixed *thenar tower*,
unioned into the palm, and only the MCP and IP joints articulate — the same
choice printed hands like e-NABLE's make, because a 2-DOF carpometacarpal joint
cannot realistically be driven by a tendon anyway.

The alternative was built first and abandoned. A moving metacarpal has to be
hinged somewhere, and both options fail:

- Hinge it at the palm's **lateral edge** and the 45° divergence puts the thumb
  MCP 30 mm outside the hand's silhouette. The thumb reads as a fifth finger
  hanging in free air.
- Hinge it **medially**, where a real carpometacarpal joint actually sits, and
  the metacarpal has to cross *through* the palm slab. Carving out its swept
  volume took 11 stacked booleans and severed the palm into 3 shells with 153
  non-manifold edges.

A unioned tower has no swept volume to remove, and it puts the MCP at
(−52, 48, −21) — about where a real one sits.

Two frames are in play and they are deliberately different. `tower_frame()`
sets where the tower *reaches*; `thumb_frame()` sets the *pin axis*, which is
chosen for opposition. The tower's width is forced to line up with the pin axis
(`frame(d, axis.cross(d), root)`), or the clevis slot would cut its tip at an
angle and leave lopsided prongs.

### Opposition is a property of the axis, not the pose

The one number that decides whether the hand can grip is the thumb's flexion
axis, and it is easy to get wrong in a way that looks fine in a still render.
Two attempts failed before this one:

- `THUMB_FWD` aimed steeply palmar (−0.38 Z) drove the tip 56 mm *below* the
  palm over the chain length. The thumb ended up under the hand.
- Only 27° of lateral divergence let the metacarpal run parallel to the palm's
  own edge and straight through it — 125 mm³ of interference.

Because every joint is 1-DOF, each fingertip is confined to a **plane**. The
thumb and a finger can therefore only ever touch along the line where their two
planes intersect, so the axis has to be chosen for that, not eyeballed. The
check is a brute-force sweep of both chains through their real joint limits:

```
min tip-to-tip distance : 0.8 mm
index pose              : -35°, -75°, -60°
thumb pose              : -65°, -10°
```

Note that a *single* arbitrary index pose measured a 27.4 mm gap. Testing one
pose tells you nothing; the reachable sets have to be swept.

## Wrist and forearm

The wrist is a **rectangular tongue-and-mortise**, 30 × 12 × 22, pinned
transversely with the same Ø3 rod as every joint. A round rotating spigot would
have been nicer — it would give pronation — but the palm slab is 20 mm thick and
a bore big enough to carry load breaches both faces. The tongue fits with 3.6 mm
of slab left above and below.

The forearm is a hollow oval socket, 3 mm wall, flaring 46 × 34 mm at the wrist
to 70 × 56 mm at the elbow over 140 mm, closed distally by a 6 mm plate carrying
the tongue and four Ø4.5 tendon ports.

It is built as an **explicit two-surface shell** — outer skin, inner skin, a cap
at each end of the cavity, and a rim joining the two at the open proximal end —
rather than by solidifying a tube. Manifold by construction, no boolean.

## Panelling

Chamfered edges (0.8 mm, 2 segments) plus recessed panel breaks: a groove down
each phalanx's dorsal shaft and an inset panel on the palm's dorsal face.

**The chamfer must be limited to convex edges, and this is not a detail.** The
first attempt beveled by angle, and the result was catastrophic in a way that
every structural check passed: all 16 parts stayed perfectly watertight, single
shells, correct volumes — while the MCP joint's range of motion had gone to
**zero** and three parts interfered.

A chamfer removes material on a *convex* edge, so it can only ever widen a
running clearance. On a **concave** edge — the inside corners of a clevis slot —
bevel *adds* material, rounding the corner outward into the void. Every slot in
the hand quietly closed onto its tang.

So `panel()` measures convexity per edge with `BMEdge.calc_face_angle_signed()`,
weights only the ridges, and runs the modifier with `limit_method='WEIGHT'`.
That fixes the mechanism and drops the triangle count by about a third as a side
effect. `clamp_overlap` is left on — the clevis prongs are 5.1 mm thick and an
unclamped 0.8 mm chamfer on both sides of a thin web self-intersects.

## Measuring range of motion correctly

The naive metric — sweep the joint and report min/max of the angles that show no
overlap — is wrong, and it reported a healthy `+26°` extension limit for a joint
whose stop engages at `+2°`.

Past about `+20°` the extension lug rotates *clear* of the slot wall and the two
parts stop overlapping again. Those angles are free, but they are unreachable:
the joint would have to pass through its own stop to get there. A rigid-body
sweep tests each angle independently and cannot see that.

The metric has to be the **contiguous free band containing the rest pose** —
walk outward from 0° in each direction and stop at the first blocked angle.

## Five things that were wrong, and the fixes

**1. `extrude_face_region` does not delete the face it extrudes from.** Carried
over from the low-poly hand build — see `hand-low-poly-r.md`. Here it is
*exploited* rather than fixed: in `stadium_prism` and `prism` the retained
source face becomes the far cap, so the solid closes with a single extrude.

**2. Exact tangency breaks the boolean solver.** The first finger body was a box
of height `H` unioned with cylinders of radius `H/2` — the cylinder is exactly
tangent to the box's faces, and the exact solver emitted 13 and 10 non-manifold
edges on two of the three parts. Fixed by building `stadium_prism()` directly
from a capsule outline, which needs no boolean at all. The same trap is why the
palm's knuckle slot is cut `H + 1` deep rather than exactly `H`, and why the
extension-stop lug tops out at `R - 0.5` rather than `R`.

**3. Coplanar faces are the same trap.** The stop lug is unioned at full width
`W` and then trimmed to `TANG_W` by the tang cutters. Unioning it at `TANG_W`
directly would put its side faces exactly coplanar with the tang's.

**4. The boolean bake inherits an empty material slot.**
`bpy.data.meshes.new_from_object()` brings the cutter's material slots along,
and the cutter has none — so every part came back with an empty slot 0 that all
polygons pointed at, and anything appended afterwards landed in slot 1 and was
never drawn. Two renders came out uniformly white before this was spotted.
`boolean()` now pops null slots.

**5. Even phalanx lengths read as stubby.** The first layout used 30/24/20 mm.
A real proximal phalanx is about as long as the other two combined; 44/26/20
fixed it. This is the same failure mode, from a different cause, as the 84°
over-curl in the low-poly hand.

## Verification

`main()` returns a per-part watertightness report, but the checks that actually
matter are geometric and are run against the assembled scene:

- **Static interference** — boolean-intersect every pair of parts whose bounding
  boxes overlap, at rest. Any result above 0.01 mm³ is a clash.
- **Range of motion** — sweep each joint through ±120° in 2° steps, intersecting
  the two real meshes, and report the free band.

Both are cheap and neither can be fooled by geometry that merely looks right.
Trigonometry can: an earlier hand-calculation compared the tang shoulder against
the *prong* radius instead of the *slot wall* and concluded the joint spun
freely through 360°, when it in fact already had a sound flexion stop at −98°.

## Tuning

| Want to change | Edit |
|---|---|
| Finger thickness | `W`, `H` (`R` follows `H`) |
| Pin size / fit | `PIN_D`, `PIN_HOLE_D`, `CLEAR` |
| Flexion limit | `Y_FORK`, `Y_SHOULDER` |
| Extension limit | `STOP_Z0`, `STOP_Z1` |
| Digit lengths | `L_PROXIMAL/L_MIDDLE/L_DISTAL` and the per-digit scale in `DIGITS` |
| Knuckle arc / splay | the `x` and knuckle-`y` columns of `DIGITS` |
| Palm shape | `PALM_OUTLINE`, `PALM_T`, `BOSS_ROOT_Y` |
| Where the thumb sits | `THUMB_MCP`, `THUMB_ROOT` |
| Whether the thumb can oppose | `THUMB_FWD`, `THUMB_DORSAL` — re-run the sweep after any change |

`PITCH` is load-bearing: the knuckle pin hole is `W + 1` long, so at 20 mm pitch
it stops 0.5 mm short of the neighbouring boss. Drop the pitch to 18 and the
drill breaks through into the next finger.
