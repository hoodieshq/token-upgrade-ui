import { nativeToUiAmount } from "../../entities/token/index"
import { expect, test } from "vitest"

test("should convert properly", () => {
  expect(nativeToUiAmount(1e9).uiAmount).toEqual(1)
  expect(nativeToUiAmount(1e9).uiAmountString).toEqual("1.000000000")
  expect(nativeToUiAmount(1283782348).uiAmount).toEqual(1.283782348)
  expect(nativeToUiAmount(1283782348).uiAmountString).toEqual("1.283782348")
})
