const { ethers } = require("hardhat");
require("dotenv").config();

const EXECUTE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint8",
        name: "operation",
        type: "uint8",
      },
    ],
    name: "execute",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const TRANSFER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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

  const Account = new ethers.Contract(account, EXECUTE_ABI, wallet_2);
  const to = "0xD928f55a2E7a2786d98b7Eb375a14EC67F9c3BA7";
  const value = 0;
  const iface = new ethers.Interface(TRANSFER_ABI);
  const data = iface.encodeFunctionData("transfer", [
    wallet.address,
    ethers.parseEther("1.0"),
  ]);
  const operation = 0;
  const tx = await Account.execute(to, value, data, operation);
  const receipt = await tx.wait();
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
