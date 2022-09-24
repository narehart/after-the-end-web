extends ReactComponent

class_name MapUIComponent

# props
var game: Game
var terrain: Terrain
var font_path = "res://assets/fonts/04b03-Regular.otf"

var debug = true
var debug_node = {
  "node": ColorRect,
  "props": {
    "color": Color("#00FFFFFF" if !debug else "#0d0d11"),
    "size_flags_horizontal": Control.SIZE_EXPAND_FILL,
    "size_flags_vertical": Control.SIZE_EXPAND_FILL,
  }
}

func map_log_to_nodes(log_str: String):
  var theme = {
    "game_log_list": {
      "font": {
        "font": {
          "size": 24.0,
          "use_filter": true,
          "src": font_path,
        }
      }
    },  
  }
  
  return {
    "node": ViewComponent,
    "props": {
      "margin_top": 5,
      "margin_right": 8,
      "margin_bottom": 5,
      "margin_left": 8,
    },
    "children": [
      {
        "node": Label,
        "props": {
          "text": log_str,
          "theme": theme.game_log_list,
          "custom_colors/font_color": Color("#979797"),
        },   
      }
    ]
  }

func render():
  var game_log: Array = game.state_manager.get("game_log")
  
  var hex_index: int = game.state_manager.get("hex_select.index")
  var type: String = terrain.hex_type[hex_index]
  var hex_data = Config.hex_data[type]

  var theme = {
    "panel": {
      "style": {
        ["panel", StyleBoxFlat]: {
          "border_width": 2,
          "border_color": Color("#4b5360"),
          "bg_color": Color("#0d0d11")
        }
      },
    },
    "scroll": {
      "style": {
        ["bg", StyleBoxFlat]: {
          "border_width": 0,
          "border_color": Color("#4b5360"),
          "bg_color": Color("#0d0d11")
        }
      },
    },
    "scroll_bar": {
      "style": {
        ["scroll", StyleBoxFlat]: {
          "border_width_left": 2,
          "border_width_bottom": 0,
          "border_color": Color("#4b5360"),
          "bg_color": Color("#0d0d11")
        },
        ["grabber", StyleBoxFlat]: {
          "bg_color": Color("#ddde56"),
          "expand_margin_left": -5.0,
          "expand_margin_right": -3.0,
          "expand_margin_top": -3.0,
          "expand_margin_bottom": -3.0,
          "content_margin_top": 10.0,
          "content_margin_bottom": 10.0,
        },
        ["grabber_highlight", StyleBoxFlat]: {
          "bg_color": Color("#ddde56"),
          "expand_margin_left": -5.0,
          "expand_margin_right": -3.0,
          "expand_margin_top": -3.0,
          "expand_margin_bottom": -3.0,
          "content_margin_top": 10.0,
          "content_margin_bottom": 10.0,
        },
        ["grabber_pressed", StyleBoxFlat]: {
          "bg_color": Color("#ddde56"),
          "expand_margin_left": -5.0,
          "expand_margin_right": -3.0,
          "expand_margin_top": -3.0,
          "expand_margin_bottom": -3.0,
          "content_margin_top": 10.0,
          "content_margin_bottom": 10.0,
        }
      }  
    },
    "hex_info_heading": {
      "font": {
        "font": {
          "size": 24.0,
          "use_filter": true,
          "src": font_path,
        }
      }
    },
    "hex_info_description": {
      "font": {
        "font": {
          "size": 24.0,
          "use_filter": true,
          "src": font_path,
        }
      }
    },
    "hex_info_sprite_container": {
      "style": {
        ["panel", StyleBoxFlat]: {
          "border_width": 2,
          "border_color": Color("#4b5360"),
          "bg_color": Color("#181c28")
        }
      },
    },
    "window_bar": {
      "style": {
        ["panel", StyleBoxFlat]: {
          "border_width_bottom": 2,
          "border_color": Color("#4b5360"),
          "bg_color": Color("#181c28")
        }
      }
    }
  }

  return {
    "node": ViewComponent,
    "props": {
      "margin": 10,
      "flex": true,
      "flex_direction": "column",
      "rect_size": get_viewport().size
    },
    "children": [
      {
        "node": ViewComponent,
        "props": {
          "flex": true,
          "flex_direction": "row",
          "size_flags_stretch_ratio": 0.01,
        },
        "children": [
          {
            "node": ViewComponent,
          },
          {
            "node": ViewComponent,
            "props": {
              "flex": true,
              "flex_direction": "row",
              "size_flags_stretch_ratio": 0.01,
              "rect_min_size": Vector2(500, 108),
              "theme": theme.panel,
            },
            "children": [
              {
                "node": ViewComponent,
                "props": {
                  "padding_left": 10,
                  "rect_min_size": Vector2(0, 34),
                  "theme": theme.window_bar,
                  "size_flags_stretch_ratio": 0.01,
                },
                "children": [
                  {
                    "node": Label,
                    "props": {
                      "text": "Event Log",
                      "theme": theme.hex_info_heading,
                    }
                  }  
                ]
              },
              {
                "node": ViewComponent,
                "props": {
                  "margin": 2,
                  "theme": theme.panel,
                },
                "children": [
                  {
                    "node": ScrollContainer,
                    "props": {
                      "theme": theme.scroll,
                    },
                    "default_children": {
                      "VScrollBar": {
                        "props": {
                          "rect_min_size": Vector2(14, 0),
                          "theme": theme.scroll_bar,
                        }
                      }
                    },
                    "children": [
                      {
                        "node": ViewComponent,
                        "props": {
                          "flex": true,
                          "flex_direction": "row",
                          "size_flags_horizontal": Control.SIZE_EXPAND,
                          "size_flags_vertical": Control.SIZE_EXPAND,
                          "margin_top": 5,
                          "margin_bottom": 5,
                        },
                        "children": FPL.map(game_log, funcref(self, "map_log_to_nodes"))
                      },
                    ]
                  },    
                ]
              },
            ]
          },
        ]
      },
      {
        "node": ViewComponent,
      },
      {
        "node": MapHexInfoComponent,
        "props": {
          "hex_description": hex_data.description,
          "hex_name": hex_data.name,
          "hex_sprite_id": hex_data.sprite.id,
          "theme": theme
        },
      }
    ]
  }
  
func get_class() -> String: return "MapUIComponent"
