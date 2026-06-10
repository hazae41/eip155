# EIP-155

EIP-155 encoding for the web

```bash
npm install @hazae41/eip155
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/eip155)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Rust-like patterns

## Usage

```tsx
const utx = EIP155UnsignedTransaction.from({ nonce: 0n, gasPrice: 100n, startGas: 1000n, to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", value: 100n, data: new Uint8Array([1, 2, 3]), chainId: 1n })
const stx = utx.sign(key.sign(keccak256(utx.encode()))) // EIP155SignedTransaction

const raw = stx.encode() // Uint8Array
const hex = `0x${raw.toHex()}` // 0x...

const stx2 = EIP155SignedTransaction.decode(Uint8Array.fromHex(hex.slice(2)))
const utx2 = stx2.unsign() // EIP155UnsignedTransaction
```