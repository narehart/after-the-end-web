#!/usr/bin/env node
// Extract item data and images from Neo Scavenger for prototyping.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { DOMParser } from '@xmldom/xmldom';

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

// Parse vImageUsage to get inventory image index
// Format: "ground_idx,inventory_idx,..." - we need the second value (inventory)
function getInventoryImageIndex(imageUsage) {
  const parts = str(imageUsage)
    .split(',')
    .map((n) => parseInt(n, 10));
  return parts.length > 1 ? parts[1] : 0;
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

  // Get the inventory image (vImageUsage specifies which image is used in inventory)
  const inventoryImageIndex = getInventoryImageIndex(item.vImageUsage);
  const inventoryImage = originalImages[inventoryImageIndex] ?? originalImages[0];
  const imagePath = inventoryImage ? join(imgDir, inventoryImage) : null;
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
    image: camelImages[0] ?? null,
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

function copyImages(imageMap) {
  const imgDir = join(NEO_DIR, 'img');
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let copied = 0;
  for (const [original, camel] of imageMap) {
    const src = join(imgDir, original);
    if (existsSync(src)) {
      copyFileSync(src, join(OUTPUT_DIR, camel));
      copied++;
    }
  }
  console.log(`Copied ${copied}/${imageMap.size} images`);
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

function main() {
  console.log('Extracting items from Neo Scavenger...');
  const { items, imagesToCopy } = extractItems();

  mkdirSync(dirname(DATA_OUTPUT), { recursive: true });
  writeFileSync(DATA_OUTPUT, JSON.stringify(items, null, 2));
  console.log(`Saved ${items.length} items to ${DATA_OUTPUT}`);

  console.log(`Copying ${imagesToCopy.size} images...`);
  copyImages(imagesToCopy);
  printSummary(items);
}

main();
