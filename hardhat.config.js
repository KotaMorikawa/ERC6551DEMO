require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : ""],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
