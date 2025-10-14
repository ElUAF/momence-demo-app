import { centralBankDataParser } from "./centralBankDataParser"

describe("centralBankDataParser", () => {
  test("wrong payload throws an exception", () => {
    expect(() => centralBankDataParser("unexpected payload..")).toThrow()
  })

  test("sample with 1 row returns expected", () => {
    const actual = centralBankDataParser(`13 Oct 2025 #199
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.707`)

    expect(actual).toEqual({
      date: "2025-10-13",
      rates: [
        {
          country: "Australia",
          currency: "dollar",
          amount: 1,
          code: "AUD",
          rate: 13.707,
        },
      ],
    })
  })

  test("sample with 1 row and 1 row with different amount returns expected", () => {
    const actual = centralBankDataParser(`13 Oct 2025 #199
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.707
Thailand|baht|100|THB|64.669`)

    expect(actual).toEqual({
      date: "2025-10-13",
      rates: [
        {
          country: "Australia",
          currency: "dollar",
          amount: 1,
          code: "AUD",
          rate: 13.707,
        },
        {
          country: "Thailand",
          currency: "baht",
          amount: 100,
          code: "THB",
          rate: 64.669,
        },
      ],
    })
  })

  test("sample with 1 row different colum order returns expected", () => {
    const actual = centralBankDataParser(`13 Oct 2025 #199
Rate|Country|Currency|Amount|Code
13.707|Australia|dollar|1|AUD`)

    expect(actual).toEqual({
      date: "2025-10-13",
      rates: [
        {
          country: "Australia",
          currency: "dollar",
          amount: 1,
          code: "AUD",
          rate: 13.707,
        },
      ],
    })
  })
})
