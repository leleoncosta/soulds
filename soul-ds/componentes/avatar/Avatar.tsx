import React from 'react'
import './Avatar.css'

export type AvatarVariant = 'image' | 'icon'

export interface AvatarProps {
  /** Variante visual do avatar. 'image' exige `src` validada — sem ela, cai automaticamente para 'icon' */
  variant?: AvatarVariant
  /** URL da foto do usuário (obrigatória para variant="image") */
  src?: string
  /** Texto alternativo da foto — obrigatório para acessibilidade quando a foto é exibida */
  alt?: string
  /** Nome completo do usuário */
  nome?: string
  /** Informação complementar (cargo, e-mail, etc.) */
  info?: string
  /** Exibe nome e info ao lado do avatar */
  textos?: boolean
  /** Classe CSS adicional */
  className?: string
}

/**
 * Componente Avatar da Soul DS
 *
 * Representação visual do usuário. Exibe foto de perfil ou ícone substituto.
 *
 * @example
 * <Avatar variant="image" src={fotoUrl} alt="Ana Beatriz" nome="Ana Beatriz" info="Enfermeira" />
 * <Avatar variant="icon" nome="Carlos Souza" info="Sem foto cadastrada" />
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ variant = 'image', src, alt, nome, info, textos = true, className = '' }, ref) => {
    // variant=image exige src validada — sem ela, fallback automático para icon (regra do contrato)
    const resolvedVariant: AvatarVariant = variant === 'image' && src ? 'image' : 'icon'

    const baseClasses = 'avatar'
    const variantClasses = `avatar--${resolvedVariant}`
    const finalClassName = [baseClasses, variantClasses, className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={finalClassName}>
        {resolvedVariant === 'image' ? (
          <img className="avatar__image" src={src} alt={alt ?? nome ?? ''} />
        ) : (
          <span className="avatar__icon-wrapper">
            {/* ícone resolvido via find-icon.mjs "usuario" → mv-basico/pessoas/usuario */}
            <svg
              className="avatar__icon"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C7.33 12 2 13.34 2 16V18H18V16C18 13.34 12.67 12 10 12Z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
        {textos && (nome || info) && (
          <div className="avatar__textos">
            {nome && <p className="avatar__nome">{nome}</p>}
            {info && <p className="avatar__info">{info}</p>}
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
