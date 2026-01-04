export default {
  extends: ['stylelint-config-standard'],
  plugins: [
    'stylelint-declaration-strict-value',
    'stylelint-value-no-unknown-custom-properties',
    'stylelint-selector-bem-pattern',
  ],
  rules: {
    // ============================================
    // AVOID ERRORS - All enabled
    // ============================================

    // Descending
    'no-descending-specificity': true,

    // Duplicates
    'no-duplicate-selectors': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-duplicate-custom-properties': true,
    'font-family-no-duplicate-names': true,
    'keyframe-block-no-duplicate-selectors': true,
    'no-duplicate-at-import-rules': true,

    // Empty
    'block-no-empty': true,
    'comment-no-empty': true,
    'no-empty-source': true,

    // Invalid
    'color-no-invalid-hex': true,
    'function-calc-no-unspaced-operator': true,
    'keyframe-declaration-no-important': true,
    'media-query-no-invalid': true,
    'named-grid-areas-no-invalid': true,
    'string-no-newline': true,

    // Irregular
    'no-irregular-whitespace': true,

    // Missing
    'custom-property-no-missing-var-function': true,
    'font-family-no-missing-generic-family-keyword': true,

    // Non-standard
    'function-linear-gradient-no-nonstandard-direction': true,

    // Overrides
    'declaration-block-no-shorthand-property-overrides': true,

    // Unknown
    'annotation-no-unknown': true,
    'at-rule-no-unknown': true,
    'function-no-unknown': true,
    'media-feature-name-no-unknown': true,
    'no-unknown-animations': true,
    'no-unknown-custom-media': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }],
    'unit-no-unknown': true,

    // Invalid comments
    'no-invalid-double-slash-comments': true,
    'no-invalid-position-at-import-rule': true,

    // ============================================
    // ENFORCE CONVENTIONS - Strict
    // ============================================

    // Disallow specific patterns
    'declaration-no-important': true,
    // Ban font/text properties - only allowed in index.css and Text.module.css
    'property-disallowed-list': [
      'font-size',
      'font-weight',
      'font-family',
      'font-style', // Not supported for pixel fonts
      'text-transform', // Use Text uppercase prop
      'letter-spacing', // Use Text spacing prop
    ],
    'declaration-property-value-disallowed-list': {
      display: ['flex', 'inline-flex'],
      color: ['/var\\(--text-(muted|secondary)\\)/'],
      'text-overflow': ['ellipsis'],
    },
    'selector-max-id': 0,
    'selector-max-universal': 1,
    'color-named': 'never',

    // Complexity limits
    'max-nesting-depth': 3,
    'selector-max-compound-selectors': 4,
    'selector-max-specificity': '0,4,0',
    'selector-max-combinators': 3,
    'selector-max-class': 3,
    'selector-max-attribute': 2,
    'selector-max-pseudo-class': 3,
    'selector-max-type': 2,

    // Custom property naming - enforce allowed prefixes for design tokens
    // Prefixes: font, space, z, shadow, size, bg, text, border, accent, base, ui, item, breadcrumb
    // Also allow: success, warning, danger (status colors)
    // Also allow: line, letter, opacity, transition, animation (typography/motion tokens)
    'custom-property-pattern': [
      '^(font|space|z|shadow|size|bg|text|border|accent|base|ui|item|breadcrumb|success|warning|danger|line|letter|opacity|transition|animation)(-[a-z0-9]+)*$',
      {
        message:
          'Custom property "${property}" must use an allowed prefix (font-, space-, z-, shadow-, size-, bg-, text-, border-, accent-)',
      },
    ],
    'selector-class-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*(--[a-z0-9]+(-[a-z0-9]+)*)?$',
    'keyframes-name-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',

    // Disallow redundant values
    'shorthand-property-no-redundant-values': true,
    'declaration-block-single-line-max-declarations': 1,

    // Notation preferences
    'alpha-value-notation': 'percentage',
    'color-function-notation': 'modern',
    'hue-degree-notation': 'angle',
    'import-notation': 'url',
    'lightness-notation': 'percentage',
    'media-feature-range-notation': 'context',
    'selector-not-notation': 'complex',
    'selector-pseudo-element-colon-notation': 'double',

    // Font
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'numeric',

    // Function
    'function-name-case': 'lower',
    'function-url-quotes': 'always',

    // Length
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],

    // Value
    'value-keyword-case': 'lower',
    'number-max-precision': 4,

    // No vendor prefixes (use autoprefixer instead)
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,

    // ============================================
    // PLUGINS
    // ============================================

    // Strict values - enforce CSS variables for design-related properties
    'scale-unlimited/declaration-strict-value': [
      [
        // Colors
        '/color$/',
        'fill',
        'stroke',
        'background',
        'border-color',
        'outline-color',
        // Outline
        'outline',
        'outline-width',
        'outline-style',
        // Typography (font-size/weight/family banned entirely via property-disallowed-list)
        'line-height',
        'letter-spacing',
        // Sizing
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        // Spacing
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'gap',
        'row-gap',
        'column-gap',
        // Borders
        'border',
        'border-width',
        'border-top',
        'border-right',
        'border-bottom',
        'border-left',
        // Layers
        'z-index',
        // Effects
        'box-shadow',
        'opacity',
        // Motion
        'transition',
      ],
      {
        ignoreFunctions: false,
        ignoreValues: [
          'currentcolor',
          'inherit',
          'initial',
          'transparent',
          'none',
          'unset',
          'auto',
          '0',
          '100%',
          '100vh',
          '100vw',
          'fit-content',
          '/^var\\(--[a-z0-9-]+\\)$/',
          '/^linear-gradient/',
          '/^radial-gradient/',
          '/^calc\\(/',
        ],
        disableFix: true,
        message: 'Use CSS custom properties (variables) for ${property}',
      },
    ],

    // Validate custom properties exist
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        importFrom: ['./src/index.css'],
      },
    ],

    // BEM naming convention (hyphenated variant)
    // Block: block-name
    // Element: block-name-element (single hyphen)
    // Modifier: block-name--modifier (double hyphen)
    'plugin/selector-bem-pattern': {
      componentName: '[a-z][a-z0-9]*(?:-[a-z0-9]+)*',
      componentSelectors: {
        // Match block, block-element, block--modifier, block-element--modifier
        initial: '^\\.{componentName}(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
        combined: '^\\.{componentName}(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      },
      utilitySelectors: '^\\.u-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$',
      ignoreSelectors: [
        // Ignore pseudo-elements and pseudo-classes on component selectors
        '^\\.',
      ],
      ignoreCustomProperties: [],
    },
  },
  overrides: [
    {
      // Root CSS file defines all variables and base styles
      files: ['src/index.css'],
      rules: {
        'scale-unlimited/declaration-strict-value': null,
        'selector-max-id': 1,
        'selector-max-universal': 2,
        'selector-max-specificity': '1,0,0',
        'declaration-property-value-disallowed-list': null,
        'property-disallowed-list': null,
      },
    },
    {
      // Text primitive defines all text styling
      files: ['src/components/primitives/Text.module.css'],
      rules: {
        'property-disallowed-list': null,
        'declaration-property-value-disallowed-list': null,
      },
    },
    {
      // Flex primitive can define display: flex
      files: ['src/components/primitives/Flex.module.css'],
      rules: {
        'declaration-property-value-disallowed-list': null,
      },
    },
    {
      // ListItem uses color for state styling
      files: ['src/components/primitives/ListItem.module.css'],
      rules: {
        'declaration-property-value-disallowed-list': null,
      },
    },
  ],
};
