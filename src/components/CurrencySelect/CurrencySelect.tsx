import { Select, type SelectProps } from "@/components/Select"

export interface CurrencySelectProps extends SelectProps {
  options: { code: string; name: string }[]
}

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { options, ...rest } = props
  return (
    <Select {...rest}>
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.code}
        </option>
      ))}
    </Select>
  )
}
