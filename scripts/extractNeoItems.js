#!/usr/bin/env node
// Extract item data and images from Neo Scavenger for prototyping.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { DOMParser } from '@xmldom/xmldom';

const NEO_DIR =
  '/Users/nicholasarehart/Library/Application Support/Steam/steamapps/common/NEO Scavenger';
const OUTPUT_DIR = '/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/assets/items';
const DATA_OUTPUT =
  '/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/data/neoItems.json';

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

const FORMAT_SIZES = {
  1: { width: 1, height: 1 },
  2: { width: 2, height: 1 },
  3: { width: 1, height: 1 },
  4: { width: 2, height: 2 },
  5: { width: 3, height: 2 },
  6: { width: 4, height: 2 },
  7: { width: 3, height: 3 },
  8: { width: 2, height: 3 },
};

const DEFAULT_SIZE = { width: 1, height: 1 };

const str = (val) => val ?? '';
const int = (val, fallback) => parseInt(val ?? fallback, 10);
const float = (val) => parseFloat(val ?? '0');

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

function parseTableToObject(table) {
  const item = {};
  const columns = table.getElementsByTagName('column');
  for (let j = 0; j < columns.length; j++) {
    const col = columns[j];
    item[col.getAttribute('name')] = col.textContent;
  }
  return item;
}

function extractItemData(item) {
  const images = parseImages(item.vImageList);
  const groupId = int(item.nGroupID, 0);
  const formatId = int(item.nFormatID, 3);
  const gridSize = parseSize(item.aCapacities);

  const extracted = {
    id: `neo_${str(item.id)}`,
    neoId: str(item.id),
    name: str(item.strName),
    description: str(item.strDesc),
    type: INTERESTING_GROUPS[groupId] ?? 'misc',
    weight: float(item.fWeight),
    value: float(item.fMonetaryValue),
    stackLimit: int(item.nStackLimit, 1),
    size: FORMAT_SIZES[formatId] ?? DEFAULT_SIZE,
    image: images[0] ?? null,
    allImages: images,
    ...(gridSize && { gridSize }),
  };

  return { extracted, images };
}

function extractItems() {
  const xmlPath = join(NEO_DIR, 'data', 'itemtypes.xml');
  const doc = new DOMParser().parseFromString(readFileSync(xmlPath, 'utf-8'), 'text/xml');

  const items = [];
  const imagesToCopy = new Set();
  const tables = doc.getElementsByTagName('table');

  for (let i = 0; i < tables.length; i++) {
    if (tables[i].getAttribute('name') !== 'itemtypes') continue;

    const item = parseTableToObject(tables[i]);
    const { extracted, images } = extractItemData(item);
    items.push(extracted);
    images.forEach((img) => imagesToCopy.add(img));
  }

  return { items, imagesToCopy };
}

function copyImages(images) {
  const imgDir = join(NEO_DIR, 'img');
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let copied = 0;
  for (const img of images) {
    const src = join(imgDir, img);
    if (existsSync(src)) {
      copyFileSync(src, join(OUTPUT_DIR, img));
      copied++;
    }
  }
  console.log(`Copied ${copied}/${images.size} images`);
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
