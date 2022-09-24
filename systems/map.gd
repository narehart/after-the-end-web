extends Node

class_name MapSystem

# public vars
var hex_grid: Grid
var terrain: Terrain

func _ready():
  # add y-sort
  var y_sort_node = YSort.new()

  # generate hex nodes
  for hex in hex_grid.grid:
    var hex_config = _get_hex_config(hex)
    var sprite = hex_config.sprite
    var hex_position = _get_hex_position(hex, sprite)

    var sprite_node = _get_hex_sprite_node(sprite, hex_position)
    y_sort_node.add_child(sprite_node);

    if hex_config.has("animated_sprite"):
      var animated_sprite_node = _get_hex_animation_node(hex_config.animated_sprite, hex_position)
      y_sort_node.add_child(animated_sprite_node)

  # attach to ysort
  add_child(y_sort_node)

func _get_hex_config(h: Hex):
  var index = hex_grid.to_index(h)
  var hex_type = terrain.hex_type[index]
  return Config.hex_data[hex_type]

func _get_hex_position(h: Hex, sprite):
  var offset = sprite.offset if sprite.has("offset") else 0
  var point = hex_grid.layout.to_point(h)
  var x = point.x;
  var y = point.y - offset;

  return Vector2(x, y)

func _get_hex_sprite_node(config, position: Vector2):
  var sprite_node = Sprite.new()
  
  sprite_node.texture = Utils.id_to_sprite_path(config.id)
  sprite_node.position = position
  
  return sprite_node

func _get_hex_animation_node(config, position: Vector2):
  var animated_sprite = config
  var animated_sprite_node = Sprite.new()
  
  animated_sprite_node.texture = Utils.id_to_sprite_path(animated_sprite.id)
  animated_sprite_node.position = position
  animated_sprite_node.hframes = animated_sprite.hframes

  var animation_manager = AnimationManager.new()
  
  animation_manager.sprite = animated_sprite_node
  animation_manager.add_animations(animated_sprite.animations)
  animation_manager.player.play()

  return animated_sprite_node
