extends Node

class_name HexSelectSystem

# public vars
var game: Game
var hex_grid: Grid

func _process(_delta):
	var mouse_position = get_viewport().get_mouse_position()
	var camera_offset: Vector2 = game.state_manager.get("camera.offset")
	var maybe_hex = hex_grid.layout.to_hex(mouse_position + camera_offset)
	var index = hex_grid.to_index(maybe_hex)

	if index != -1:
		game.state_manager.dispatch(Actions.hex_select_set_index(index))