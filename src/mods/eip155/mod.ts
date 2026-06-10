import { RlpDataLike, RlpUintLike } from "@/libs/rlp/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { Rlp, RlpItem, RlpList } from "@hazae41/rlp";

export interface UnsignedTransactionInit {
  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly startGas: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly chainId: RlpUintLike
}

export class UnsignedTransaction {

  constructor(
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly startGas: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly chainId: RlpUintLike,
  ) { }

  static from(init: UnsignedTransactionInit): UnsignedTransaction {
    const { nonce, gasPrice, startGas, to, value, data, chainId } = init
    return new UnsignedTransaction(nonce, gasPrice, startGas, to, value, data, chainId)
  }

  static decode(bytes: Uint8Array): UnsignedTransaction {
    const list = RlpList.as(Readable.readFromBytes(Rlp, bytes))

    const nonce = RlpUintLike.from(RlpItem.as(list.value[0]))

    const gasPrice = RlpUintLike.from(RlpItem.as(list.value[1]))
    const startGas = RlpUintLike.from(RlpItem.as(list.value[2]))

    const to = RlpDataLike.from(RlpItem.as(list.value[3]))
    const value = RlpUintLike.from(RlpItem.as(list.value[4]))
    const data = RlpDataLike.from(RlpItem.as(list.value[5]))

    const chainId = RlpUintLike.from(RlpItem.as(list.value[6]))

    return new UnsignedTransaction(nonce, gasPrice, startGas, to, value, data, chainId)
  }

  encode(): Uint8Array {
    const nonce = RlpUintLike.into(this.nonce)

    const gasPrice = RlpUintLike.into(this.gasPrice)
    const startGas = RlpUintLike.into(this.startGas)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const chainId = RlpUintLike.into(this.chainId)

    const x = RlpUintLike.into(0)
    const y = RlpUintLike.into(0)

    const list = RlpList.from([nonce, gasPrice, startGas, to, value, data, chainId, x, y])

    return Writable.writeToBytes(list)
  }

  sign(signature: Uint8Array): SignedTransaction {
    const { nonce, gasPrice, startGas, to, value, data, chainId } = this

    const r = signature.slice(0, 32)
    const s = signature.slice(32, 64)
    const v = BigInt(chainId) * 2n + 35n + BigInt(signature[64] % 2)

    return new SignedTransaction(nonce, gasPrice, startGas, to, value, data, v, r, s)
  }

}

export interface SignedTransactionInit0 {
  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly startGas: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly v: RlpUintLike
  readonly r: RlpDataLike
  readonly s: RlpDataLike
}

export class SignedTransaction {

  constructor(
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly startGas: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly v: RlpUintLike,
    readonly r: RlpDataLike,
    readonly s: RlpDataLike,
  ) { }

  static from(init: SignedTransactionInit0): SignedTransaction {
    const { nonce, gasPrice, startGas, to, value, data, v, r, s } = init
    return new SignedTransaction(nonce, gasPrice, startGas, to, value, data, v, r, s)
  }

  static decode(bytes: Uint8Array): SignedTransaction {
    const list = RlpList.as(Readable.readFromBytes(Rlp, bytes))

    const nonce = RlpUintLike.from(RlpItem.as(list.value[0]))

    const gasPrice = RlpUintLike.from(RlpItem.as(list.value[1]))
    const startGas = RlpUintLike.from(RlpItem.as(list.value[2]))

    const to = RlpDataLike.from(RlpItem.as(list.value[3]))
    const value = RlpUintLike.from(RlpItem.as(list.value[4]))
    const data = RlpDataLike.from(RlpItem.as(list.value[5]))

    const v = RlpUintLike.from(RlpItem.as(list.value[6]))
    const r = RlpDataLike.from(RlpItem.as(list.value[7]))
    const s = RlpDataLike.from(RlpItem.as(list.value[8]))

    return new SignedTransaction(nonce, gasPrice, startGas, to, value, data, v, r, s)
  }

  encode(): Uint8Array {
    const nonce = RlpUintLike.into(this.nonce)

    const gasPrice = RlpUintLike.into(this.gasPrice)
    const startGas = RlpUintLike.into(this.startGas)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const v = RlpUintLike.into(this.v)
    const r = RlpDataLike.into(this.r)
    const s = RlpDataLike.into(this.s)

    const list = RlpList.from([nonce, gasPrice, startGas, to, value, data, v, r, s])

    return Writable.writeToBytes(list)
  }

  unsign(): UnsignedTransaction {
    const { nonce, gasPrice, startGas, to, value, data, v } = this

    const chainId = (BigInt(v) - 35n) / 2n

    return new UnsignedTransaction(nonce, gasPrice, startGas, to, value, data, chainId)
  }

}