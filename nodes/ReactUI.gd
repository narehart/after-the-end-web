extends Node

class_name ReactUI

var container
var root_element
var _tree = {}
var _base_node_prop_list = {}
var _node_cache = {}

func _update_prop(node, name, value):  
  if name == "theme" && node is Control:
    if value.has("style"):
      _update_stylebox(node, value.style)
    if value.has("font"):
      _update_font(node, value.font)
  elif value is Vector2:
    if node[name] && node[name].is_equal_approx(value):
      return
    node[name] = value
  elif value is Color:
    if node[name] && node[name].is_equal_approx(value):
      return
    node[name] = value
  else:
    if node[name] == value:
      return
    node.set(name, value)

func _update_stylebox(node: Control, value):
  for i in value.keys():
    var name_type = i
    var name = name_type[0]
    var type = name_type[1]
    var styles = value[name_type]
    var style_keys = styles.keys()
    var style_box = node.get_stylebox(name)

    if not style_box is type:
      style_box = type.new()

    for k in style_keys:
      var style_value = styles[k]

      if k == "border_width":
        style_box.set_border_width_all(style_value)
      else:
        style_box[k] = style_value
    
    node.add_stylebox_override(name, style_box)

func _update_font(node, value):
  for i in value.keys():
    var name = i
    var props = value[name]
    var prop_keys = props.keys()
    var font = node.get_font(name)

    if not font is DynamicFont:
      font = DynamicFont.new()
      node.add_font_override(name, font)

    for k in prop_keys:
      var prop_value = props[k]
      if k == "src":
        prop_value = ResourceLoader.load(prop_value)
        font.font_data = prop_value
        continue
        font.set(k, prop_value)

func _update_children(tree_children, next_tree_has_children, next_tree, node):
  if tree_children.size() != 0 && !next_tree_has_children:
    for c in tree_children:
      c.queue_free()
  elif tree_children.size() == 0 && next_tree_has_children:
    for c in next_tree.children:
      _update_tree(null, c, node)
  elif tree_children.size() == next_tree.children.size():
    for i in tree_children.size():
      _update_tree(tree_children[i], next_tree.children[i], node)
  elif tree_children.size() > next_tree.children.size():
    var next_children_range = range(next_tree.children.size())
    for i in tree_children.size():
      if !next_children_range.has(i):
        tree_children[i].queue_free()
      else:
        _update_tree(tree_children[i], next_tree.children[i], node)
  elif tree_children.size() < next_tree.children.size():
    var children_range = range(tree_children.size())
    for i in next_tree.children.size():
      var c = tree_children[i] if children_range.has(i) else null
      _update_tree(c, next_tree.children[i], node)

func _update_tree(tree, next_tree, parent):
  var node = tree
  var is_new = false  
  var cached_node = _get_node_from_cache(next_tree.node)
  
  while cached_node.is_react_component:
    var next_tree_props = next_tree.props if next_tree.has("props") else null
    var next_tree_children = next_tree.children if next_tree.has("children") else null
    next_tree = _create_element(cached_node, next_tree_props, next_tree_children)
    cached_node = _get_node_from_cache(next_tree.node)
  
  if node == null:
    node = next_tree.node.new()
    is_new = true
  if cached_node.node != next_tree.node:
    tree.queue_free()
    node = next_tree.node.new()
    is_new = true
    

  var tree_children = node.get_children()
  var next_tree_has_children = next_tree.has("children") && next_tree.children != null
  
  if cached_node.default_children:
    var filtered_tree_children = []
    var next_tree_default_children = next_tree.default_children if next_tree.has("default_children") else {}
    
    for c in tree_children:
      var c_class = c.get_class()
      if !cached_node.default_children.has(c_class):
        filtered_tree_children.append(c)
      elif next_tree_default_children.has(c_class):
        var next_tree_default_child = next_tree_default_children[c_class]
        if next_tree_default_child.has('props'):
          for p in next_tree_default_child.props:
            _update_prop(c, p, next_tree_default_child.props[p])
        
    tree_children = filtered_tree_children

  if next_tree.has("props"):
    for p in next_tree.props:
      _update_prop(node, p, next_tree.props[p])
      
  if tree_children.size() != 0 || next_tree_has_children:	
    _update_children(tree_children, next_tree_has_children, next_tree, node)

  if is_new:
    parent.add_child(node)

func _create_element(cached_node, props = {}, children = null):
  if !props:
    props = {}
    
  for p in props.keys():
    cached_node.instance[p] = props[p]

  cached_node.instance.children = children

  var tree = cached_node.instance.render()

  for p in cached_node.default_props.keys():
    if p in cached_node.instance:
      cached_node.instance[p] = cached_node.default_props[p]

  return tree
  
func _get_node_class(node: Node):
  return node.get_class()

# Cache each unique node type so we can avoid create and deleting nodes for rendering
func _get_node_from_cache(node):
  if _node_cache.has(node):
    return _node_cache[node]
  else:
    var instance = node.new()
    var is_react_component = instance is ReactComponent
    var instance_prop_list = instance.get_property_list()
    var default_props = {}

    if is_react_component:
      for prop in instance_prop_list:
        if not prop.name in _base_node_prop_list:
          default_props[prop.name] = instance.get(prop.name)

    var cached_node = {
      "node": node,
      "instance": instance,
      "default_props": default_props,
#      "default_children": FPL.map_object_array_to_prop(instance.get_children(), "name"),
      "default_children": FPL.map(instance.get_children(), funcref(self, "_get_node_class")),
      "is_react_component": is_react_component,
    }

    _node_cache[node] = cached_node

    # add instance as child so it has access to methods only available in tree
    if is_react_component:
      add_child(instance)
    else:
      instance.queue_free()

    return cached_node

func _init(_root_element, _container):
  _base_node_prop_list = FPL.map_object_array_to_prop(Node.new().get_property_list(), "name")
  root_element = _root_element
  container = _container

func _process(_delta):
  var tree = FPL.get_at_index(container.get_children(), 0)
  _update_tree(tree, root_element, container)

func get_class() -> String: return "ReactUI"

