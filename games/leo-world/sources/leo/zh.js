// UI copy is separate from engine identifiers and input bindings.
const pairs = {
  "Bruno's":"Leo 的开放世界", "Bruno's Home":"欢迎来到 Leo 的世界", 'Bruno Simon':'李阳 Leo',
  'Interact':'互动', 'Unstuck':'脱困', 'Welcome!':'欢迎，出发吧！', 'Options':'设置', 'Audio':'声音',
  'Quality':'画质', 'Low':'流畅', 'High':'精美', 'Toggles sound':'开启或关闭声音', 'Toggles some effects':'切换画面效果',
  "I'm stuck!":'车辆脱困', 'Teleports you to the closest respawn':'返回最近的安全位置', 'Respawn':'返回路面',
  'Reset':'复原场景', 'Resets every object':'将场景物件放回原处', 'Renderer':'渲染模式', 'Best for performance':'推荐渲染模式',
  'Server':'存档模式', 'Pending':'本地', 'Online':'已连接', 'Offline':'单人探索', 'Connected':'已连接', 'Disconnected':'本地模式',
  'Mouse Keyboard':'键盘鼠标', 'Mobile Tablet':'手机平板', 'Gamepad':'手柄', 'or':'或', 'ARROWS':'方向键',
  'Move around':'驾驶', 'Boost':'加速', 'Brake':'刹车', 'Jump':'跳跃', 'Map':'世界地图', 'Mute':'静音',
  'Post a whisper':'留下旅途笔记', 'NUM KEYS':'数字键', 'NUM PAD':'小键盘', 'Activate hydraulics':'调节悬架',
  'LEFT CLICK (DRAG)':'鼠标左键拖动', 'Move camera':'转动视角', 'Honk':'鸣笛', 'One finger':'单指拖动',
  'Move the car':'驾驶汽车', 'Two fingers':'双指操作', 'Move camera / zoom':'转动视角／缩放', 'Tap (on the car)':'轻点汽车',
  'Interact / Exit':'互动／返回', 'Accelerate':'前进', 'Backward accelerate':'倒车', 'Hydraulics':'悬架',
  'Joystick Left':'左摇杆', 'Turn wheels':'转向', 'Joystick Left (press)':'按下左摇杆', 'Joystick Right':'右摇杆',
  'Joystick Right (press)':'按下右摇杆', 'Zoom in/out':'放大／缩小', 'Select':'选择', 'Start':'开始', 'Pause':'暂停',
  'Achievements':'探索成就', 'Rewards':'奖励涂装', 'Unlock at':'解锁条件', 'Reset achievements':'重置成就',
  'Circuit':'山地赛道', 'Server currently offline. Scores can\'t be saved.':'单人计时赛 · 最佳成绩保存在本机',
  'No score yet today':'完成首圈，创造你的纪录', 'Resets in':'下一轮', 'Restart':'重新挑战', 'End':'结束挑战',
  'Controls':'操作指南', 'Leave a whisper':'旅途笔记', 'Your message here':'写下此刻的想法',
  'Server currently offline':'本地探索模式', 'No result':'暂无内容', 'Behind the scene':'关于这个世界',
  'Your time':'本次用时', "Sorry, you didn't make it to the top 10.":'再试一次，挑战自己的最佳成绩。',
  'Submit':'保存', 'Projects':'作品工坊', 'Lab':'创意实验室', 'Career':'成长之路', 'Social':'联络广场',
  'Landing':'出发营地', 'Bowling':'山谷保龄球', 'Cookie':'饼干小屋', 'Altar':'风暴祭坛',
  'Time Machine':'记忆时光机', 'Behind<br /> the scene':'幕后星空', 'Behind the Scene':'幕后星空',
  'Accept':'接住饼干', 'Retry':'再试一次', 'Close':'关闭', 'Open':'打开', 'Role':'职责', 'At':'阶段', 'With':'协作',
  'Achievement unlocked':'成就解锁', 'New achievement':'新成就', 'All':'全部', 'Unlocked':'已解锁', 'Locked':'待发现',
  'Distance driven':'行驶里程', 'Time played':'探索时间', 'Achievements unlocked':'已解锁成就', 'Reset all':'全部复原',
  'Default':'默认', 'Red':'朱砂红', 'Orange':'日落橙', 'White':'珍珠白', 'Black':'曜石黑', 'Flames':'烈焰', 'Abyssal':'深海',
  'Enter':'进入', 'Press Enter':'按回车出发', 'Click to start':'点击出发', 'Start race':'开始计时赛', 'Start Race':'开始计时赛',
  'Play':'开始', 'Only Fans':'风扇小站', 'OnlyFans':'风扇小站', 'Toilet':'林间小屋', 'Source code':'源代码', 'Are you sure?':'确定重置吗？', 'Definitely?':'再次确认重置', 'Done!':'已完成',
};
export function zh(text) {
  if(typeof text !== 'string') return text;
  const clean=text.trim();
  return pairs[clean] ? text.replace(clean,pairs[clean]) : text;
}
export function localizeDOM(root=document.body) {
  const visit=node=>{
    if(node.nodeType===3){const next=zh(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;return;}
    if(node.nodeType!==1||/SCRIPT|STYLE|TEXTAREA/.test(node.tagName))return;
    for(const child of [...node.childNodes])visit(child);
  };
  visit(root);
  const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')visit(r.target);else for(const n of r.addedNodes)visit(n);}});
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  return ()=>observer.disconnect();
}
