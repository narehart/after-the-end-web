# Map generation

Link: http://welshpiper.com/hex-based-campaign-design-part-1/

## Terrain Assignment

Terrain is based on a hexagonal grid with hexes facing flat side up. Each hex is of a primary terrain type. Assignment of terrain types are goverened by the following rules.

### Scale

- Each hex is 5 miles

### Terrain types

- Atlus Hex[AH] - used in the generation of the map terrain
  - water
  - swamp
  - desert
  - plains
  - forest
  - hills
  - mountains
- Flavor Hex[FH] - used to add variety to primary terrain
  - forest light
  - forest heavy
  - forest hills
  - forest mountains
  - desert rocky
  - canyons
  - mountain pass
  - dominating peak

### Type designations

- Primary[P] - the most prevalent terrain type in the atlas hex
- Secondary[S] - the second-most common terrain relative to the primary type
- Tertiary[T] - the third-most common terrain relative to the primary type
- Wildcard[W] - highly uncommon, but possible, terrain relative to the primary type

### Assignment Table

- water
  - [P] water[100%]
  - [S] plains[100%]
  - [T] forest[34%], light forest[66%]
  - [W] swamp[33%], desert[33%], hills[33%]
- swamp
  - [P] swamp[100%]
  - [S] plains[100%]
  - [T] forest[100%]
  - [W] water[100%]
- desert
  - [P] desert[100%]
  - [S] hills[66%], rocky desert[34%]
  - [T] plains[100%]
  - [W] water[50%], mountains[50%]
- plains
  - [P] plains[100%]
  - [S] forest[100%]
  - [T] hills[100%]
  - [W] water[33%], swamp[33%], desert[33%]
- forest
  - [P] forest[66%], heavy forest[34%]
  - [S] plains[100%]
  - [T] forested hills[66%], hills[34%]
  - [W] water[33%], swamp[33%], forested mountains[22%], mountains[11%]
- hills
  - [P] hills[66%], forested hills[34%],
  - [S] mountains[80%], canyon[20%]
  - [T] plains[100%]
  - [W] water[33%], desert[33%], mountains[24%], mountain pass[7%]
- mountains
  - [P] mountains[80%], dominatin peak[20%]
  - [S] hills[100%]
  - [T] forest[66%], forested mountains[34%]
  - [W] desert[100%]

### Assignment process

- Divide hexes into larger area atlas hexes (could be voronoi for more variety)
  - Should be dynmic so scale can be adjusted to improve gameplay
- Whole hexes (hexes that fall entirely within the area hex)
  - Assign an atlus hex type [AH] to the primary terrain [P] at the center hex
  - Assign 50% of remaining hexes the primary type [P]
  - Assign 33% of remaining hexes a secondary terrain type [S]
  - Assign 15% of remaining hexes a tertiary type [T]
  - Assign 2% of remaning hexes a wildcard type [W]
- Half hexes (hexes that bleed over into other hexes)
  - Assign any non-wildcard atlus hex type [AH] (ignore already assigned hexes)

### Rivers
