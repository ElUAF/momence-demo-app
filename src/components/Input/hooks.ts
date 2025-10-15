import { useCallback, useState } from "react"

function keepMaxDecimals(value: string, maxDecimals: number) {
  const pattern = new RegExp(
    // Start of string
    "^" +
      // Group 1: Optional minus sign, followed by one or more digits (the integer part)
      "(-?\\d+)" +
      // Group 2 (Optional):
      //   Matches either a comma or a dot (decimal separator)
      //   Followed by 1 up to 'maxDecimals' digits
      `([,.]\\d{1,${maxDecimals}})?`,
    // No explicit end of string ($) to allow for truncation if needed,
    // but the match method will primarily look for the structure above.
  )

  const match = value.match(pattern)
  if (match) {
    return match[1] + (match[2] || "")
  }
  return value
}

export type InputChangeEvent = {
  target: {
    value: string
  }
}

export const useNumberInput = (
  config: { initialValue?: number; maxDecimals?: number } = {},
) => {
  const maxDecimals = config.maxDecimals
  const initialValue = config.initialValue || 0
  const [numberValue, setNumberValue] = useState(initialValue)
  const [value, setValue] = useState(`${initialValue}`)

  const onChange = useCallback(
    (e: InputChangeEvent) => {
      const newValue = maxDecimals
        ? keepMaxDecimals(e.target.value, maxDecimals)
        : e.target.value
      setValue(newValue)
      const newNumberValue = Number(newValue)
      if (!isNaN(newNumberValue)) {
        setNumberValue(newNumberValue)
      }

      return { newValue, newNumberValue }
    },
    [maxDecimals],
  )

  const setNumberValueCallback = useCallback(
    (numberValue: number) => {
      const newValue = maxDecimals
        ? numberValue.toFixed(maxDecimals)
        : `${numberValue}`

      setNumberValue(parseFloat(newValue) || numberValue)
      setValue(newValue)
    },
    [maxDecimals],
  )

  return {
    value,
    onChange,
    numberValue,
    setNumberValue: setNumberValueCallback,
    props: {
      value,
      onChange,
    },
  }
}
