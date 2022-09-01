# Preproduction

## Analysis

Make a game that plays similarly to neo scavanger.

## Premise

A post apocalyptic, survival RPG that plays like a hexcrawl.

## Scope

2 years

## Game Design

### Overview

A post apocalyptic, survival RPG that plays like a hexcrawl. Primarily the gameplay involves the player moving their character around an overworld map looking for resources to keep themselves alive, healthy, and happy; gather items to increase their resilience; find and complete quests; and look for interesting encounters.

### Status Bars

Status bars are used to represent the players status in regard to certain needs based on [Maslow's hierarchy of needs](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs) and stats. These status bars are depleted over time (the player grows hungry), by certain player stasus (infection), and by certain world statuses (a drop in temperature). Status bars are increased over time (an injury heals), by removal of player status (antibotics cure infection), and by change in world status (player moves somewhere warmer). Some status bars are only visible when the player has certain attributes.

| name               | visibility requirement | decreased by                                             | increased by                             |
| :----------------- | ---------------------- | -------------------------------------------------------- | ---------------------------------------- |
| nourishment        | none                   | time                                                     | food, liquids other than water           |
| hydration          | none                   | time, weather, terrain type, dehydrating foods, ailments | water, most foods                        |
| rest               | none                   | time, moving quickly, combat, certain foods              | sleeping                                 |
| comfort (hot/cold) | none                   | cold weather, cold terrain, removing clothing            | hot weater, hot terrain, adding clothing |

### Map

The majority of the gameplay takes place on a procedurally generated hex grid. Each hex is of a terrain type and can contain enemies for combat, resources to scavange, locations, and encounters. Additionally, the map features a day/night cycle and weather system.

### Terrain

As mentioned each hex is a type of terrain. Terrain type helps determine movement APC, overall temperature, types of resources available to scavange, enemy types, location types, and encounter types.

| name            | APC | temperature | resources available | enemy types | location types | encounter types |
| :-------------- | --- | ----------- | ------------------- | ----------- | -------------- | --------------- |
| water           | ∞   |             |                     | human       |                |                 |
| swamp           | 2   |             |                     | human       |                |                 |
| desert          | 2   |             |                     | human       |                |                 |
| plains          | 1   |             |                     | human       |                |                 |
| hills           | 2   |             |                     | human       |                |                 |
| forest          | 2   |             |                     | human       |                |                 |
| mountians       | 3   |             |                     | human       |                |                 |
| dominating peak | ∞   |             |                     | human       |                |                 |

### Movement

Movement is the most basic action. The player can move to any adjacent hex as long as they have the available action points. The action point cost (APC) is determined by the terrain type. For example, a plains hex will have a low APC while a mountain hex would have a very high APC. The APC of movement can also be affected by global statuses (weather, time of day, etc), hex statuses (radiation, debris, etc), and player statuses (extreme tiredness, injury, lack of proper clothing). The hex a player moves to can also affect the depletion of Status Bars. For example a desert hex will increase the rate of dehydration faster than a plains hex.

### Movement Types

Users can also select from different movement types to modify the affect on Status Bars, passage of time, player status, and chance of encounters.

**Normally**: No modifiers.

**Quickly**: Decreases APC of movement. Chance of combat encounters increases. Chance of non-combat encounters decreases. Chance to identify resources decreases. Rate of fatigue increases. Chance of injury increases and are more severe.

**Slowly**: Increases APC of movment. Chance of combat encounters decreases. Chance of non-combat encounters increases. Chance to identify resources increases. Chance of injury decreases.

### Layers

- Map
- Player character
- Action Point system
- Fog of war system
- Movement
- Basic human enemy npc
- Combat

### Milestones

- Milestone 1: map
- Milestone 2: movement around the map with fog of war
- Milestone 3: enemy npcs
- Milestone 4: combat
- Milestone 5: inventory
- Milestone 6: resource generation
- Milestone 7: scavenging
- Milestone 8: crafting
- Milestone 9: encounters system
- Milestone 10: locations
- Milestone 11: encounters copy/art
- Milestone 12: dialogue system
- Milestone 13: quest system
- Milestone 14: quest copy/art
- Milestone 15: ???

## Production

- Consistent schedule
- Outcome for each block of time
- Build the layers
- Iterate
- Reevaluate Milestones
- Prioritize player "fun"

## Last 20%

- What needs to be done to ship
- Give yourself a ship-date
- Accept imperfection

## Release

!!!
