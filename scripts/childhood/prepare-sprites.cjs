const sharp = require('sharp');
const fs = require('fs');
(async () => {
  const bounds = [];
  const { data, info } = await sharp('public/childhood-game/characters.png').raw().toBuffer({ resolveWithObject: true });
  for (let row=0; row<2; row++) for(let col=0; col<6; col++) {
    const l=col*362, r=l+362, t=row?324:0, b=row?724:324;
    let x0=r, y0=b, x1=l, y1=t;
    for(let y=t;y<b;y++) for(let x=l;x<r;x++) if(data[(y*info.width+x)*4+3]>90){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    bounds.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});
  }
  fs.writeFileSync('components/leo-room/childhood/spriteBounds.json', JSON.stringify(bounds));
})();
