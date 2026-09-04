// Build-time only: a static wall preview using the same local land data and
// latitude/longitude dot spacing as the supplied Originkit renderer.
import fs from 'node:fs/promises';
import ts from 'typescript';
import sharp from 'sharp';
import { geoEquirectangular, geoOrthographic, geoPath } from 'd3-geo';

const land = JSON.parse(await fs.readFile('public/data/ne_50m_land.json', 'utf8'));
const world = ts.createSourceFile('travelWorld.ts', await fs.readFile('data/travelWorld.ts', 'utf8'), ts.ScriptTarget.Latest, true);
let locations;
for (const statement of world.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (declaration.name.getText(world) === 'travelWorldPlaces') {
      const js = ts.transpileModule(`export default ${declaration.initializer.getText(world)}`, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
      locations = (await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)).default;
    }
  }
}
if (!locations) throw new Error('Existing travel locations not found');
const width = 1400, radius = 614;
const projection = geoOrthographic().rotate([-105, -23]).translate([700, 700]).scale(radius);
const path = geoPath(projection);
const flat = geoPath(geoEquirectangular().translate([1024, 512]).scale(2048 / (2 * Math.PI)));
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024"><rect width="2048" height="1024" fill="black"/><path d="${flat(land)}" fill="white"/></svg>`;
const { data, info } = await sharp(Buffer.from(maskSvg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const isLand = (lng,lat) => data[(Math.min(1023,Math.max(0,Math.round((90-lat)/180*1024)))*2048+Math.round((lng+180)/360*2048)%2048)*info.channels]>128;
const visible = (lng,lat) => {
  const a=lat*Math.PI/180, b=(lng-105)*Math.PI/180, t=23*Math.PI/180;
  return Math.sin(a)*Math.sin(t)+Math.cos(a)*Math.cos(t)*Math.cos(b)>0.015;
};
const circles=[];
const step=(24+(8-1)/9*(8-24))*.08;
for(let lat=-90;lat<=90;lat+=step){
  const c=Math.cos(Math.abs(lat)*Math.PI/180), lngStep=c>.01?step/Math.max(.3,c):360;
  for(let lng=-180;lng<180;lng+=lngStep){
    if(!visible(lng,lat)||!isLand(lng,lat))continue;
    const [x,y]=projection([lng,lat]);
    circles.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.55"/>`);
  }
}
const grid=[];
for(let lat=-75;lat<=75;lat+=15)grid.push({type:'LineString',coordinates:Array.from({length:361},(_,i)=>[i-180,lat])});
for(let lng=-180;lng<180;lng+=15)grid.push({type:'LineString',coordinates:Array.from({length:181},(_,i)=>[lng,i-90])});
const markers=locations.filter(p=>visible(p.lng,p.lat)).map(p=>{const [x,y]=projection([p.lng,p.lat]);return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="5"/>`;}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}"><rect width="100%" height="100%" fill="#050607"/><circle cx="700" cy="700" r="${radius}" fill="#050607" stroke="#302f2b"/><g fill="none" stroke="#969696" stroke-opacity=".15" stroke-width=".8">${grid.map(g=>`<path d="${path(g)}"/>`).join('')}</g><path d="${path(land)}" fill="none" stroke="#b0a99b" stroke-opacity=".5" stroke-width=".8"/><g fill="#dedbd3">${circles.join('')}</g><g fill="#c9a96e">${markers}</g></svg>`;
await sharp(Buffer.from(svg)).webp({quality:85}).toFile('public/room/world/originkit-preview.webp');
console.log('Static 1400 × 1400 preview generated from existing travel data.');
