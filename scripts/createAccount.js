const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const chainId = 11155111;
  const implementation = "0x1c34299bF8e1d5cB5d4F2F5Fec1fdEe5De07B061";
  const salt =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const tokenContract = "0x0Db813ECE1b09a5CB1F0158F816dE073a0AAc1C8";
  const tokenId = 1;

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`
  );

  const walletPrivateKey = process.env.PRIVATE_KEY;
  if (!walletPrivateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const wallet = new ethers.Wallet(walletPrivateKey, provider);

  const ERC6551Registry = new ethers.Contract(
    "0xB37E42Ca4B1F0b714502455524c5d4dF16400ae9",
    [
      "function account(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId) external view returns (address)",
      "function createAccount(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId) external returns (address)",
    ],
    wallet
  );

  const account = await ERC6551Registry.account(
    implementation,
    salt,
    chainId,
    tokenContract,
    tokenId
  );

  console.log("Account Address:", account);

  const code = await provider.getCode(account);

  if (code == "0x") {
    console.log("No contract found at the account, creating a new account...");
    const tx = await ERC6551Registry.createAccount(
      implementation,
      salt,
      chainId,
      tokenContract,
      tokenId
    );
    console.log("Transaction sent, wainting for reciept...");
    const receipt = await tx.wait();
    console.log("Account created: ", receipt);
  }
  console.log("account: ", account);
}

main()
  .then(() => {
    process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
  });
