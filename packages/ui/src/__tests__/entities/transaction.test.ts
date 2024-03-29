import { fromUiAmount } from "../../entities/transaction/index"
import test from "ava"

test("should convert properly", (t) => {
  t.is(fromUiAmount(0.0634524, 9), 63452400)
  t.is(fromUiAmount(0.066834, 9), 66834000)

  t.pass()
})
