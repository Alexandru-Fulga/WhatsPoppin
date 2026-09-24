import Button from './Button'
import { AlertIcon, InfoIcon } from './icons'

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-3xl border border-border bg-surface px-7 py-16 text-center shadow-soft">
      <span className="mb-1 grid size-[58px] place-items-center rounded-full bg-flame/10 text-flame">
        <AlertIcon className="size-[26px]" />
      </span>
      <h3 className="text-[1.4rem]">{title}</h3>
      {message && <p className="max-w-[460px] text-muted">{message}</p>}
      {onRetry && (
        <Button className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, message, children }) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-3xl border border-border bg-surface px-7 py-16 text-center shadow-soft">
      <span className="mb-1 grid size-[58px] place-items-center rounded-full bg-flame/10 text-flame">
        <InfoIcon className="size-[26px]" />
      </span>
      <h3 className="text-[1.4rem]">{title}</h3>
      {message && <p className="max-w-[460px] text-muted">{message}</p>}
      {children}
    </div>
  )
}
