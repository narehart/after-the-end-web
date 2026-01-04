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

1. Get list of component files to analyze, excluding:
   - **Primitives:** Box, Flex, Text, Button, Panel, Icon, Image, Input, List, ListItem, EmptyState
   - **Library essentials:** Modal, Breadcrumb (common UI patterns that belong in any component library)

2. For each component, launch a **component-analyzer** agent to analyze it

3. Collect all agent results and consolidate findings into:
   - Components that can be REMOVED (parent can render primitives directly)
   - Components that can be SIMPLIFIED (better primitive usage)
   - Missing primitive capabilities (props/variants to add to primitives)
   - Components that are fine as-is

4. Present a prioritized action plan focusing on:
   - Removing unnecessary abstraction layers
   - Adding missing props to existing primitives
   - Simplifying complex components

## Key Constraints

- Do NOT suggest creating new domain-specific components
- Do NOT suggest components that combine multiple responsibilities
- Prefer adding props to existing primitives over creating new ones
- Question whether each component even needs to exist
- NEVER suggest removing library essential components - patterns found in standard UI libraries (Ant Design, etc.) should exist regardless of current usage count
- NEVER suggest removing ListItem from components that are children of List - the `List > ListItem` relationship is semantically required for accessibility
