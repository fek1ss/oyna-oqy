/** Картинка без перетаскивания, выделения и контекстного меню. */
export function Picture({ src, className = '' }: { src: string; className?: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none pointer-events-none ${className}`}
    />
  )
}
