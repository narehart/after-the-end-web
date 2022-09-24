class_name Grid

var grid = []
var layout: Layout
var grid_size: Vector2 = Vector2(0, 0)
var point_size: Vector2 = Vector2(0, 0)
var hex_size: Vector2
var point_padding: Vector2

func _init(_hex_size: Vector2, _point_padding: Vector2):
  hex_size = _hex_size
  point_padding = _point_padding
  
  var circumradius = Vector2(hex_size.x / 2, hex_size.y / sqrt(3))
  var origin = Vector2(hex_size.x / 2 + point_padding.x / 2, hex_size.y / 2 + point_padding.y / 2)
  
  layout = Layout.new(circumradius, origin)
  
func rectangle(size: Vector2):
  var o_hex = Hex.new(0, 0, 0)
  var x_hex = Hex.new(0, 0, 0)
  var y_hex = Hex.new(0, 0, 0)
  
  var q = 0;
  
  while q < size.x:
    var offset = floor(q / 2)
    var r = 0 - offset;
    
    while r < size.y - offset:
      var s = -q - r
      var hex = Hex.new(q, r, s)
      
      if (q > x_hex.q):
        x_hex = hex
      if (q >= y_hex.q && r >= y_hex.r):
        y_hex = hex
        
      grid.append(hex)
      
      r += 1
    
    q += 1
    
  grid_size = size
  
  var o_hex_point = layout.to_point(o_hex)
  var x_hex_point = layout.to_point(x_hex)
  var y_hex_point = layout.to_point(y_hex)
  
  point_size = Vector2(
    x_hex_point.x - o_hex_point.x + hex_size.x + point_padding.x,
    y_hex_point.y - o_hex_point.y + hex_size.y + point_padding.y
  )
  
  return grid
    

func to_index(h: Hex):
  var column_start = 0 - floor(h.q / 2)
  
  if h.q < 0:
    return -1
  if h.r < column_start:
    return -1;
  if h.r >= column_start + grid_size.y:
    return -1;
  
  var index = h.q * grid_size.y + (h.r - column_start)
  
  if index < 0:
    return -1
  if index > grid.size() - 1:
    return -1;
  
  return int(index)
