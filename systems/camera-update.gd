extends Node

class_name CameraUpdateSystem

# public vars
var game
var hex_grid

# private vars
var _camera_node: Camera2D
var _key_codes = []

func _ready():
  _camera_node = Camera2D.new()
  _camera_node.current = true
  add_child(_camera_node)

func _input(event):
  if event is InputEventKey:
      if event.pressed && !_key_codes.has(event.scancode):
        _key_codes.append(event.scancode)
      if !event.pressed && _key_codes.has(event.scancode):
        var filtered = []
        for k in _key_codes:
          if k != event.scancode:
            filtered.append(k)
        _key_codes = filtered

func _process_input(position: Vector2):
  var changes = Vector2(0, 0)

  if _key_codes.has(KEY_W):
    changes.y -= 1
  if _key_codes.has(KEY_A):
    changes.x -= 1
  if _key_codes.has(KEY_S):
    changes.y += 1
  if _key_codes.has(KEY_D):
    changes.x += 1

  return position + changes.normalized() * Config.camera.pan_velocity


func _constrain_camera(camera: Vector2):
  var position = Vector2(0, 0)
  var viewport_size = get_viewport().size
  var scene_size = hex_grid.point_size
  
  var x_min = viewport_size.x / 4
  var x_max = scene_size.x - x_min
  var y_min = viewport_size.y / 4
  var y_max = scene_size.y - y_min

  if scene_size.x < viewport_size.x:
    position.x = 0

  if scene_size.y < viewport_size.y:
    position.y = 0

  position.x = floor(clamp(camera.x, x_min, x_max))
  position.y = floor(clamp(camera.y, y_min, y_max))

  return position

func _get_offset(camera: Vector2):
  var offset = Vector2(0, 0)
  var viewport_size = get_viewport().size
  
  offset.x = floor(max(0, camera.x - viewport_size.x / 4))
  offset.y = floor(max(0, camera.y - viewport_size.y / 4))
  
  return offset

func _process(_delta):
  var position: Vector2 = game.state_manager.get("camera.position")
  var offset: Vector2 = game.state_manager.get("camera.offset")
  
  position = _process_input(position)
  position = _constrain_camera(position)
  offset = _get_offset(position)
  
  _camera_node.set_position(position)

  game.state_manager.dispatch(Actions.camera_set_position(position))
  game.state_manager.dispatch(Actions.camera_set_offset(offset))

  
