import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createPng(width, height, drawPixel) {
  // RGBA buffer with filter byte at start of each scanline
  const rowSize = 1 + width * 4;
  const buffer = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    buffer[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      buffer[pixelOffset] = r;
      buffer[pixelOffset + 1] = g;
      buffer[pixelOffset + 2] = b;
      buffer[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(buffer);

  function writeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // Calculate CRC32 of type + data
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = crc32(toCrc);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Standard CRC32 table
  function makeCrcTable() {
    let c;
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[n] = c;
    }
    return crcTable;
  }
  const crcTable = makeCrcTable();
  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = writeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw Construction Hardhat + Building logo
function iconPainter(isMaskable) {
  return (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;

    // Dark Navy slate background (#0f172a)
    let r = 15, g = 23, b = 42, a = 255;

    // Background gradient subtle radial glow
    const cx = 0.5, cy = 0.5;
    const dist = Math.hypot(nx - cx, ny - cy);
    if (dist < 0.6) {
      r = Math.min(255, Math.floor(15 + (1 - dist / 0.6) * 20));
      g = Math.min(255, Math.floor(23 + (1 - dist / 0.6) * 35));
      b = Math.min(255, Math.floor(42 + (1 - dist / 0.6) * 60));
    }

    // Scale factor for maskable safe margin
    const scale = isMaskable ? 0.72 : 0.85;
    const ox = (nx - 0.5) / scale + 0.5;
    const oy = (ny - 0.5) / scale + 0.5;

    // Construction Hardhat dome: oval center at (0.5, 0.45)
    // (ox - 0.5)^2 / 0.28^2 + (oy - 0.45)^2 / 0.22^2 <= 1 and oy <= 0.47
    const domeDx = (ox - 0.5) / 0.28;
    const domeDy = (oy - 0.46) / 0.22;
    const inDome = (domeDx * domeDx + domeDy * domeDy <= 1.0) && (oy <= 0.48);

    // Hardhat Brim: rounded horizontal rectangle around y ~ 0.48 to 0.54
    const brimDx = Math.abs(ox - 0.5);
    const inBrim = (brimDx <= 0.36) && (oy >= 0.46 && oy <= 0.54);

    // Hardhat Top Crest / Ridge: narrow center vertical strip
    const inCrest = (Math.abs(ox - 0.5) <= 0.045) && (oy >= 0.24 && oy <= 0.46);

    // Construction crane / building block underneath: y from 0.58 to 0.76
    const inBuilding = (Math.abs(ox - 0.5) <= 0.22) && (oy >= 0.58 && oy <= 0.78);
    // Windows inside building
    const isWindow = inBuilding && ((Math.abs(ox - 0.42) <= 0.035 || Math.abs(ox - 0.58) <= 0.035) && 
      ((oy >= 0.61 && oy <= 0.66) || (oy >= 0.70 && oy <= 0.75)));

    if (inDome || inBrim || inCrest) {
      // Golden Amber construction color (#f59e0b)
      // Slight vertical highlight
      const highlight = Math.max(0, 1 - Math.hypot(ox - 0.42, oy - 0.35) * 2.5);
      r = Math.min(255, Math.floor(245 + highlight * 10));
      g = Math.min(255, Math.floor(158 + highlight * 60));
      b = Math.min(255, Math.floor(11 + highlight * 80));
      a = 255;
    } else if (inBuilding) {
      if (isWindow) {
        // Glowing cyan/white window
        r = 56; g = 189; b = 248; a = 255;
      } else {
        // Steel indigo block (#334155)
        r = 51; g = 65; b = 85; a = 255;
      }
    }

    return [r, g, b, a];
  };
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, iconPainter(false)));
console.log('Created pwa-192x192.png');

// 2. Generate pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, iconPainter(false)));
console.log('Created pwa-512x512.png');

// 3. Generate pwa-maskable-512x512.png (with safe-zone 15% margin)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, iconPainter(true)));
console.log('Created pwa-maskable-512x512.png');

// 4. Generate apple-touch-icon.png (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, iconPainter(false)));
console.log('Created apple-touch-icon.png');

// 5. Generate favicon.ico (32x32 PNG structure is accepted by modern browsers)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, iconPainter(false)));
console.log('Created favicon.ico');
