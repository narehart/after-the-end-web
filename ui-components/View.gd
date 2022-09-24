extends ReactComponent

class_name ViewComponent

var rect_size
var rect_min_size

var margin: int = 0 setget set_margin
var margin_top: int = 0
var margin_right: int = 0
var margin_bottom: int = 0
var margin_left: int = 0

var padding: int = 0 setget set_padding
var padding_top: int = 0
var padding_right: int = 0
var padding_bottom: int = 0
var padding_left: int = 0

var size_flags_horizontal: int = Control.SIZE_EXPAND_FILL	
var size_flags_vertical: int = Control.SIZE_EXPAND_FILL
var size_flags_stretch_ratio: float = 1.0

var flex: bool = false
var flex_direction: String = "row"
var gap = 0

var theme

var debug = false

var _default_themes = {
   "panel": {
      "style": {
        ["panel", StyleBoxFlat]: {
          "border_width": 0,
          "border_color": Color("#00FFFFFF"),
          "bg_color": Color(0, 0, 0, 0.5) if debug else Color("#00FFFFFF")
        }
      },
   }
}

func set_margin(value: int):
  margin = value
  margin_top = value
  margin_right = value
  margin_bottom = value
  margin_left = value
  
func set_padding(value: int):
  padding = value
  padding_top = value
  padding_right = value
  padding_bottom = value
  padding_left = value

func render():
  return {
    "node": MarginContainer,
    "props": {
      "custom_constants/margin_top": margin_top,
      "custom_constants/margin_right": margin_right,
      "custom_constants/margin_bottom": margin_bottom,
      "custom_constants/margin_left": margin_left,
      "rect_size": rect_size,
      "rect_min_size": rect_min_size,
      "size_flags_horizontal": size_flags_horizontal,
      "size_flags_vertical": size_flags_vertical,
      "size_flags_stretch_ratio": size_flags_stretch_ratio
    },
    "children": [
      {
        "node": PanelContainer,
        "props": {
          "theme": theme if theme else _default_themes.panel,
        },
        "children": [
          {
            "node": MarginContainer,
            "props": {
              "custom_constants/margin_top": padding_top,
              "custom_constants/margin_right": padding_right,
              "custom_constants/margin_bottom": padding_bottom,
              "custom_constants/margin_left": padding_left,
            },
            "children": children if !flex else [
              {
                "node": VBoxContainer if flex_direction == "row" else HBoxContainer,
                "props": {
                  "custom_constants/separation": gap
                },
                "children": children
              }  
            ]
          }  
        ]
      }  
    ]
  }
  
func get_class() -> String: return "ViewComponent"
