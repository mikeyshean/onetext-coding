export function Form({ onSubmit, children }: { onSubmit: (event: React.SyntheticEvent) => void, children: React.ReactNode }) {
  return (
    <form onSubmit={ onSubmit }>
      { children }
    </form>
  )
}