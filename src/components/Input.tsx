export function Input({
  id,
  type,
  label,
  value,
  onValue,
  required
}: {
  id: string,
  type: string,
  label: string,
  value: string,
  onValue: (value: string) => void
  required: boolean
}) {

  return <>
    <label>
      {label}
    </label>
    <input
      id={ id }
      type={ type }
      value={ value }
      onChange={(e) => onValue(e.target.value)}
      required={ required }
    />

  </>
}