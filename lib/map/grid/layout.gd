class_name Layout

var orientation = Orientation.new(
  3.0 / 2.0,
  0.0,
  sqrt(3.0) / 2.0,
  sqrt(3.0),
  2.0 / 3.0,
  0.0,
  -1.0 / 3.0,
  sqrt(3.0) / 3.0,
  0.0
)

var circumradius: Vector2
var origin: Vector2

func _init(_circumradius: Vector2, _origin: Vector2):
  circumradius = _circumradius
  origin = _origin

func to_point(h: Hex) -> Vector2:
  var m: Orientation = self.orientation
  var size: Vector2 = self.circumradius
  var x: float = (m.f0 * h.q + m.f1 * h.r) * size.x
  var y: float = (m.f2 * h.q + m.f3 * h.r) * size.y
  return Vector2(x + origin.x, y + origin.y)
  
func to_hex(p: Vector2):
  var m: Orientation = self.orientation
  var size: Vector2 = self.circumradius
  var pt: Vector2 = Vector2(
    (p.x - origin.x) / size.x,
    (p.y - origin.y) / size.y
  );
  var q: float = round(m.b0 * pt.x + m.b1 * pt.y);
  var r: float = round(m.b2 * pt.x + m.b3 * pt.y);
  return Hex.new(q, r, -q - r);

func corner_offset(corner: float):
  var m: Orientation = self.orientation
  var size: Vector2 = self.circumradius
  var angle: float = (2.0 * PI * (m.startAngle - corner)) / 6.0;
  return Vector2(
    size.x * cos(angle),
    size.y * sin(angle)
  )

func corners(h: Hex):
  var corners = []
  var center: Vector2 = self.to_point(h)
  
  for i in 5:
    var offset: Vector2 = self.corner_offset(i)
    corners.append(Vector2(center.x + offset.x, center.y + offset.y))
  
  return corners

  
