import styled from "styled-components"
import React, { useMemo } from "react"
import type { CurrencyRate } from "@/centralBankDataParser/centralBankDataParser"

export interface CurrencyRatesTableProps {
  rates: CurrencyRate[]
  caption?: string
  /** Highlight the row for this currency code */
  selectedCode?: string
  /** Called when a row is clicked, with the currency code */
  onSelectCode?: (code: string) => void
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  overflow: hidden;
  font-size: 14px;
`

const THead = styled.thead`
  background: rgba(255, 255, 255, 0.06);
`

const TH = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`

const TR = styled.tr.withConfig({
  shouldForwardProp: (prop) => !["$active", "$clickable"].includes(prop as string),
})<{$active?: boolean; $clickable?: boolean}>`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
  }

  ${(p) =>
    p.$active &&
    `
    background: rgba(94, 188, 243, 0.12);
    box-shadow: inset 0 0 0 2px rgba(94, 188, 243, 0.35);
    font-weight: 600;
  `}

  ${(p) =>
    p.$clickable &&
    `
    cursor: pointer;
    &:hover { background: rgba(255, 255, 255, 0.08); }
  `}
`

const TD = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`

const Caption = styled.caption`
  caption-side: top;
  text-align: left;
  padding: 8px 2px 10px 2px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
`

export const CurrencyRatesTable: React.FC<CurrencyRatesTableProps> = ({
  rates,
  caption,
  selectedCode,
  onSelectCode,
}) => {
  const ratesSorted = useMemo(
    () => rates.sort((a, b) => a.code.localeCompare(b.code)),
    [rates],
  )

  return (
    <Table>
      {caption && <Caption>{caption}</Caption>}
      <THead>
        <tr>
          <TH>Code</TH>
          <TH>Currency</TH>
          <TH>Amount</TH>
          <TH>Rate (CZK)</TH>
        </tr>
      </THead>
      <tbody>
        {ratesSorted.map((r) => (
          <TR
            key={r.code}
            $active={selectedCode === r.code}
            $clickable={!!onSelectCode}
            aria-selected={selectedCode === r.code}
            onClick={onSelectCode ? () => onSelectCode(r.code) : undefined}
          >
            <TD>{r.code}</TD>
            <TD>{r.currency}</TD>
            <TD>{r.amount}</TD>
            <TD>{r.rate}</TD>
          </TR>
        ))}
      </tbody>
    </Table>
  )
}

export default CurrencyRatesTable
