const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`
  );

  const walletPrivateKey = process.env.PRIVATE_KEY;
  if (!walletPrivateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const wallet = new ethers.Wallet(walletPrivateKey, provider);

  const wallet2PrivateKey = process.env.PRIVATE_KEY_2;
  if (!wallet2PrivateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const wallet_2 = new ethers.Wallet(wallet2PrivateKey, provider);

  const ERC721Demo = new ethers.Contract(
    "0x0Db813ECE1b09a5CB1F0158F816dE073a0AAc1C8",
    [
      "function balanceOf(address account) external view returns (uint256)",
      "function mint(address account, uint256 tokenId) external",
      "function ownerOf(uint256 tokenId) external view returns (address)",
    ],
    wallet
  );

  const tokenId = 1;
  const balance = await ERC721Demo.balanceOf(wallet_2.address);

  if (balance == 0) {
    const tx = await ERC721Demo.mint(wallet_2.address, tokenId);
    const receipt = await tx.wait();
    console.log("mint", wallet_2.address, tokenId);
  }
  const owner = await ERC721Demo.ownerOf(tokenId);
  console.log("ownerOf", tokenId, owner);
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
