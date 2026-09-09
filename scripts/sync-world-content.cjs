const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
const root=path.resolve(__dirname,'..');
function readTS(relative){const f=path.join(root,relative);const m=new Module(f,module);m.paths=module.paths;m.require=id=>id.startsWith('@/')?readTS(id.slice(2)+'.ts'):Module.prototype.require.call(m,id);m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);return m.exports;}
const {photoWallImages}=readTS('data/photoWall.ts');
const {experiences,careerStates}=readTS('data/profileSystem.ts');
const {capabilities,brandLanguage}=readTS('data/content.ts');
const {childhoodStories}=readTS('data/childhoodStories.ts');
const {travelWorldPlaces}=readTS('data/travelWorld.ts');
const source=fs.readFileSync(path.join(root,'components/ProjectsIndex.tsx'),'utf8');
const titles=[...source.matchAll(/title: copy\("([^"]+)"/g)].map(m=>m[1]);
const images=[...source.matchAll(/image: "([^"]+)"/g)].map(m=>m[1]);
const hrefs=[...source.matchAll(/href: "([^"]+)"/g)].map(m=>m[1]);
const projects=titles.map((title,i)=>({title,titleSmall:[title],url:hrefs[i],attributes:{role:['策划','创作','执行']},distinctions:[],images:[images[i]]}));
const out=path.join(root,'games/leo-world/sources/data');
fs.writeFileSync(path.join(out,'projects.js'),'export default '+JSON.stringify(projects,null,2)+';\n');
fs.writeFileSync(path.join(out,'lab.js'),'export default '+JSON.stringify(photoWallImages.slice(0,12).map(p=>({title:p.title,url:'/projects/photography',image:p.previewSrc||p.src,imageMini:p.thumbnailSrc||p.src})),null,2)+';\n');
fs.writeFileSync(path.join(out,'leo.js'),'export const leo = '+JSON.stringify({experiences,careerStates,capabilities,brandLanguage,photos:photoWallImages,projects,childhoodStories,travelWorldPlaces},null,2)+';\n');
console.log('Leo world: synchronized '+experiences.length+' career records, '+projects.length+' project categories and '+photoWallImages.length+' original photos.');
