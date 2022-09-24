extends Node

class_name Store

var reducers = Reducers.new()
var state_manager = StateManager.new()
var _debug = false

func _init():
  state_manager.create([
    {
      "name": "camera",
      "instance": reducers,
    },
    {
      "name": "hex_select",
      "instance": reducers,
    },
    {
      "name": "game_log",
      "instance": reducers,
    }
  ], [
    {
      "name": "_on_store_changed",
      "instance": self
    }
  ])

func _on_store_changed(_name, _state):
  if _debug:
    print(state_manager.get())
