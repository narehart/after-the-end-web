extends Node

var sprite: Sprite
var player: AnimationPlayer

# https://godotengine.org/qa/36203/programmatically-add-a-frame-based-animation
class_name AnimationManager

func add_animations(animation_configs):
  var path = ":frame"

  animation_configs = animation_configs if typeof(animation_configs) == TYPE_ARRAY else [animation_configs]

  if !player:
    player = AnimationPlayer.new()
    sprite.add_child(player)

  for track_id in animation_configs.size():
    var config = animation_configs[track_id]
    var name = config.name if config.has("name") else "default"
    var animation = Animation.new()
    var keyframes = get_keyframes(config.keyframes)
    var length = keyframes_to_length(keyframes)
    
    animation.length = length
    animation.loop = config.loop
    animation.add_track(track_id)
    animation.track_set_path(track_id, path)
    animation.value_track_set_update_mode(track_id, Animation.UPDATE_DISCRETE)

    for frame in keyframes:
      animation.track_insert_key(track_id, frame.time, frame.key)

    var _id = player.add_animation(name, animation)

    if player.current_animation == "":
      player.set_current_animation(name)

func get_keyframes(keyframes):
  var type = typeof(keyframes)
  if (type == TYPE_REAL || type == TYPE_INT) && sprite.hframes:
    return hframes_to_keyframes(keyframes)

func hframes_to_keyframes(duration: float):
  var keyframes = []

  for i in sprite.hframes:
    keyframes.append({ "time": duration * i, "key": i })

  return keyframes

func keyframes_to_length(keyframes):
  var last = keyframes.size() - 1
  var diff = keyframes[last].time - keyframes[last - 1].time

  return keyframes[last].time + diff










