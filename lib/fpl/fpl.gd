class_name FPL

static func grab(obj: Dictionary, path: String):
  var keys: Array = path.split('.')
  var value = obj

  for i in keys.size():
    var k = keys[i]
    
    if value.has(k):
      var is_dict = typeof(value[k]) == TYPE_DICTIONARY
      var is_last = i == keys.size() - 1
      
      if !is_dict && !is_last:
        return null
      
      value = value[k]
    else:
      push_warning("Could not resolve path at `" + path + "`")
      return null
  
  return value

static func reflect_keys(obj: Dictionary):
  var keys = obj.keys()
  var res = {}

  for k in keys:
    res[k] = k

  return res

static func shallow_copy(dict):
  return shallow_merge(dict, {})

static func shallow_merge(src_dict, dest_dict):
  for i in src_dict.keys():
    dest_dict[i] = src_dict[i]
  return dest_dict

static func get_at_index(arr: Array, index: int):
  var arr_range = range(arr.size())
  return arr[index] if arr_range.has(index) else null
  
static func map_object_array_to_prop(arr: Array, prop: String):
  var res = []
  
  for el in arr:
    res.append(el[prop])
  
  return res
  
static func arr_join(arr, separator = ""):
    var output = "";
    for s in arr:
        output += str(s) + separator
    output = output.left( output.length() - separator.length() )
    return output

static func map(arr: Array, function: FuncRef) -> Array:
  var res = []
  res.resize(arr.size())
  for i in range(arr.size()):
    res[i] = function.call_func(arr[i])
  return res
