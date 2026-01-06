---
description: Analyze utility functions for redundant code and consolidation opportunities
---

Analyze utility functions in `src/utils/` for redundant code and consolidation opportunities.

Use the `util-analyzer` agent to:

1. Run the dupe-checker on each utility file to find similar code
2. Identify functions with overlapping logic
3. Find extraction opportunities for repeated patterns
4. Check interface consistency across similar utilities

Start by listing all utilities and prioritize analysis based on file size and recent modifications.
