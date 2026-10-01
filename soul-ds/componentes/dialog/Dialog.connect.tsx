import { figma } from '@figma/code-connect'
import { Dialog } from './Dialog'
import { Button } from '../button/Button'

/* ───────────────────────────────────────────────────────────────────────────
   Code Connect — Mapeia o componente Figma para o código React

   Este arquivo vincula automaticamente o componente Dialog do Figma
   com o componente Dialog.tsx do React. Os botões "Sencundário"/"Principal"
   do Figma são instâncias do próprio componente Button — reaproveitadas aqui.
   ─────────────────────────────────────────────────────────────────────────── */

figma.connect(
  Dialog,
  'https://www.figma.com/design/N905bwbVakikHDGQzo5aKC/Soul-DS---2026?node-id=561:5433',
  {
    props: {
      titulo: figma.string('Titulo'),
      btn: figma.boolean('btn'),
      children: figma.instance('dialog content'),
    },
    example: (props) => (
      <Dialog
        open
        onClose={() => {}}
        titulo={props.titulo}
        btn={props.btn}
        footer={
          <>
            <Button variant="outline" label="Secundário" />
            <Button variant="primary" label="Principal" />
          </>
        }
      >
        {props.children}
      </Dialog>
    ),
  }
)
