class_name Terrain

var subhexes = {
  "whole": [
    Hex.new(-2, 0, 2),
    Hex.new(-2, 1, 1),
    Hex.new(-2, 2, 0),
    Hex.new(-1, -1, 2),
    Hex.new(-1, 0, 1),
    Hex.new(-1, 1, 0),
    Hex.new(-1, 2, -1),
    Hex.new(0, -2, 2),
    Hex.new(0, -1, 1),
    Hex.new(0, 1, -1),
    Hex.new(0, 2, -2),
    Hex.new(1, -2, 1),
    Hex.new(1, -1, 0),
    Hex.new(1, 0, -1),
    Hex.new(1, 1, -2),
    Hex.new(2, -2, 0),
    Hex.new(2, -1, -1),
    Hex.new(2, 0, -2),
  ],
  "half": [
    Hex.new(-3, 1, 2),
    Hex.new(-3, 2, 1),
    Hex.new(-2, -1, 3),
    Hex.new(-2, 3, -1),
    Hex.new(-1, -2, 3),
    Hex.new(-1, 3, -2),
    Hex.new(1, -3, 2),
    Hex.new(1, 2, -3),
    Hex.new(2, -3, 1),
    Hex.new(2, 1, -3),
    Hex.new(3, -2, -1),
    Hex.new(3, -1, -2),
  ]
}

var atlus_width = 7
var atlus_height = 6
var hex_grid: Grid
var center_hexes = []
var atlus_hexes = []
var hex_type = []
var rng = RandomNumberGenerator.new()

func _init(_hex_grid: Grid):
  hex_grid = _hex_grid

func generate():
  center_hexes = get_centers()
  atlus_hexes = get_atluses(center_hexes)

  for hex in hex_grid.grid:
    hex_type.append("cccc")

  for atlus in atlus_hexes:
    set_atlus_terrain(atlus)

func set_atlus_terrain(atlus):
  var type_keys = Config.terrain_assignment.keys()


  var type_index = rng.randi_range(0, type_keys.size() - 1)
  var type = type_keys[type_index]
  var assignments = Config.terrain_assignment[type]

  var primary_type = get_random_terrain(assignments.primary)
  var whole_shuffled = atlus.whole.duplicate(true)
  whole_shuffled.shuffle()
  
  var whole_primary = whole_shuffled.slice(0, 8, true)
  var whole_secondary = whole_shuffled.slice(9, 14, true)
  var whole_tertiary = whole_shuffled.slice(15, whole_shuffled.size() - 1, true)

  set_terrain(atlus.center, primary_type)

  for h in whole_primary:
    set_terrain(h, get_random_terrain(assignments.primary))

  for h in whole_secondary:
    set_terrain(h, get_random_terrain(assignments.secondary))

  for h in whole_tertiary:
    var t = assignments.tertiary.duplicate(true)
    t.append_array(assignments.wildcard)
    
    set_terrain(h, get_random_terrain(t))

  for h in atlus.half:
    var t = assignments.primary.duplicate(true)
    t.append_array(assignments.secondary)
    t.append_array(assignments.tertiary)

    set_terrain(h, get_random_terrain(t))

func set_terrain(hex: Hex, terrain):
  var index = hex_grid.to_index(hex)
  var sprite = Config.hex_data[terrain].sprite.id

  if (index == -1):
    return
  if (!sprite):
    return

  hex_type[index] = terrain

func get_random_terrain(terrains):
  var expanded = [];
  
  for terrain in terrains:
    for i in terrain.chance:
      expanded.append(terrain)

  var winner = expanded[floor(rng.randf() * expanded.size())];
  
  return winner.type;

func get_atluses(centers):
  var subhex_map = subhexes
  var atlus = []

  for center in centers:
    var whole = []
    var half = []

    for h in subhex_map.whole:
      var hex = center.add(h)
      whole.append(hex)

    for h in subhex_map.half:
      var hex = center.add(h)
      half.append(hex)

    atlus.append({ 
      "center": center,
      "whole": whole,
      "half": half
    });


  return atlus

func get_centers():
  var start_hex: Hex = hex_grid.grid[0].add(Hex.new(-2, 1, 1))
  var columns: float = ceil((hex_grid.grid_size.x / atlus_width) * 1.5 + 2)
  var rows: float = hex_grid.grid_size.y / atlus_height + 3

  var column_hexes = [start_hex];
  var column_even_add: Hex = Hex.new(5, -5, 0)
  var column_odd_add: Hex = Hex.new(5, 0, -5)
  var row_add: Hex = Hex.new(0, 5, -5)
  var hexes = []

  for i in columns:
    var add_hex: Hex = column_even_add if i % 2 == 0 else column_odd_add
    var hex: Hex = column_hexes[i]
    column_hexes.append(hex.add(add_hex))

  for hex in column_hexes:	
    hexes.append(hex)

    for i in rows:
      hex = hex.add(row_add)
      hexes.append(hex)

  return hexes

