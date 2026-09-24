const sharp = require('../../../web/node_modules/sharp');
const path = require('node:path');

(async () => {
  for (const name of ['strawberry', 'tomato', 'citrus']) {
    const source = path.join(__dirname, `${name}.png`);
    const meta = await sharp(source).metadata();
    if (!meta.hasAlpha) throw new Error(`${name}: missing alpha`);
    const image = await sharp(source).trim({ threshold: 1 })
      .resize(648, 864, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 48, bottom: 48, left: 36, right: 36, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 84, alphaQuality: 85, effort: 6, smartSubsample: true }).toBuffer();
    const target = path.resolve(__dirname, `../../../web/public/img/aminosan-b/cut-${name}-v2.webp`);
    require('node:fs').writeFileSync(target, image);
    const final = await sharp(image).metadata();
    const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let transparent = 0, opaque = 0;
    for (let i = 3; i < data.length; i += info.channels) {
      if (data[i] === 0) transparent++;
      if (data[i] === 255) opaque++;
    }
    if (!transparent || !opaque || final.width !== 720 || final.height !== 960) throw new Error(`${name}: invalid output`);
    console.log(JSON.stringify({ name, width: final.width, height: final.height, bytes: image.length, hasAlpha: final.hasAlpha, transparent, opaque }));
    await sharp(image).resize({ height: 600 }).flatten({ background: '#eeece0' }).png().toFile(path.join(__dirname, `preview-${name}.png`));
    await sharp(image).resize({ height: 600 }).flatten({ background: '#11120f' }).png().toFile(path.join(__dirname, `preview-dark-${name}.png`));
  }
})();
