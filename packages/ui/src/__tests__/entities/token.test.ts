import { nativeToUiAmount } from "../../entities/token/index"
import test from "ava"

test("should convert properly", (t) => {
  t.deepEqual(nativeToUiAmount(1e9), {
    uiAmount: 1,
    uiAmountString: "1.000000000",
  })
  t.deepEqual(nativeToUiAmount(1283782348), {
    uiAmount: 1.283782348,
    uiAmountString: "1.283782348",
  })

  t.pass()
})
