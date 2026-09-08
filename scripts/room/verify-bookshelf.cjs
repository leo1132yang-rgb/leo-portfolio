const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),THREE=require('three'),assert=require('node:assert/strict');
const original=Module._load;
Module._load=function(name,parent,main){if(name.startsWith('@/'))name=path.join(process.cwd(),name.slice(2));return original.call(this,name,parent,main)};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {SHELF_BOOKS,BOOK_SCALE,SHELF_ROWS}=require('../../data/leoRoomBookshelf.ts');
const {buildBookGeometry,bookMatrix}=require('../../components/leo-room/PersonalBookshelf.tsx');
assert.deepEqual([0,1,2,3].map(row=>SHELF_BOOKS.filter(b=>b.row===row).length),[7,8,7,7]);
assert.deepEqual(SHELF_BOOKS.filter(b=>b.row===0).map(b=>b.volume),['01','02','03','04','05','06','07']);
assert(SHELF_BOOKS.filter(b=>b.row===1).every(b=>b.author==='双雪涛'));
const boxes=SHELF_BOOKS.map(b=>{
 const h=b.height*BOOK_SCALE,t=b.thickness*BOOK_SCALE,d=b.depth*BOOK_SCALE;
 const box=new THREE.Box3(new THREE.Vector3(-t/2,-h/2,-d/2),new THREE.Vector3(t/2,h/2,d/2+.002)).applyMatrix4(bookMatrix(b));
 assert(Math.abs(box.min.y-(SHELF_ROWS[b.row]+(b.stacked??0)))<1e-6,b.title+' floats');
 assert(box.min.x>-.6225&&box.max.x<.6225,b.title+' crosses shelf frame');
 assert(box.min.z>-.285&&box.max.z<.285,b.title+' exceeds depth');
 const ceiling=[3.0175,2.2175,1.5175,.8175][b.row];assert(box.max.y<ceiling,b.title+' crosses upper shelf');
 return box;
});
for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
 const intersection=boxes[i].clone().intersect(boxes[j]),size=intersection.getSize(new THREE.Vector3());
 assert(intersection.isEmpty()||Math.min(size.x,size.y,size.z)<1e-6,`${SHELF_BOOKS[i].title} intersects ${SHELF_BOOKS[j].title}`);
}
const geometry=buildBookGeometry(),all=[...geometry.covers,geometry.pages,geometry.details,geometry.ends];
const triangles=all.reduce((n,g)=>n+(g.index?.count??g.attributes.position.count)/3,0);
assert.equal(all.length,7);assert(triangles<2000);
for(const g of geometry.covers){const uv=g.getAttribute('uv');for(let i=0;i<uv.count;i++)assert(uv.getX(i)>=0&&uv.getX(i)<=1&&uv.getY(i)>=0&&uv.getY(i)<=1,'UV outside atlas')}
console.log('PASS: 29 books, 7/8/7/7 rows, 01–07, correct author group, grounded stacks, shelf clearance, no book overlaps, atlas UV bounds');
console.log({drawCalls:all.length,triangles,atlas:'2048×2048 RGBA + 128×128 paper',textureMiB:((2048**2+128**2)*4*4/3/1024**2).toFixed(2)});
all.forEach(g=>g.dispose());
