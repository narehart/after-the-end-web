extends Node

class_name Actions

static func camera_set_position(position: Vector2):
  return {
    "type": ActionTypes.CAMERA_SET_POSITION,
    "payload": position
  }

static func camera_set_offset(offset: Vector2):
  return {
    "type": ActionTypes.CAMERA_SET_OFFSET,
    "payload": offset
  }

static func hex_select_set_index(index: int):
  return {
    "type": ActionTypes.HEX_SELECT_SET_INDEX,
    "payload": index
  }