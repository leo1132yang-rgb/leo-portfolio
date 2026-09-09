import { localizeDOM } from './zh.js';
import { leo } from '../data/leo.js';
import './style.css';

document.documentElement.lang='zh-CN';
document.title='Leo 的开放世界';
const homePreview=document.querySelector('.home-preview img');
if(homePreview)homePreview.src=leo.photos[1].previewSrc;
const behind=document.querySelector('.behindTheScene-content .content-inner');
if(behind)behind.innerHTML=`<div class="title">关于这个世界</div><p class="text">这是李阳 Leo 的中文版开放世界个人网站。开车探索真实履历、摄影记忆、品牌与系统项目，也可以只在风景里绕路。</p><p class="text">世界引擎、原始地形及基础美术来自 <a href="https://github.com/brunosimon/folio-2025" target="_blank" rel="noopener">Bruno Simon 的 Folio 2025</a>，依据 MIT 许可改编。保留原作者的版权与许可说明。</p><p class="text">在此基础上制作了中文体验、Leo 资料接入、三种原创风格化车身、探索护照、本地便签和圈速记录。渲染使用 Three.js，车辆物理使用 Rapier。</p><p class="text">本版为单人探索，进度存在本机；没有虚构访客和在线排行榜。车型参考设计语言，不是官方车辆模型。</p><p class="text"><a href="/other-side">回到 Leo 的房间 ↗</a> · <a href="LICENSE">阅读 MIT 许可 ↗</a></p>`;
const loading=document.createElement('div');loading.className='leo-loading';loading.innerHTML='<small>李阳 / LEO</small><h1>把人生，开成一个世界。</h1><p>正在整理行囊、铺好道路，第一次进入需要一点时间。</p><p>桌面：WASD 驾驶 · 手机：单指拖动驾驶</p>';document.body.append(loading);
localizeDOM();
window.addEventListener('unhandledrejection',()=>{if(!document.body.dataset.leoReady)loading.innerHTML='<h1>这次没能驶入世界</h1><p>请刷新重试，或换用支持 WebGL 2 的浏览器。</p><p><a href="/other-side">先回到房间 →</a></p>';});
