import { readFile, writeFile } from "node:fs/promises";
import { inflateSync, deflateSync, crc32 } from "node:zlib";
import { resolve } from "node:path";

const SOURCE = resolve("public/brand/logo-full-color.png");
const TARGET = resolve("public/brand/logo-lockup.png");

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

const bounds = ({ width, height, pixels }) => {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("Source has no visible pixels");
  return { minX, maxX, minY, maxY };
};

let width = 0;

const scanlines = (rows) => {
  const stride = width * 4;
  const height = rows.length / stride;
  const out = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    out[y * (stride + 1)] = 0;
    rows.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return out;
};

const chunk = (type, body) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(body.length);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed) >>> 0);
  return Buffer.concat([length, typed, crc]);
};

const source = await readPng(SOURCE);
const { minX, maxX, minY, maxY } = bounds(source);
width = maxX - minX + 1;
const height = maxY - minY + 1;

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

const cropped = Buffer.alloc(height * width * 4);
for (let y = 0; y < height; y += 1) {
  source.pixels.copy(
    cropped,
    y * width * 4,
    (minY + y) * source.width * 4 + minX * 4,
    (minY + y) * source.width * 4 + (minX + width) * 4
  );
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(scanlines(cropped), { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

await writeFile(TARGET, png);

console.log(`source ${source.width}x${source.height}`);
console.log(`cropped ${width}x${height} from (${minX},${minY}) to (${maxX},${maxY})`);
console.log(`aspect ${(width / height).toFixed(3)}`);
console.log(`wrote ${TARGET}`);
