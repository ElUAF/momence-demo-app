import styled, { css } from "styled-components"
import React from "react"

export type InputSize = "sm" | "md" | "lg"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Make the input take full width of its container */
  $fullWidth?: boolean
  /** Visual error state (red border) */
  $hasError?: boolean
  /** Control paddings and font-size */
  $size?: InputSize
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
    height: 44px;
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 10px;
  `,
}

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) =>
    !["$fullWidth", "$hasError", "$size"].includes(prop),
})<InputProps>`
  appearance: none;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.95);
  width: ${(p) => (p.$fullWidth ? "100%" : "auto")};

  ::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

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

export default Input
