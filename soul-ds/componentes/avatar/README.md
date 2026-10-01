# Avatar — Soul DS

Representação visual do usuário. Exibe foto de perfil ou ícone substituto.

## 📋 Variantes

O componente Avatar suporta 2 variantes:

- **image** — Foto real do usuário. Exige `src` validada.
- **icon** — Ícone padrão (silhueta de pessoa) quando não há foto. Fallback automático.

> O componente resolve a variante sozinho: se `variant="image"` for passado sem `src`, ele
> renderiza `icon` automaticamente — não é possível acidentalmente mostrar um avatar de imagem
> quebrado.

## 📖 Uso

```tsx
import { Avatar } from '@/componentes/avatar'

// Com foto
<Avatar variant="image" src={fotoUrl} alt="Ana Beatriz" nome="Ana Beatriz" info="Enfermeira" />

// Sem foto (ícone fallback)
<Avatar variant="icon" nome="Carlos Souza" info="Sem foto cadastrada" />

// Compacto, sem nome/info (tabelas, comentários)
<Avatar variant="icon" textos={false} />
```

## 🎨 Props

### `variant?: AvatarVariant`

Define a variante visual do avatar.

- Tipo: `'image' | 'icon'`
- Padrão: `'image'` (mas cai para `'icon'` automaticamente se `src` não for informado)

### `src?: string`

URL da foto do usuário. Obrigatória para `variant="image"` surtir efeito.

- Tipo: `string`
- Padrão: `undefined`

### `alt?: string`

Texto alternativo descritivo da foto (WCAG 1.1.1). Se omitido, usa `nome` como fallback.

- Tipo: `string`
- Padrão: `nome` informado, ou string vazia se nenhum dos dois existir

### `nome?: string`

Nome completo do usuário.

- Tipo: `string`
- Padrão: `undefined`

### `info?: string`

Informação complementar (cargo, e-mail, etc.).

- Tipo: `string`
- Padrão: `undefined`

### `textos?: boolean`

Exibe nome e info ao lado do avatar. Use `true` em listagens de usuários, `false` em avatares
compactos (tabelas, comentários).

- Tipo: `boolean`
- Padrão: `true`

### `className?: string`

Classes CSS adicionais (para customizações).

- Tipo: `string`
- Padrão: `''`

## ♿ Acessibilidade

- `alt` descritivo obrigatório sempre que a foto for exibida (WCAG 1.1.1) — forneça `alt`
  explícito sempre que possível; o fallback para `nome` é apenas uma rede de segurança.
- O ícone de fallback é puramente decorativo (`aria-hidden="true"`, `focusable="false"`) —
  a informação relevante já está no texto (`nome`/`info`) ao lado, quando presente.

## 🎨 Tokens e Customização

O componente usa **Design Tokens CSS** da Soul DS:

```css
/* Cores */
--color-background        /* fundo do círculo do ícone fallback */
--color-primary           /* cor do ícone fallback */
--color-foreground        /* cor do nome */
--color-muted-foreground  /* cor da info */

/* Espaçamento */
--spacing-6
--spacing-8
--spacing-1-5

/* Tipografia */
--font-family-base
--font-size-sm
--font-size-xs
--font-weight-semibold
--font-weight-regular
--line-height-normal

/* Raio de borda */
--radius-full
```

O ícone de fallback (`mv-basico/pessoas/usuario`) foi resolvido via
`node soul-ds/scripts/find-icon.mjs "usuario"` — não foi desenhado à mão.

## 📝 Regras (copiadas de `components.json`)

**must:**
- variant=icon como fallback automático para usuários sem foto.

**mustNot:**
- variant=image sem a URL da foto validada.

## 🚨 Pendências conhecidas

- Sem tamanhos alternativos documentados no Figma (só o tamanho visto em `↪ avatar`) — se a DS
  precisar de avatares `sm`/`lg`, isso ainda não está desenhado.

## 📝 Referências

- [Componentes.json](../../data/components.json) — Contrato e status
- [SKILL.md](../../SKILL.md) — Design System documentation
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Padrões acessibilidade
