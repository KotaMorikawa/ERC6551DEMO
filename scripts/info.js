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

  const wallet2PrivateKey = process.env.PRIVATE_KEY_2;
  if (!wallet2PrivateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const wallet_2 = new ethers.Wallet(wallet2PrivateKey, provider);

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

  const code = await provider.getCode(account);
  let create = true;
  if (code == "0x") {
    create = false;
  }

  const ERC721Demo = new ethers.Contract(
    "0x0Db813ECE1b09a5CB1F0158F816dE073a0AAc1C8",
    [
      "function balanceOf(address account) external view returns (uint256)",
      "function mint(address account, uint256 tokenId) external",
      "function ownerOf(uint256 tokenId) external view returns (address)",
    ],
    wallet
  );

  const ERC20Demo = new ethers.Contract(
    "0xD928f55a2E7a2786d98b7Eb375a14EC67F9c3BA7",
    [
      "function balanceOf(address account) external view returns (uint256)",
      "function mint(address account, uint256 value) external",
      "function symbol() external view returns (string)",
    ],
    wallet
  );

  const erc721balance = await ERC721Demo.balanceOf(wallet_2.address);
  const balance1 = await ERC20Demo.balanceOf(wallet.address);
  const balance2 = await ERC20Demo.balanceOf(wallet_2.address);
  const erc20balance = await ERC20Demo.balanceOf(account);
  console.log("        | address                                    | ERC20");
  console.log(
    "wallet1",
    "|",
    wallet.address,
    "|",
    ethers.formatEther(balance1)
  );
  console.log(
    "wallet2",
    "|",
    wallet_2.address,
    "|",
    ethers.formatEther(balance2)
  );
  console.log("account", "|", account, "|", ethers.formatEther(erc20balance));
  console.log("".padStart(70, "-"));
  console.log("Create ", "|", create);
  console.log("ERC721 ", "|", wallet_2.address, erc721balance);
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
