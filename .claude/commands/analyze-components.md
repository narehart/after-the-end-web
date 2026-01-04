---
description: Analyze components for simplification opportunities using primitives
argument-hint: Optional component name or path pattern
---

# Component Analysis

Analyze React components to identify simplification opportunities by better use of existing primitives.

## Scope

$ARGUMENTS

If no arguments provided, analyze all components in `src/components/`.

## Process

1. Get list of component files to analyze, excluding standard components:

   Alert, Anchor, Avatar, Badge, Box, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, Collapse, DatePicker, Descriptions, Divider, Drawer, Dropdown, EmptyState, Flex, Form, Grid, Icon, Image, Input, Layout, List, ListItem, Menu, Message, Modal, Notification, Pagination, Panel, Popconfirm, Popover, Progress, Radio, Rate, Result, Select, Skeleton, Slider, Space, Spin, Splitter, Statistic, Steps, Switch, Table, Tabs, Tag, Text, TimePicker, Timeline, Tooltip, Tour, Transfer, Tree, TreeSelect, Typography, Upload

2. For each component, launch a **component-analyzer** agent to analyze it

3. Collect all agent results and consolidate findings into:
   - Components that can be REMOVED (parent can render standard components directly)
   - Components that can be SIMPLIFIED (better standard component usage)
   - Missing capabilities (props/variants to add to standard components)
   - Components that are fine as-is

4. Present a prioritized action plan focusing on:
   - Removing unnecessary abstraction layers
   - Adding missing props to existing standard components
   - Simplifying complex components

## Key Constraints

- Do NOT suggest creating new domain-specific components
- Do NOT suggest components that combine multiple responsibilities
- Prefer adding props to existing standard components over creating new ones
- Question whether each component even needs to exist
- NEVER suggest removing or modifying standard components
- NEVER suggest removing ListItem from components that are children of List - the `List > ListItem` relationship is semantically required for accessibility
