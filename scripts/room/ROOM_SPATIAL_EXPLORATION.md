# Room spatial exploration upgrade

Only the existing Room is changed. No Hub, avatar, route, module, renderer, dependency or external asset was added. Homepage, Projects, Profile, Global Nav, travel globe and Childhood gameplay are untouched.

## Space

Shell: 13 × 8 × 3.8 → 16 × 10.4 × 4.15 world units. Width +23.1%, depth +30%, floor area +60%, height +9.2%. Desk dimensions remain 4.81 × 1.52, with the same .798 height and .133 top. Desk/rug move forward .73; back-wall clearance gains about 1.93. Living console and corner bookshelf move back 1.2; lounge moves right 1.3 and forward .35 with its sitting/standing positions updated.

Childhood: forward 1.05, inward-facing angle 24.1 degrees from its former side-wall orientation; display scale .76 → .82. Same existing cover, callbacks and game. Slim supports make the angled display grounded. Foreground plant/lamp are moved away from its viewing corridor. Photo wall rises .30 to clear console objects. Desk lamp moves left .32 in world space to clear the right plant.

## Camera

Desktop overview [1.7,5,13.4] → [0,1.5,-.8], FOV 54. Portrait overview [1,9,29] → [-.4,1.1,-.7], FOV 60. Distance limits .65–25 desktop and .9–38 mobile, formerly 2.8–18.5 and 4.4–34. Azimuth ±2.5 rad. Polar .35–1.68 desktop / .4–1.65 mobile. Smooth time .38 / .32; dragging damping .15 / .18. Dolly speed .65; truck enabled at 1 / .75.

Right-drag pans; two fingers use CameraControls' existing dolly/truck gesture. Targets stay within the room; a small camera-volume guard plus swept movement checks the floor, walls and major furniture. The guard uses simple bounds instead of raycasting every decorative mesh. Seated fixed-eye looking still uses the existing seated driver.

Six inspection areas: Childhood, Photo Wall, Desk, Bookshelf, Vinyl, Lounge. Existing TV and globe focus remain. Movement uses 1.15-second Cartesian interpolation instead of a wide spherical arc. Portrait fitting is computed from actual aspect ratio and subject size, reserving 30% of vertical space for the surrounding controls. Desktop focus captions move to the upper left so the bottom shelf stays visible. At a settled inspect view, yaw can adjust about ±35.5 degrees and pitch ±17.2 degrees, within room limits. Dismissal releases the camera in place; RESET is the explicit return to overview. Adjusting an inspect view retains its existing photo/game actions. Generation guards prevent an interrupted animation from reapplying stale limits.

## Validation

- pnpm build: PASS, 33 static pages. Existing original Racing Vite public-asset/eval warnings remain.
- verify-navigation.cjs: PASS 1280, 390, 320. Six inspect areas, actual camera movement, Childhood corner projection inside portrait frustum, panning, cancellation, repeated module closes, stale completion, floor/furniture sweep and reset.
- verify-room-life.cjs: PASS 1280, 320, 360, 390, 430. Lights, chair, seated fixed-eye look, stand-up, vinyl/drawer/book state and camera release.
- Browser: desktop Childhood, photo wall, desk, bookshelf and vinyl close views; original Childhood entry and return; real photo Lightbox entry and close; 390px full Childhood display, drag without accidental entry, dismissal preserving the exact observed camera position. Final production build visually checked with an unobstructed bookshelf bottom row on desktop and 390px, and a raised photo wall clear of console plants. No horizontal overflow at 390px. The browser log contains an earlier development CSS hot-reload error; no new production error was observed after reload.
- Additional legacy verify-desk-props.cjs: all measured prop placement/click/drag checks now pass, including the lamp/plant clearance; the final existing 65,000-triangle budget assertion still fails at 69,001. Desk geometry/tessellation is unchanged by this pass. This is reported separately from the passing build and spatial tests.
- No physical-phone performance claim: the embedded test browser was throttled. No added textures, heavy geometry or postprocessing.

## Modified files

- components/OtherSide.tsx
- components/leo-room/CentralWorkspace.tsx
- components/leo-room/LivingShelf.tsx
- components/leo-room/RoomCameraControls.tsx
- components/leo-room/RoomNavigation.module.css
- components/leo-room/StudioInterior.tsx
- components/leo-room/WallDisplays.tsx
- components/leo-room/useRoomInteractionController.ts
- components/leo-room/roomSpatialBounds.ts (new)
- data/leoRoomCamera.ts
- data/leoRoomDimensions.ts
- data/leoRoomLife.ts
- data/leoRoomWorkspace.ts
- scripts/room/verify-navigation.cjs
- scripts/room/verify-room-life.cjs
- scripts/room/ROOM_SPATIAL_EXPLORATION.md

No commit or push. Local preview: http://localhost:3035/other-side
