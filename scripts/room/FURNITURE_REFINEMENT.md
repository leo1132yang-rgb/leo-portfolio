# Room furniture refinement — fixed dimensions

Baseline: d55d088. Only Desk furniture, the ordinary cup removal, and the existing
Stitch cabinet are changed. All Room dimensions, prop scale/positions, chair,
camera presets, cabinet placement and six existing figures are retained.

## Blender assets

- Built with Blender 5.2.1 using `scripts/room/blender/refine_room_furniture.py`.
- Source: `assets/room-blender/room-furniture-refinement.blend`.
- Desk: `public/room/models/leo-desk.glb`, 7,352 triangles, 4 material batches.
- Cabinet: `public/room/models/stitch-display-cabinet.glb`, 9,776 triangles,
  5 material batches. Existing figures remain separate React objects and retain
  their exact transforms, poses and geometry.
- Both GLBs include a 1024px original walnut veneer texture and applied transforms.
  No exported camera/light and no Draco decoder dependency. Combined GLBs ~1.86 MiB.
- Desk keeps the 4.81 × 1.52 main slab, rear return, .095 thickness, .9855 supporting
  plane and original tower clearance. Total depth including the return: 2.2648.
- Cabinet remains 1.06 × .48 × 1.66 at [3.55,0,.3]. Shelf support heights unchanged.
- Beveled walnut slab, metal U frames, recessed drawer fronts, mounting hardware,
  cable support; cabinet adds framed glass shelves, clear front glazing, small
  hinges/pull and warm recessed shelf lights.

## Behavior

- Ordinary coffee/water cup removed; one original Runtian bottle remains, with its
  original model, dimensions, transform and `runtian-water` interaction.
- Camera prop stays on the desk's right side. All other Desk props stay at scale 2.
- Desk GLB clicks bubble to existing deskTapHandlers. Cabinet still calls the
  original focusHotspot('collection'). No new router or camera controller.
- No second Canvas, renderer or audio engine. Existing material hover retained.

## Checks

- Geometry regression: 12 active props, correct handlers, click/drag/pinch behavior,
  grounding and no pairwise overlap; actual GLB triangle/tower intersection check.
- Explicit fixed desk footprint, support height, cabinet dimensions and prop scale
  assertions pass at desktop and 390px.
- Camera regression passes at 1280 / 390 / 320: seven inspect areas, exit in place,
  reset, interrupted focus and original content modules.
- Browser: desk/cabinet close views, Runtian detail open/close, cabinet look-around
  and ESC, lights off/on, 390px cabinet and 320px desk; no horizontal overflow,
  one Canvas. Local 320px sample: 59 FPS.
- Full pnpm build passed: 33 static pages. Existing Racing font/UI resolution and
  vm-browserify eval warnings remain; no new build errors.

## Changed source files

- components/leo-room/CentralWorkspace.tsx
- components/leo-room/StitchCollectionCabinet.tsx
- components/leo-room/StudioInterior.tsx (GLB cabinet hookup only)
- components/leo-room/RoomFurnitureAsset.tsx
- scripts/room/verify-desk-props.cjs
- This record, Blender authoring script/source/texture/manifest, and two GLBs.
