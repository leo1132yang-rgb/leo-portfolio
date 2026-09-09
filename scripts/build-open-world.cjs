const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const cwd=path.join(root,'games/leo-world');
if(!fs.existsSync(path.join(cwd,'node_modules/vite/bin/vite.js'))){
  const install=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['ci','--no-audit','--no-fund'],{cwd,stdio:'inherit',shell:process.platform==='win32'});
  if(install.status!==0)process.exit(install.status||1);
}
require('./sync-world-content.cjs');
const build=spawnSync(process.execPath,[path.join(cwd,'node_modules/vite/bin/vite.js'),'build'],{cwd,stdio:'inherit'});
if(build.error)console.error(build.error);
process.exit(build.status===0?0:(build.status||1));
