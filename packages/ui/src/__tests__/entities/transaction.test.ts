import { fromUiAmount } from "../../entities/transaction/index"
import { expect, test } from "vitest"

test("should convert properly", () => {
  expect(fromUiAmount(0.0634524, 9)).toEqual(63452400)
  expect(fromUiAmount(0.066834, 9)).toEqual(66834000)
})
