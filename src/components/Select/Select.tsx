import styled, { css } from "styled-components"
import React from "react"

export type SelectSize = "sm" | "md" | "lg"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  $minWidth?: number
  $fullWidth?: boolean
  $hasError?: boolean
  $size?: SelectSize
}

const sizeStyles = {
  sm: css`
    height: 28px;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 6px;
  `,
  md: css`
    height: 36px;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 8px;
  `,
  lg: css`
    height: 50px;
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 10px;
  `,
}

export const Select = styled.select.withConfig({
  shouldForwardProp: (prop) =>
    !["$fullWidth", "$hasError", "$size", "$minWidth"].includes(prop),
})<SelectProps>`
  appearance: none;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.95);
  ${(p) => p.$minWidth && `min-width: ${p.$minWidth}px;`}
  width: ${(p) => (p.$fullWidth ? "100%" : "auto")};

  ${(p) => sizeStyles[p.$size || "md"]}

  &:hover {
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus {
    border-color: #5ebcf3;
    box-shadow: 0 0 0 3px rgba(94, 188, 243, 0.25);
    background: rgba(255, 255, 255, 0.1);
  }

  ${(p) =>
    p.$hasError &&
    css`
      border-color: #ff6b6b;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export default Select
