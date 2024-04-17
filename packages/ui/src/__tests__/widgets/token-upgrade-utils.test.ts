import {
  getVariantByIndex,
  shortenAddress,
} from "../../widgets/token-upgrade/utils"
import { expect, test } from "vitest"

test("should shorten address", () => {
  expect(shortenAddress("Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um")).toEqual(
    "Bk9..8um",
  )
  expect(
    shortenAddress("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USDC"),
  ).toEqual("USDC")
  expect(
    shortenAddress("Bk9ErfcwzZ8MgSPdEgfmkreNHad9ik8jYP8um", undefined, 2),
  ).toEqual("Bk..um")
  expect(shortenAddress("Bk9")).toEqual("Bk9")
})

test("should get variant by index", () => {
  const variants = ["a", "b", "c", "d"]
  expect(getVariantByIndex(variants, 0)).toEqual("a")
  expect(getVariantByIndex(variants, 1)).toEqual("b")
  expect(getVariantByIndex(variants, 2)).toEqual("c")
  expect(getVariantByIndex(variants, 3)).toEqual("d")
  expect(getVariantByIndex(variants, 4)).toEqual("a")
  expect(getVariantByIndex(variants, 5)).toEqual("b")
  expect(getVariantByIndex(variants, 6)).toEqual("c")
  expect(getVariantByIndex(variants, 7)).toEqual("d")
  expect(getVariantByIndex(variants, 8)).toEqual("a")
  expect(getVariantByIndex(variants, 9)).toEqual("b")
  expect(getVariantByIndex(variants, 10)).toEqual("c")
  expect(getVariantByIndex(variants, 11)).toEqual("d")
  expect(getVariantByIndex(variants, 12)).toEqual("a")
})
