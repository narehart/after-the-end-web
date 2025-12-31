#!/usr/bin/env python3
"""Extract item data and images from Neo Scavenger for prototyping."""

import xml.etree.ElementTree as ET
import json
import shutil
import os
import re

NEO_DIR = "/Users/nicholasarehart/Library/Application Support/Steam/steamapps/common/NEO Scavenger"
OUTPUT_DIR = "/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/assets/items"
DATA_OUTPUT = "/Users/nicholasarehart/after-the-end-godot/ui-experiments/src/data/neoItems.json"

# Item groups we care about (from Neo Scavenger)
INTERESTING_GROUPS = {
    5: "container",      # bags, backpacks
    11: "container",     # bottles, containers
    13: "material",      # branches, sticks
    32: "consumable",    # food cans
    33: "consumable",    # food items
    34: "consumable",    # drinks
    1: "weapon",         # melee weapons
    2: "weapon",         # ranged weapons
    3: "ammo",           # ammunition
    6: "clothing",       # clothing
    7: "clothing",       # footwear
    8: "accessory",      # accessories
    9: "tool",           # tools
    10: "medical",       # medical items
}

def parse_size(capacity_str):
    """Parse capacity string like '4x6' into width/height."""
    if not capacity_str or 'x' not in capacity_str:
        return None
    match = re.match(r'(\d+)x(\d+)', capacity_str)
    if match:
        return {"width": int(match.group(1)), "height": int(match.group(2))}
    return None

def get_item_size_from_format(format_id):
    """Estimate item size based on format ID (rough mapping)."""
    # These are approximations based on common Neo Scavenger formats
    sizes = {
        1: {"width": 1, "height": 1},
        2: {"width": 2, "height": 1},
        3: {"width": 1, "height": 1},
        4: {"width": 2, "height": 2},
        5: {"width": 3, "height": 2},
        6: {"width": 4, "height": 2},
        7: {"width": 3, "height": 3},
        8: {"width": 2, "height": 3},
    }
    return sizes.get(format_id, {"width": 1, "height": 1})

def extract_items():
    """Parse itemtypes.xml and extract item data."""
    xml_path = os.path.join(NEO_DIR, "data", "itemtypes.xml")
    tree = ET.parse(xml_path)
    root = tree.getroot()

    items = []
    images_to_copy = set()

    for table in root.findall(".//table[@name='itemtypes']"):
        item = {}
        for col in table.findall("column"):
            item[col.get("name")] = col.text or ""

        # Extract relevant fields
        item_id = item.get("id", "")
        name = item.get("strName", "")
        desc = item.get("strDesc", "")
        group_id = int(item.get("nGroupID", 0))
        weight = float(item.get("fWeight", 0))
        value = float(item.get("fMonetaryValue", 0))
        stack_limit = int(item.get("nStackLimit", 1))
        format_id = int(item.get("nFormatID", 3))
        capacity = item.get("aCapacities", "")
        image_list = item.get("vImageList", "")

        # Get first image from list
        images = [img.strip() for img in image_list.split(",") if img.strip()]
        primary_image = images[0] if images else None

        # Determine item type from group
        item_type = INTERESTING_GROUPS.get(group_id, "misc")

        # Parse container capacity
        grid_size = parse_size(capacity)

        # Estimate item size (grid cells it occupies)
        item_size = get_item_size_from_format(format_id)

        extracted = {
            "id": f"neo_{item_id}",
            "neoId": item_id,
            "name": name,
            "description": desc,
            "type": item_type,
            "weight": weight,
            "value": value,
            "stackLimit": stack_limit,
            "size": item_size,
            "image": primary_image,
            "allImages": images,
        }

        # Add grid size for containers
        if grid_size:
            extracted["gridSize"] = grid_size

        items.append(extracted)

        # Track images to copy
        for img in images:
            if img:
                images_to_copy.add(img)

    return items, images_to_copy

def copy_images(images):
    """Copy item images to output directory."""
    img_dir = os.path.join(NEO_DIR, "img")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    copied = 0
    for img in images:
        src = os.path.join(img_dir, img)
        dst = os.path.join(OUTPUT_DIR, img)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            copied += 1

    print(f"Copied {copied}/{len(images)} images")

def main():
    print("Extracting items from Neo Scavenger...")
    items, images = extract_items()

    # Create output directories
    os.makedirs(os.path.dirname(DATA_OUTPUT), exist_ok=True)

    # Save item data as JSON
    with open(DATA_OUTPUT, 'w') as f:
        json.dump(items, f, indent=2)
    print(f"Saved {len(items)} items to {DATA_OUTPUT}")

    # Copy images
    print(f"Copying {len(images)} images...")
    copy_images(images)

    # Print summary by type
    by_type = {}
    for item in items:
        t = item["type"]
        by_type[t] = by_type.get(t, 0) + 1

    print("\nItems by type:")
    for t, count in sorted(by_type.items()):
        print(f"  {t}: {count}")

if __name__ == "__main__":
    main()
