/**
 * Verification proof for contract 0xfea8c4afb88575cd89a2d7149ab366e7328b08eb
 * The official Ethereum Greeter tutorial - "Hello World!" on Ethereum.
 *
 * Compiles greeter.sol with soljson v0.1.1+commit.6ff4cd6 and compares
 * against on-chain creation bytecode.
 *
 * Usage:
 *   curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
 *   npm install solc
 *   node verify.js
 */

const fs = require("fs");
const path = require("path");

// Load the v0.1.1 soljson binary
const soljson = require(path.join(__dirname, "soljson-v0.1.1.js"));
const compile = soljson.cwrap("compileJSON", "string", ["string", "number"]);

// On-chain creation bytecode
const onchainFull = fs
  .readFileSync(path.join(__dirname, "onchain-creation.hex"), "utf8")
  .trim()
  .replace(/^0x/, "");

// Source code
const source = fs.readFileSync(path.join(__dirname, "greeter.sol"), "utf8");

// Compile with optimizer OFF
const result = JSON.parse(compile(source, 0));

if (result.errors && result.errors.length > 0) {
  console.error("Compilation errors:", result.errors);
  process.exit(1);
}

// The greeter contract (inherits mortal)
const compiledHex = result.contracts["greeter"].bytecode;

console.log("Compiler: soljson v0.1.1+commit.6ff4cd6");
console.log("Optimizer: OFF");
console.log("");
console.log("Compiled bytecode:", compiledHex.length / 2, "bytes");
console.log("On-chain creation tx:", onchainFull.length / 2, "bytes");

// The on-chain tx = compiled bytecode + ABI-encoded constructor args
// Constructor takes string "Hello World!" - 96 bytes of ABI encoding
const onchainCode = onchainFull.substring(0, compiledHex.length);
const constructorArgs = onchainFull.substring(compiledHex.length);

console.log("Constructor args:", constructorArgs.length / 2, "bytes");
console.log("");

if (compiledHex.toLowerCase() === onchainCode.toLowerCase()) {
  console.log("✅ EXACT MATCH - byte-for-byte identical (" + compiledHex.length / 2 + " bytes)");
  console.log("");
  console.log("Contract:  0xfea8c4afb88575cd89a2d7149ab366e7328b08eb");
  console.log("Block:     48,681 (August 7, 2015)");
  console.log("Deployer:  0x3d0768da09ce77d25e2d998e6a7b6ed4b9116c2d");
  console.log("Source:    greeter.sol (greeter is mortal)");
  console.log("Compiler:  soljson v0.1.1+commit.6ff4cd6");
  console.log("Settings:  optimizer off");
  console.log("");

  // Decode the constructor arg
  const argHex = constructorArgs.substring(128); // skip offset + length
  const greeting = Buffer.from(argHex, "hex").toString("utf8").replace(/\0/g, "");
  console.log("Constructor arg: \"" + greeting + "\"");
  console.log("");
  console.log("Note: This contract has since self-destructed (kill() was called).");
  console.log("The runtime bytecode on-chain is 0x, but the creation tx proves the original code.");
} else {
  console.log("❌ NO MATCH");
  for (let i = 0; i < Math.max(compiledHex.length, onchainCode.length); i++) {
    if ((compiledHex[i] || "").toLowerCase() !== (onchainCode[i] || "").toLowerCase()) {
      console.log("First difference at byte", Math.floor(i / 2));
      console.log("  Compiled:", compiledHex.substring(i, i + 20));
      console.log("  On-chain:", onchainCode.substring(i, i + 20));
      break;
    }
  }
  process.exit(1);
}
