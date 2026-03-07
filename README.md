# Verification Proof: Ethereum Greeter (Hello World!)

**Contract:** [`0xfea8c4afb88575cd89a2d7149ab366e7328b08eb`](https://etherscan.io/address/0xfea8c4afb88575cd89a2d7149ab366e7328b08eb)
**Block:** 48,681 (August 7, 2015)
**Deployer:** `0x3d0768da09ce77d25e2d998e6a7b6ed4b9116c2d`

## What is this?

The official Ethereum Greeter tutorial contract - the canonical "Hello World" example from Ethereum's earliest documentation. It stores a greeting string passed via the constructor and returns it when `greet()` is called.

The contract inherits from `mortal`, which gives the owner a `kill()` function using `suicide()` (the pre-`selfdestruct` opcode name). The contract has since been self-destructed - the runtime bytecode on-chain is `0x` - but the creation transaction preserves the original code.

Deployed by the same address that deployed the [First Executable Contract](https://github.com/cartoonitunes/first-executable-contract-verification) just 38 blocks earlier, both using soljson v0.1.1.

## Source Code

```solidity
contract mortal {
    address owner;
    function mortal() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
}

contract greeter is mortal {
    string greeting;
    function greeter(string _greeting) public {
        greeting = _greeting;
    }
    function greet() constant returns (string) {
        return greeting;
    }
}
```

Constructor argument: `"Hello World!"`

## Compiler

- **Version:** soljson v0.1.1+commit.6ff4cd6
- **Binary:** [soljson-v0.1.1+commit.6ff4cd6.js](https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js)
- **Optimizer:** OFF
- **Match:** Byte-for-byte identical, 692 bytes of compiled bytecode + 96 bytes of ABI-encoded constructor args = 788 bytes total

## Verification

```bash
# Download the compiler binary
curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js

# Install dependencies
npm install solc

# Run verification
node verify.js
```

## Files

- `greeter.sol` - Source code (mortal + greeter contracts)
- `verify.js` - Verification script
- `onchain-creation.hex` - Creation bytecode from deployment tx

## On-chain Data

- **Creation tx:** [`0x0640d3eb410e90008a73afc91cba70f6e3c91c2fe7cf2b7e073506f5da565f0f`](https://etherscan.io/tx/0x0640d3eb410e90008a73afc91cba70f6e3c91c2fe7cf2b7e073506f5da565f0f)
- **Status:** Self-destructed (runtime bytecode is `0x`)
- **Constructor arg:** "Hello World!" (ABI-encoded, 96 bytes)

## Context

This is the Ethereum "Hello World" - the first program most developers wrote when learning Ethereum in 2015. The `mortal` base contract pattern (owner + suicide) was a standard building block in early Solidity development. The same deployer also deployed the [First Executable Contract](https://github.com/cartoonitunes/first-executable-contract-verification) at block 48,643 using the same compiler, suggesting systematic early experimentation with Solidity.

Part of the [Ethereum History](https://ethereumhistory.com) verification effort - [awesome-ethereum-proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs).
