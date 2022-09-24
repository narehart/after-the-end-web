extends Node

class_name Game

var layers_config = {
  "background": {
    "layer": -1,
  },
  "ui": {
    "layer": 1,
    "scale": Vector2(0.5, 0.5)
  }
}
var layers = {}

var scene_node: Node
var state_manager: StateManager

func _ready():
  # setup state management
  var store = Store.new()
  state_manager = store.state_manager

  # set default scene
  change_scene("res://scenes/map.gd")

func change_scene(path: String):
  setup_layers()

  if (scene_node):
    scene_node.queue_free()
    scene_node = null

  scene_node = Node.new()
  scene_node.set_script(load(path))
  scene_node.game = self

  add_child(scene_node);

func setup_layers():
  var layer_keys = layers_config.keys()

  for key in layer_keys:
    var config = layers_config[key]

    if layers.has(key):
      layers[key].queue_free()
      layers[key] = null

    layers[key] = CanvasLayer.new()
    layers[key].layer = config.layer

    if config.has("scale"):
      layers[key].scale = config.scale

    add_child(layers[key])
