extends Node

class_name BackgroundSystem

# public vars
var game: Game
var texture: Texture

# private vars
var _texture_rect = TextureRect.new()

func _ready():
  _texture_rect.stretch_mode = 2
  _texture_rect.texture = texture

  game.layers.background.add_child(_texture_rect)
  
func _process(_delta):
  var viewport_size = get_viewport().size

  _texture_rect.rect_size.x = viewport_size.x
  _texture_rect.rect_size.y = viewport_size.y
  

