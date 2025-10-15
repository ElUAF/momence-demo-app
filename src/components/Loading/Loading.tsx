import styled, { keyframes } from "styled-components"
import React from "react"

export interface LoadingProps {
  text?: string
  size?: number // diameter of spinner in px
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  color: rgba(255, 255, 255, 0.9);
  animation: ${fadeIn} 300ms ease-out both;
`

const Spinner = styled.div<{ $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  border: ${(p) => p.$size / 10}px solid rgba(255, 255, 255, 0.15);
  border-top-color: #5ebcf3;
  animation: ${spin} 900ms linear infinite;
`

const Text = styled.div`
  font-size: 14px;
  letter-spacing: 0.2px;
  color: rgba(255, 255, 255, 0.85);
`

export const Loading: React.FC<LoadingProps> = ({
  text = "Loading…",
  size = 36,
}) => {
  return (
    <Wrapper aria-live="polite" role="status">
      <Spinner $size={size} />
      <Text>{text}</Text>
    </Wrapper>
  )
}

export default Loading
