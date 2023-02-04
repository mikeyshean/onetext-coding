export function Button({ text, loadingText, isLoading }: { text: string, loadingText: string, isLoading: boolean }) {
  return (
    <input type="submit" value={ isLoading ? loadingText : text } />
  )
}