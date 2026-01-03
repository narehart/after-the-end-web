#!/usr/bin/env node
// Extract item data and images from Neo Scavenger for prototyping.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { DOMParser } from '@xmldom/xmldom';
import sharp from 'sharp';

const NEO_DIR =
  '/Users/nicholasarehart/Library/Application Support/Steam/steamapps/common/NEO Scavenger';
const OUTPUT_DIR = '/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/assets/images';
const DATA_OUTPUT =
  '/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/data/neoItems.json';

// Each grid cell in Neo Scavenger is 10 pixels (from GUIInventorySlot.as: nCapacityPixel = 10)
const CELL_SIZE_PIXELS = 10;

const INTERESTING_GROUPS = {
  5: 'container',
  11: 'container',
  13: 'material',
  32: 'consumable',
  33: 'consumable',
  34: 'consumable',
  1: 'weapon',
  2: 'weapon',
  3: 'ammo',
  6: 'clothing',
  7: 'clothing',
  8: 'accessory',
  9: 'tool',
  10: 'medical',
};

const DEFAULT_SIZE = { width: 1, height: 1 };

// Read PNG dimensions from file header
// PNG format: bytes 16-19 = width, bytes 20-23 = height (big endian)
function getPngDimensions(filePath) {
  try {
    const buffer = readFileSync(filePath);
    // Verify PNG signature
    if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
      return null;
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } catch {
    return null;
  }
}

// Calculate grid size from image dimensions
function calculateGridSize(imagePath) {
  const dimensions = getPngDimensions(imagePath);
  if (!dimensions) return DEFAULT_SIZE;

  return {
    width: Math.round(dimensions.width / CELL_SIZE_PIXELS),
    height: Math.round(dimensions.height / CELL_SIZE_PIXELS),
  };
}

const str = (val) => val ?? '';
const int = (val, fallback) => parseInt(val ?? fallback, 10);
const float = (val) => parseFloat(val ?? '0');
const toCamelCase = (filename) => filename.charAt(0).toLowerCase() + filename.slice(1);

function parseSize(capacityStr) {
  const match = capacityStr?.match(/(\d+)x(\d+)/);
  return match ? { width: int(match[1], 0), height: int(match[2], 0) } : null;
}

function parseImages(imageList) {
  return str(imageList)
    .split(',')
    .map((img) => img.trim())
    .filter(Boolean);
}

// Parse vImageUsage to get ground image index (item footprint)
// Format: "ground_idx,inventory_idx,..." - ground index is the item's actual size
function getFootprintImageIndex(imageUsage) {
  const parts = str(imageUsage)
    .split(',')
    .map((n) => parseInt(n, 10));
  return parts.length > 0 ? parts[0] : 0;
}

function parseTableToObject(table) {
  const item = {};
  const columns = table.getElementsByTagName('column');
  for (let j = 0; j < columns.length; j++) {
    const col = columns[j];
    item[col.getAttribute('name')] = col.textContent;
  }
  return item;
}

function extractItemData(item, imgDir) {
  const originalImages = parseImages(item.vImageList);
  const camelImages = originalImages.map(toCamelCase);
  const groupId = int(item.nGroupID, 0);
  const gridSize = parseSize(item.aCapacities);

  // Get the footprint image (vImageUsage ground index = item's actual size)
  const footprintImageIndex = getFootprintImageIndex(item.vImageUsage);
  const footprintImage = originalImages[footprintImageIndex] ?? originalImages[0];
  const imagePath = footprintImage ? join(imgDir, footprintImage) : null;
  const size = imagePath ? calculateGridSize(imagePath) : DEFAULT_SIZE;

  const extracted = {
    id: `neo_${str(item.id)}`,
    neoId: str(item.id),
    name: str(item.strName),
    description: str(item.strDesc),
    type: INTERESTING_GROUPS[groupId] ?? 'misc',
    weight: float(item.fWeight),
    value: float(item.fMonetaryValue),
    stackLimit: int(item.nStackLimit, 1),
    size,
    image: camelImages[footprintImageIndex] ?? camelImages[0] ?? null,
    allImages: camelImages,
    ...(gridSize && { gridSize }),
  };

  return { extracted, originalImages };
}

function extractItems() {
  const xmlPath = join(NEO_DIR, 'data', 'itemtypes.xml');
  const imgDir = join(NEO_DIR, 'img');
  const doc = new DOMParser().parseFromString(readFileSync(xmlPath, 'utf-8'), 'text/xml');

  const items = [];
  const imagesToCopy = new Map();
  const tables = doc.getElementsByTagName('table');

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].getAttribute('name') !== 'itemtypes') continue;

    const item = parseTableToObject(tables[i]);
    const { extracted, originalImages } = extractItemData(item, imgDir);
    items.push(extracted);
    originalImages.forEach((img) => imagesToCopy.set(img, toCamelCase(img)));
  }

  return { items, imagesToCopy };
}

async function copyImages(imageMap) {
  const imgDir = join(NEO_DIR, 'img');
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let copied = 0;
  let skipped = 0;
  for (const [original, camel] of imageMap) {
    const src = join(imgDir, original);
    if (existsSync(src)) {
      try {
        // Crop to actual content by trimming transparent pixels
        await sharp(src).trim().toFile(join(OUTPUT_DIR, camel));
        copied++;
      } catch {
        // Some images are too small to trim (< 3x3), copy as-is
        await sharp(src).toFile(join(OUTPUT_DIR, camel));
        skipped++;
      }
    }
  }
  console.log(`Cropped ${copied} images, copied ${skipped} small images as-is`);
}

function printSummary(items) {
  const byType = {};
  for (const item of items) {
    byType[item.type] = (byType[item.type] || 0) + 1;
  }
  console.log('\nItems by type:');
  for (const [t, count] of Object.entries(byType).sort()) {
    console.log(`  ${t}: ${count}`);
  }
}

async function main() {
  console.log('Extracting items from Neo Scavenger...');
  const { items, imagesToCopy } = extractItems();

  mkdirSync(dirname(DATA_OUTPUT), { recursive: true });
  writeFileSync(DATA_OUTPUT, JSON.stringify(items, null, 2));
  console.log(`Saved ${items.length} items to ${DATA_OUTPUT}`);

  console.log(`Copying ${imagesToCopy.size} images...`);
  await copyImages(imagesToCopy);
  printSummary(items);
}

main();
