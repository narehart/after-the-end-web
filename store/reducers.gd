extends Node

class_name Reducers

var default_state = {
  "camera": {
    "position": Vector2(0, 0),
    "offset": Vector2(0, 0)
  },
  "hex_select": {
    "index": 0,
  },
  "game_log": [
    "Game started.",   
  ],
}

func camera(state, action):
  if action.type == ActionTypes.CAMERA_SET_POSITION:
    var next_state = FPL.shallow_copy(state)
    next_state.position = action.payload
    return next_state

  if action.type == ActionTypes.CAMERA_SET_OFFSET:
    var next_state = FPL.shallow_copy(state)
    next_state.offset = action.payload
    return next_state

  return state

func hex_select(state, action):
  if action.type == ActionTypes.HEX_SELECT_SET_INDEX:
    var next_state = FPL.shallow_copy(state)
    next_state.index = action.payload
    return next_state

  return state
  
func game_log(state, action):
  if action.type == ActionTypes.GAME_LOG_APPEND:
    var next_state: Array = FPL.shallow_copy(state)
    next_state.append(action.payload)
    return next_state
    
  return state
    
