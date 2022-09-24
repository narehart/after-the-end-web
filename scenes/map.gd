extends Node

class_name MapScene

# scene class vars
var game: Game
    
func _ready():
  # generate grid and terrain
  var hex_grid: Grid = Grid.new(Config.map.hex_size, Config.map.map_padding)
  hex_grid.rectangle(Config.map.map_size)
  var terrain: Terrain = Terrain.new(hex_grid)
  terrain.generate()

  # add systems
  var background: BackgroundSystem = BackgroundSystem.new()
  background.game = game
  background.texture = load(Config.map.background)
  add_child(background)

  var map: MapSystem = MapSystem.new()
  map.hex_grid = hex_grid
  map.terrain = terrain
  add_child(map)

  var camera: CameraUpdateSystem = CameraUpdateSystem.new()
  camera.game = game
  camera.hex_grid = hex_grid
  add_child(camera)

  var hex_select: HexSelectSystem = HexSelectSystem.new()
  hex_select.game = game
  hex_select.hex_grid = hex_grid
  add_child(hex_select)

  var cursor: CursorSystem = CursorSystem.new()
  cursor.game = game
  cursor.hex_grid = hex_grid
  add_child(cursor)

  var ui_renderer: ReactUI = ReactUI.new({
    "node": MapUIComponent,
    "props": {
      "game": game,
      "terrain": terrain,
    }
  }, game.layers.ui)
  add_child(ui_renderer)

  pass
