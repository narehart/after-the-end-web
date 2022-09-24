extends ReactComponent

class_name MapHexInfoComponent

var hex_description
var hex_name
var hex_sprite_id
var theme

func render():
  return {
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
          "flex_direction": "column",
          "padding": 10,
          "rect_min_size": Vector2(425, 100),
          "size_flags_stretch_ratio": 0.01,
          "theme": theme.panel,
        },
        "children": [
          {
            "node": ViewComponent,
            "props": {
              "padding_bottom": 10,
              "rect_min_size": Vector2(80, 80),
              "size_flags_stretch_ratio": 0.25,
              "theme": theme.hex_info_sprite_container,
            },
            "children": [
              {
                "node": TextureRect,
                "props": {
                  "texture": Utils.id_to_sprite_path(hex_sprite_id),
                  "stretch_mode": TextureRect.STRETCH_KEEP_CENTERED,
                }
              }  
            ]
          },
          {
            "node": ViewComponent,
            "props": {
              "flex": true,
              "flex_direction": "row",
              "margin_left": 10,
              "size_flags_stretch_ratio": 1,
            },
            "children": [
              {
                "node": ViewComponent,
                "props": {
                  "margin_bottom": 10,
                  "size_flags_horizontal": Control.SIZE_FILL,
                  "size_flags_vertical": Control.SIZE_FILL,
                },
                "children": [
                  {
                    "node": Label,
                    "props": {
                      "text": hex_name,
                      "theme": theme.hex_info_heading,
                    }
                  }  
                ]
              },
              {
                "node": Label,
                "props": {
                  "autowrap": true,
                  "text": hex_description,
                  "custom_colors/font_color": Color("#979797"),
                  "theme": theme.hex_info_description,
                }
              }
            ]
          },
        ]
      },
    ]
  }
