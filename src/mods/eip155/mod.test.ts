import { test } from "@hazae41/phobos";
import { SignedTransaction, UnsignedTransaction } from "./mod.ts";

test("eip155", () => {
  const utx = UnsignedTransaction.from({ nonce: 0n, gasPrice: 100n, startGas: 1000n, to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", value: 100n, data: new Uint8Array([1, 2, 3]), chainId: 1n })
  const stx = utx.sign(crypto.getRandomValues(new Uint8Array(65)))

  console.log(stx)

  const raw = stx.encode()

  console.log(raw)

  const stx2 = SignedTransaction.decode(raw)
  const utx2 = stx2.unsign()

  console.log(utx2)
})