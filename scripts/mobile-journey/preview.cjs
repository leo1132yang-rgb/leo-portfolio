const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'../..'),dest=path.join(root,'.tools/mobile-journey');
fs.mkdirSync(dest,{recursive:true});
for(const dir of ['app','components','data','hooks','lib'])fs.cpSync(path.join(root,dir),path.join(dest,dir),{recursive:true});
for(const file of ['package.json','tsconfig.json','next-env.d.ts','tailwind.config.ts','postcss.config.js'])fs.copyFileSync(path.join(root,file),path.join(dest,file));
for(const dir of ['node_modules','public'])if(!fs.existsSync(path.join(dest,dir)))fs.symlinkSync(path.join(root,dir),path.join(dest,dir),'junction');
const config=path.join(dest,'next.config.mjs');
if(!fs.existsSync(config))fs.writeFileSync(config,'export default {devIndicators:false,outputFileTracingRoot:'+JSON.stringify(root)+'};');
if(!process.argv.includes('--prepare-only')){const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','-p','3008'],{cwd:dest,stdio:'inherit'});child.on('exit',code=>process.exit(code||0));}
