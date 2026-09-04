# My World geographic textures

## Diffuse

`earth-nasa-blue-marble-2k.webp`: NASA Earth Observatory, Blue Marble Next Generation with Topography, July 2004. Credit: NASA / Reto Stockli.

Source: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/

Original: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x5400x2700.jpg

Resized from 5400 x 2700 to 2048 x 1024, WebP quality 88. No crop, mirror, longitude shift, saturation adjustment, or generated geography. Standard equirectangular, west=-180, east=180, north=90, south=-90.

## Boundaries

`country-boundaries-aligned.png`: Natural Earth 1:50m admin-0 countries (public domain).

Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson

Rasterized at 2048 x 1024 with x=(longitude+180)/360*2048 and y=(90-latitude)/180*1024. Segments crossing the antimeridian are split, not drawn across the image. Transparent background; no filled countries. Natural Earth represents generalized cartographic boundaries, not a legal boundary authority.

## Sphere alignment

Unmodified Three.js SphereGeometry UVs. All maps use flipY=true, offset=(0,0), repeat=(1,1), rotation=0. Diffuse/night use sRGB; bump is linear data.

Labels and travel nodes use x=r*cos(lat)*cos(lng), y=r*sin(lat), z=-r*cos(lat)*sin(lng). The raster boundary uses the same equirectangular coordinate convention. Facing a longitude uses Earth group Y rotation = -90 degrees - longitude. No per-place offsets.

The earlier earth-color-2k.webp and country-boundaries.png remain untouched for existing resources; the Room wall preview continues to use its original color map.
