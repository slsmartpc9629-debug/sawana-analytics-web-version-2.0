const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ -1) >>> 0;
}

function createPng(width, height, colorR, colorG, colorB) {
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // Radial glow effect
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) / (width / 2);
      
      let r = colorR, g = colorG, b = colorB, a = 255;
      if (dist > 0.95) {
        a = Math.max(0, Math.floor(255 * (1 - (dist - 0.95) * 20)));
      } else if (dist > 0.4 && dist < 0.6) {
        // Cyan accent ring
        r = 6; g = 182; b = 212;
      }
      
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // Length
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.alloc(4) // CRC placeholder
  ]);
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  ihdrChunk.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(deflated.length, 0);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), deflated]));
  const idatCrcBuf = Buffer.alloc(4);
  idatCrcBuf.writeUInt32BE(idatCrc, 0);
  const idatChunk = Buffer.concat([idatLength, Buffer.from('IDAT'), deflated, idatCrcBuf]);

  // IEND chunk
  const iendChunk = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Generate 192x192 & 512x512
const png192 = createPng(192, 192, 59, 130, 246); // Sawana Blue
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);

const png512 = createPng(512, 512, 59, 130, 246);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);

console.log('Successfully generated icon-192.png and icon-512.png!');
