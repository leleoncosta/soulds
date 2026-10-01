import { figma } from '@figma/code-connect'
import { Button } from './Button'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Button do Figma
   com o componente Button.tsx do React, permitindo que designers vejam
   código automaticamente quando selecionam o componente no Figma.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * PRIMARY VARIANT
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=106:276',
  {
    props: {
      variant: figma.enum('variant', {
        primary: 'primary',
        outline: 'outline',
        link: 'link',
        toggle: 'toggle',
        icon: 'icon',
      } as const),
      label: figma.string('Label'),
      iconLeft: figma.boolean('icon left'),
      iconRight: figma.boolean('icon right'),
      disabled: figma.enum('state', {
        default: false,
        hover: false,
        active: false,
        disabled: true,
      } as const),
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * PRIMARY VARIANT - HOVER STATE
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:502',
  {
    props: {
      variant: 'primary' as const,
      label: figma.string('Label'),
      state: 'hover' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * PRIMARY VARIANT - DISABLED STATE
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:520',
  {
    props: {
      variant: 'primary' as const,
      label: figma.string('Label'),
      state: 'disabled' as const,
      disabled: true,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * OUTLINE VARIANT - DEFAULT
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:718',
  {
    props: {
      variant: 'outline' as const,
      label: figma.string('Label'),
      state: 'default' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * OUTLINE VARIANT - HOVER
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:722',
  {
    props: {
      variant: 'outline' as const,
      label: figma.string('Label'),
      state: 'hover' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * OUTLINE VARIANT - DISABLED
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:726',
  {
    props: {
      variant: 'outline' as const,
      label: figma.string('Label'),
      state: 'disabled' as const,
      disabled: true,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * LINK VARIANT - DEFAULT
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:906',
  {
    props: {
      variant: 'link' as const,
      label: figma.string('Label'),
      state: 'default' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * LINK VARIANT - HOVER
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:910',
  {
    props: {
      variant: 'link' as const,
      label: figma.string('Label'),
      state: 'hover' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * LINK VARIANT - DISABLED
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=107:914',
  {
    props: {
      variant: 'link' as const,
      label: figma.string('Label'),
      state: 'disabled' as const,
      disabled: true,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * TOGGLE VARIANT - ACTIVE
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=219:1382',
  {
    props: {
      variant: 'toggle' as const,
      label: figma.string('Label'),
      state: 'active' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * TOGGLE VARIANT - HOVER
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=219:1386',
  {
    props: {
      variant: 'toggle' as const,
      label: figma.string('Label'),
      state: 'hover' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * TOGGLE VARIANT - DISABLED
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=219:1390',
  {
    props: {
      variant: 'toggle' as const,
      label: figma.string('Label'),
      state: 'disabled' as const,
      disabled: true,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * TOGGLE VARIANT - DEFAULT
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=220:1444',
  {
    props: {
      variant: 'toggle' as const,
      label: figma.string('Label'),
      state: 'default' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * ICON VARIANT - DEFAULT
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=222:2733',
  {
    props: {
      variant: 'icon' as const,
      label: figma.string('Label'),
      state: 'default' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * ICON VARIANT - HOVER
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=222:2774',
  {
    props: {
      variant: 'icon' as const,
      label: figma.string('Label'),
      state: 'hover' as const,
      disabled: false,
    },
    example: (props) => <Button {...props} />,
  }
)

/**
 * ICON VARIANT - DISABLED
 */
figma.connect(
  Button,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=222:2780',
  {
    props: {
      variant: 'icon' as const,
      label: figma.string('Label'),
      state: 'disabled' as const,
      disabled: true,
    },
    example: (props) => <Button {...props} />,
  }
)
