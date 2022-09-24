class_name Config

const rng_seed = "birdie"

const camera = {
  "pan_velocity": 10
}

const cursor = {
  "enabled": {
    "sprite": {
      "id": "hex-cursor",
      "offset": 6,
    }
  }
}

const map = {
  "background": "res://assets/images/map-background.png",
  "hex_size": Vector2(49.33, 42),
  "map_size": Vector2(100, 100),
  "map_padding": Vector2(200, 200)
}

const hex_data = {
  "water": {
    "name": "Water",
    "description": "Cold, wet and difficult to cross. Who knows what's lurking underneath.",
    "sprite": {
      "id": "hex-water-001",
      "offset": -6,
    },
    "animated_sprite": {
      "id": "hex-animations-water-001",
      "hframes": 5,
      "animations": {
        "name": "test",
        "keyframes": 1,
        "loop": true,
      }
    }
  },
  "swamp": {
    "name": "Swamp",
    "description": "Murky, overgrown wetland. Home to a variety of deadly creatures.",
    "sprite": {
      "id": "hex-swamp-003"
    }
  },
  "desert": {
    "name": "Desert",
    "description": "Dry, scorching, deadly. Full of hidden dangers and surprises.",
    "sprite": {
      "id": "hex-desert-002"
    }
  },
  "plains": {
    "name": "Plains",
    "description": "Temparate and vegetated. A place where strange and unusual creatures roam.",
    "sprite": {
      "id": "hex-plains-006"
    }
  },
  "forest": {
    "name": "Forest",
    "description": "Uneven and treacherous. There is a feeling of unease, as if something is watching you from the shadows.",
    "sprite": {
      "id": "hex-forest-003"
    }
  },
  "forest_heavy": {
    "name": "Dense Forest",
    "description": "Dark and foreboding. There is an eerie silence here, broken only by the sound of your own footsteps.",
    "sprite": {
      "id": "hex-forest-heavy-002"
    }
  },
  "forest_light": {
    "name": "Light Forest",
    "description": "Description.",
    "sprite": {
      "id": "hex-forest-light-002"
    }
  },
  "mountains": {
    "name": "Mountains",
    "description": "Description.",
    "sprite": {
      "id": "hex-mountains-003"
    }
  },
  "hills": {
    "name": "Hills",
    "description": "Description.",
    "sprite": {
      "id": "hex-hills-004"
    }
  },
  "desert_hills_rocky": {
    "name": "Dunes",
    "description": "Description.",
    "sprite": {
      "id": "hex-desert-hills-001"
    }
  },
  "forest_hills": {
    "name": "Forest Hills",
    "description": "Description.",
    "sprite": {
      "id": "hex-forest-hills-002"
    }
  },
  "forest_mountains": {
    "name": "Forest Mountains",
    "description": "Description.",
    "sprite": {
      "id": "hex-forest-mountains-002"
    }
  },
  "dominating_peak": {
    "name": "Dominating Peak",
    "description": "Description.",
    "sprite": {
      "id": "hex-dominating-peak-002"
    }
  },
  "desert_mountains": {
    "name": "Desert Mountains",
    "description": "Description.",
    "sprite": {
      "id": "hex-desert-mountains-001"
    }
  }
}

const terrain_assignment = {
  "water": {
    "primary": [
      {
        "type": "water",
        "chance": 100
      }
    ],
    "secondary": [
      {
        "type": "plains",
        "chance": 100
      }
    ],
    "tertiary": [
      {
        "type": "forest",
        "chance": 34
      },
      {
        "type": "forest_light",
        "chance": 66
      }
    ],
    "wildcard": [
      {
      "type": "swamp",
      "chance": 33
      },
      {
      "type": "plains",
      "chance": 33
      },
      {
      "type": "hills",
      "chance": 33
      }
    ]
  },
  "swamp": {
  "primary": [
    {
    "type": "swamp",
    "chance": 100
    }
  ],
  "secondary": [
    {
    "type": "plains",
    "chance": 100
    }
  ],
  "tertiary": [
    {
    "type": "forest",
    "chance": 100
    }
  ],
  "wildcard": [
    {
    "type": "water",
    "chance": 100
    }
  ]
  },
  "desert": {
  "primary": [
    {
    "type": "desert",
    "chance": 100
    }
  ],
  "secondary": [
    {
    "type": "desert_hills_rocky",
    "chance": 34
    },
    {
    "type": "desert",
    "chance": 66
    }
  ],
  "tertiary": [
    {
    "type": "plains",
    "chance": 100
    }
  ],
  "wildcard": [
    {
    "type": "water",
    "chance": 50
    },
    {
    "type": "desert_mountains",
    "chance": 50
    }
  ]
  },
  "plains": {
  "primary": [
    {
    "type": "plains",
    "chance": 100
    }
  ],
  "secondary": [
    {
    "type": "forest",
    "chance": 100
    }
  ],
  "tertiary": [
    {
    "type": "hills",
    "chance": 100
    }
  ],
  "wildcard": [
    {
    "type": "water",
    "chance": 33
    },
    {
    "type": "swamp",
    "chance": 33
    },
    {
    "type": "plains",
    "chance": 33
    }
  ]
  },
  "forest": {
  "primary": [
    {
    "type": "forest",
    "chance": 66
    },
    {
    "type": "forest_heavy",
    "chance": 34
    }
  ],
  "secondary": [
    {
    "type": "plains",
    "chance": 100
    }
  ],
  "tertiary": [
    {
    "type": "forest_hills",
    "chance": 66
    },
    {
    "type": "hills",
    "chance": 34
    }
  ],
  "wildcard": [
    {
    "type": "water",
    "chance": 33
    },
    {
    "type": "swamp",
    "chance": 33
    },
    {
    "type": "forest_mountains",
    "chance": 22
    },
    {
    "type": "mountains",
    "chance": 11
    }
  ]
  },
  "hills": {
  "primary": [
    {
    "type": "hills",
    "chance": 66
    },
    {
    "type": "forest_hills",
    "chance": 34
    }
  ],
  "secondary": [
    {
    "type": "mountains",
    "chance": 80
    },
    {
    "type": "plains",
    "chance": 20
    }
  ],
  "tertiary": [
    {
    "type": "plains",
    "chance": 100
    }
  ],
  "wildcard": [
    {
    "type": "water",
    "chance": 33
    },
    {
    "type": "swamp",
    "chance": 33
    },
    {
    "type": "mountains",
    "chance": 24
    },
    {
    "type": "hills",
    "chance": 9
    }
  ]
  },
  "mountains": {
  "primary": [
    {
    "type": "mountains",
    "chance": 80
    },
    {
    "type": "dominating_peak",
    "chance": 20
    }
  ],
  "secondary": [
    {
    "type": "hills",
    "chance": 100
    }
  ],
  "tertiary": [
    {
    "type": "forest",
    "chance": 66
    },
    {
    "type": "forest_mountains",
    "chance": 34
    }
  ],
  "wildcard": [
    {
    "type": "swamp",
    "chance": 100
    }
  ]
  }
}
