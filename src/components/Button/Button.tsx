import styled, { css } from "styled-components"
import React from "react"

export type ButtonSize = "sm" | "md" | "lg"
export type ButtonVariant = "primary" | "secondary" | "ghost"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Make the button take full width of its container */
  $fullWidth?: boolean
  /** Visual style of the button */
  $variant?: ButtonVariant
  /** Control paddings and font-size */
  $size?: ButtonSize
}

const sizeStyles = {
  sm: css`
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 6px;
  `,
  md: css`
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    border-radius: 8px;
  `,
  lg: css`
    height: 44px;
    padding: 0 18px;
    font-size: 16px;
    border-radius: 10px;
  `,
}

const variantStyles = {
  primary: css`
    color: #0b1e2a;
    background: #5ebcf3;
    border: 1px solid #5ebcf3;

    &:hover {
      background: #79c8f6;
      border-color: #79c8f6;
    }

    &:active {
      background: #4fb2ee;
      border-color: #4fb2ee;
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(94, 188, 243, 0.35);
    }
  `,
  secondary: css`
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.35);
    }

    &:active {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.45);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(94, 188, 243, 0.25);
      border-color: #5ebcf3;
    }
  `,
  ghost: css`
    color: rgba(255, 255, 255, 0.85);
    background: transparent;
    border: 1px solid transparent;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    &:active {
      background: rgba(255, 255, 255, 0.08);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(94, 188, 243, 0.2);
      border-color: rgba(94, 188, 243, 0.5);
    }
  `,
}

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    !["$fullWidth", "$variant", "$size"].includes(prop),
})<ButtonProps>`
  appearance: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  letter-spacing: 0.2px;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;

  width: ${(p) => (p.$fullWidth ? "100%" : "auto")};

  ${(p) => sizeStyles[p.$size || "md"]}
  ${(p) => variantStyles[p.$variant || "secondary"]}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export default Button
