extends Node

class_name CursorSystem

# public vars
var game: Game
var hex_grid: Grid

# private vars
var _sprite: Sprite

func _ready():
  _sprite = Sprite.new()
  _sprite.texture = Utils.id_to_sprite_path(Config.cursor.enabled.sprite.id)
  add_child(_sprite)

func _process(_delta):
  var index: int = game.state_manager.get("hex_select.index")
  var hex: Hex = hex_grid.grid[index]
  var hex_position: Vector2 = hex_grid.layout.to_point(hex)

  _sprite.position = hex_position + Vector2(0, Config.cursor.enabled.sprite.offset)




  
