import { readFile, writeFile } from "node:fs/promises";
import { inflateSync, deflateSync, crc32 } from "node:zlib";
import { resolve } from "node:path";

const SOURCE = resolve("public/brand/logo-lockup.png");
const TARGET = resolve("public/brand/logo-lockup-white.png");

const MIDNIGHT = [0, 12, 56];
const EMBER = [255, 183, 3];
const WHITE = [255, 255, 255];

const readPng = async (path) => {
  const buffer = await readFile(path);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const dataChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const body = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body[8];
      colorType = body[9];
    } else if (type === "IDAT") {
      dataChunks.push(body);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`Expected 8-bit RGBA PNG, received depth ${bitDepth} colour type ${colorType}`);
  }

  const raw = inflateSync(Buffer.concat(dataChunks));
  const stride = width * 4;
  const pixels = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const target = pixels.subarray(y * stride, (y + 1) * stride);
    const prior = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x += 1) {
      const a = x >= 4 ? target[x - 4] : 0;
      const b = prior ? prior[x] : 0;
      const c = prior && x >= 4 ? prior[x - 4] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      target[x] = value & 0xff;
    }
  }

  return { width, height, pixels };
};

const chunk = (type, body) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(body.length);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed) >>> 0);
  return Buffer.concat([length, typed, crc]);
};

const distance = (r, g, b, reference) =>
  Math.abs(r - reference[0]) + Math.abs(g - reference[1]) + Math.abs(b - reference[2]);

const source = await readPng(SOURCE);
const width = source.width;
const height = source.height;
const total = width * height * 4;
const out = Buffer.alloc(total);

let whitePixels = 0;
let emberPixels = 0;
let transparent = 0;

for (let i = 0; i < total; i += 4) {
  const alpha = source.pixels[i + 3];
  const r = source.pixels[i];
  const g = source.pixels[i + 1];
  const b = source.pixels[i + 2];

  if (alpha === 0) {
    transparent += 1;
    out[i] = 0;
    out[i + 1] = 0;
    out[i + 2] = 0;
    out[i + 3] = 0;
    continue;
  }

  const toMidnight = distance(r, g, b, MIDNIGHT);
  const toEmber = distance(r, g, b, EMBER);

  if (toMidnight <= toEmber) {
    out[i] = WHITE[0];
    out[i + 1] = WHITE[1];
    out[i + 2] = WHITE[2];
    out[i + 3] = alpha;
    whitePixels += 1;
  } else {
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
    emberPixels += 1;
  }
}

const original = source.pixels;
let alphaChanged = 0;
for (let i = 3; i < total; i += 4) {
  if (original[i] !== out[i]) alphaChanged += 1;
}

const scanlines = Buffer.alloc(height * (width * 4 + 1));
const stride = width * 4;
for (let y = 0; y < height; y += 1) {
  scanlines[y * (stride + 1)] = 0;
  out.copy(scanlines, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

await writeFile(
  TARGET,
  Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);

console.log(`source ${width}x${height} (${total} bytes of pixel data)`);
console.log(`white pixels : ${whitePixels}`);
console.log(`ember pixels : ${emberPixels}`);
console.log(`transparent   : ${transparent}`);
console.log(`alpha changed : ${alphaChanged} (expected 0)`);
console.log(`wrote ${TARGET}`);
