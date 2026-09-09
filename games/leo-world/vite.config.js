import wasm from 'vite-plugin-wasm'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default {
 root:'sources', publicDir:'../static', base:'/world/',
 define:{'import.meta.env.VITE_COMPRESSED':'true','import.meta.env.VITE_WHISPERS_COUNT':'0','import.meta.env.VITE_MUSIC':'false','import.meta.env.VITE_LOG':'false','import.meta.env.VITE_GAME_PUBLIC':'true','import.meta.env.VITE_DAY_CYCLE_PROGRESS':'0.35'},
 server:{host:'127.0.0.1',port:3020,open:false,proxy:{
  '^/(room|images|projects|other-side|profile|leo-os|_next)(/|$)':{target:process.env.LEO_PORTFOLIO_URL||'http://localhost:3000',changeOrigin:true}
 }},
 css:{postcss:{plugins:[]}},
 build:{target:'esnext',outDir:'../../../public/world',emptyOutDir:true,chunkSizeWarningLimit:4000},
 plugins:[wasm(),nodePolyfills()]
}
