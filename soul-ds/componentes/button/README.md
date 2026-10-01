# Button — Soul DS

Componente Button da Soul DS. Ação principal da interface. Use para disparar eventos, enviar formulários ou navegar entre telas.

## 📋 Variantes

O componente Button suporta 5 variantes:

- **primary** — Ação principal (destaque total)
- **outline** — Ação secundária (contorno)
- **link** — Ação terciária (apenas texto/link)
- **toggle** — Estado ligado/desligado (ativo/inativo)
- **icon** — Apenas ícone (circular)

## 🎯 Estados

Cada variante suporta os seguintes estados:

- **default** — Estado padrão
- **hover** — Ao passar o mouse
- **active** — Pressionado/Ativo
- **disabled** — Desabilitado

## 📖 Uso

```tsx
import { Button } from '@/componentes/button'

// Primário
<Button variant="primary" label="Clique em mim" />

// Outline
<Button variant="outline" label="Cancelar" />

// Link
<Button variant="link" label="Saiba mais" />

// Toggle
<Button variant="toggle" label="Opção 1" state="active" />

// Icon
<Button variant="icon" label="⚙️" aria-label="Configurações" />

// Com ícones
<Button variant="primary" label="Enviar" iconLeft="✉️" />
<Button variant="primary" label="Próximo" iconRight="→" />

// Desabilitado
<Button variant="primary" label="Desabilitado" disabled />
```

## 🎨 Props

### `variant?: ButtonVariant`

Define o estilo visual do botão.

- Tipo: `'primary' | 'outline' | 'link' | 'toggle' | 'icon'`
- Padrão: `'primary'`

### `label?: string`

Texto/rótulo do botão.

- Tipo: `string`
- Padrão: `undefined`

### `state?: ButtonState`

Define o estado visual do botão (css-driven).

- Tipo: `'default' | 'hover' | 'active' | 'disabled'`
- Padrão: `'default'`

### `iconLeft?: ReactNode`

Ícone à esquerda do texto.

- Tipo: `ReactNode`
- Padrão: `undefined`

### `iconRight?: ReactNode`

Ícone à direita do texto.

- Tipo: `ReactNode`
- Padrão: `undefined`

### `disabled?: boolean`

Desabilita o botão e impede cliques.

- Tipo: `boolean`
- Padrão: `false`

### `className?: string`

Classes CSS adicionais (para customizações).

- Tipo: `string`
- Padrão: `''`

### `onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void`

Callback executado ao clicar no botão.

- Tipo: `function`
- Padrão: `undefined`

## ♿ Acessibilidade

O componente segue as recomendações WCAG:

- ✅ **Focus Visible**: Indicador de foco visível para navegação por teclado
- ✅ **ARIA Labels**: Botões de ícone precisam de `aria-label` explícito
- ✅ **Disabled State**: Botões desabilitados têm atributo `disabled` e feedback visual
- ✅ **Reduced Motion**: Respeita `prefers-reduced-motion` do usuário
- ✅ **High Contrast**: Suporta modo `prefers-contrast: more`

### Exemplo com Acessibilidade

```tsx
// Botão de ícone com aria-label obrigatório
<Button 
  variant="icon" 
  label="🔔" 
  aria-label="Notificações" 
/>

// Botão desabilitado com feedback de por quê
<Button 
  variant="primary" 
  label="Salvar" 
  disabled 
  aria-disabled="true"
  title="Preencha o formulário para salvar"
/>

// Botão com nome descritivo em vez de "Clique aqui"
<Button 
  variant="primary" 
  label="Reservar sala" 
/>
```

## 🎨 Tokens e Customização

O componente usa **Design Tokens CSS** da Soul DS:

```css
/* Cores */
--color-primary-500      /* #238FB7 */
--color-primary-600      /* #20739A */
--color-primary-700      /* #205E7E */
--color-disabled-background
--color-disabled-foreground

/* Espaçamento */
--spacing-4              /* 4px */
--spacing-8              /* 8px */
--spacing-16             /* 16px */

/* Tipografia */
--font-family-body
--font-size-md
--font-weight-500
--line-height-md

/* Raio de borda */
--radius-8               /* 8px */
```

Para customizar cores/espaçamento, atualize os tokens CSS em `dist/soul-ds.css`.

## 📖 Storybook

Visualize todas as variantes e estados no Storybook:

```bash
npm run storybook
```

Acesse `http://localhost:6006` e navegue até **Componentes > Button**.

## 🔗 Code Connect

O componente inclui mapeamento automático **Code Connect** com Figma. Quando você seleciona uma instância do Button no Figma, o código correspondente é exibido automaticamente.

### Como usar Code Connect

1. Abra o arquivo Figma do componente
2. Selecione uma variante do Button
3. No painel Code Connect, veja o código React gerado automaticamente
4. Copie e cole no seu projeto

## ✅ Checklist de Uso

Antes de usar em produção:

- [ ] Testou todas as variantes no seu contexto
- [ ] Verificou acessibilidade (teclado + screen reader)
- [ ] Adicionou aria-label em botões de ícone puro
- [ ] Testou estado desabilitado com feedback visual
- [ ] Verificou :focus-visible em navegação por teclado
- [ ] Validou em temas diferentes (light/dark)
- [ ] Testou em mobile (touch)

## 🚨 Regras Críticas

Do design system:

1. ✋ Máximo **1 botão primary** por área visível
2. ✋ Nunca use **2 primary lado a lado** — o segundo deve ser outline
3. ✋ Botão de ícone sempre precisa de **aria-label** explícito
4. ✋ Sempre desabilite via **state=disabled**, nunca ocultando o botão

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade

## 🐛 Problemas Conhecidos

- `state=active` não disponível em primary, outline e link (apenas toggle tem)
- `state=focus` não disponível no Figma — use CSS `:focus-visible` no código
- Variante `destructive` existe no CSS mas não no Figma (pendência de design)
