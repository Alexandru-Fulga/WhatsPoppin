export default function Container({ className = '', children, ...rest }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1288px] px-4 sm:px-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
