# Soul DS

Design System da MV — tokens, componentes React e documentação legível por humanos e IA.

## Estrutura do repositório

```
SoulDS/
└── soul-ds/                  pacote principal (tudo roda a partir daqui)
    ├── componentes/          componentes React + TypeScript (ex: button/)
    ├── data/                 dados estruturados (tokens, componentes, ícones)
    ├── dist/                 CSS e SVGs gerados — versionado de propósito
    ├── scripts/               validação, build e sincronização com Figma
    ├── references/            documentação de apoio (a11y, padrões, ADRs)
    ├── .storybook/             configuração do Storybook
    └── SKILL.md                guia de uso para agentes de IA
```

## Pré-requisitos

- Node.js **20+** (`node --version` para checar)
- npm 10+

## Instalação

```bash
git clone <url-do-repositorio>
cd SoulDS/soul-ds
npm install
```

## Comandos principais

```bash
# Ver os componentes no Storybook
npm run storybook

# Validar integridade do design system (ícones, componentes, tokens)
npm run verify

# Checar os tipos TypeScript dos componentes
npm run typecheck

# Gerar o CSS a partir dos tokens
npm run build

# Rodar a suíte de testes de regressão
npm run test

# Rodar tudo (equivalente ao CI)
npm run ci
```

Todos os comandos devem ser executados dentro de `soul-ds/`.

## Trabalhando com componentes

Os componentes React vivem em `soul-ds/componentes/<nome>/`, por exemplo:

```
soul-ds/componentes/button/
├── Button.tsx           componente
├── Button.css           estilos (usa os tokens de dist/soul-ds.css)
├── Button.stories.tsx   documentação Storybook
├── Button.connect.tsx   mapeamento Figma ↔ código (Code Connect)
├── index.ts              exports públicos
└── README.md             documentação do componente
```

Antes de criar um componente do zero, confira `soul-ds/data/components.json` —
se o `status` já for `stable` ou `designed`, implemente a partir do contrato
existente (props, variantes, regras), não reinvente.

## Code Connect (Figma)

O repositório usa [Code Connect](https://www.figma.com/code-connect-docs/) para
vincular os componentes do Figma ao código React.

```bash
# Publicar os mapeamentos (requer FIGMA_TOKEN com permissão de escrita)
npm run figma:publish
```

## Mais documentação

- [`soul-ds/README.md`](soul-ds/README.md) — arquitetura de dados do design system
- [`soul-ds/SKILL.md`](soul-ds/SKILL.md) — guia de uso (humanos e agentes de IA)
- [`soul-ds/references/a11y.md`](soul-ds/references/a11y.md) — decisões de acessibilidade
- [`soul-ds/ds.manifest.json`](soul-ds/ds.manifest.json) — estado atual e pendências
