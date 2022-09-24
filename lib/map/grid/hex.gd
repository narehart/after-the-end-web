class_name Hex

var q: float = 0
var r: float = 0
var s: float = 0

func _init(_q: float, _r: float, _s: float):
  assert(round(_q + _r + _s) != 01, "q + r + s must be 0")
  q = _q
  r = _r
  s = _s
  
  
func equals(h: Hex):
  return self.q == h.q && self.r == h.r && self.s == h.s
  
func add(h: Hex):
  return get_script().new(q + h.q, r + h.r, s + h.s)
  
func subtract(h: Hex):
  return get_script().new(q - h.q, r - h.r, s - h.s)
  
func length(h: Hex):
  return (abs(h.q) + abs(h.r) + abs(h.s)) / 2
  
func distance(h: Hex):
  return self.length(self.subtract(h))
  
func direction(d: int):
  var directions = [
    get_script().new(1, 0, -1), # bottom right
    get_script().new(1, -1, 0), # top right
    get_script().new(0, -1, 1), # top
    get_script().new(-1, 0, 1),
    get_script().new(-1, 1, 0),
    get_script().new(0, 1, -1), # bottom
  ]
  
  return directions[d]
  
func neighbor(d: int):
  return self.add(self.direction(d))
  
func diagonal_neighbor(d: int):
  var diagonals = [
    get_script().new(2, -1, -1),
    get_script().new(1, -2, 1),
    get_script().new(-1, -1, 2),
    get_script().new(-2, 1, 1),
    get_script().new(-1, 2, -1),
    get_script().new(1, 1, -2),
  ]

  return self.add(diagonals[d])

func round():
  var qi: float = round(self.q)
  var ri: float = round(self.r)
  var si: float = round(self.s)
  
  var q_diff: float = abs(qi - self.q)
  var r_diff: float = abs(ri - self.r)
  var s_diff: float = abs(si - self.s)
  
  if (q_diff > r_diff && q_diff > s_diff):
    qi = -ri - si
  elif(r_diff > s_diff):
    ri = -qi - si
  else:
    si = -qi - ri
    
  return get_script().new(qi, ri, si)

func lerp(h: Hex, t: float):
  return get_script().new(
    self.q * (1.0 - t) + h.q * t,
    self.r * (1.0 - t) + h.r * t,
    self.s * (1.0 - t) + h.s * t
  )
  
func line_draw(h: Hex):
  var n: float = self.distance(h)
  var a_nudge: Hex = get_script().new(self.q + 1e-6, self.r + 1e-6, self.s - 2e-6)
  var b_nudge: Hex = get_script().new(h.q + 1e-6, h.r + 1e-6, h.s - 2e-6)
  var results = []
  var step: float = 1.0 / max(n, 1)
  
  for i in n:
    results.append(a_nudge.lerp(b_nudge, step * i).round())
  
  return results
    
  



