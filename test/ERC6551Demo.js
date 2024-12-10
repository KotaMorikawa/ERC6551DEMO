const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, ignition } = require("hardhat");
const ERC6551Demo = require("../ignition/modules/ERC6551Demo");

describe("ERC6551Demo", function () {
  async function deployFixture() {
    const [signer1, signer2] = await ethers.getSigners();
    const { ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo } = await ignition.deploy(ERC6551Demo);
    return { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 };
  }

  describe("ERC20Demo", function () {
    it("name", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      expect(await ERC20Demo.name()).to.equal("Demo Token");
    });
    it("symbol", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      expect(await ERC20Demo.symbol()).to.equal("DTC");
    });
  });

  describe("ERC721Demo", function () {
    it("name", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      expect(await ERC721Demo.name()).to.equal("Demo NFT");
    });
    it("symbol", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      expect(await ERC721Demo.symbol()).to.equal("DNT");
    });
  });

  describe("ERC6551Account", function () {
    it("supportsInterface IERC6551Account", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      let interfaceId = ethers.keccak256(ethers.toUtf8Bytes("token()")).substring(0, 10);
      interfaceId ^= ethers.keccak256(ethers.toUtf8Bytes("state()")).substring(0, 10);
      interfaceId ^= ethers.keccak256(ethers.toUtf8Bytes("isValidSigner(address,bytes)")).substring(0, 10);
      expect(await ERC6551Account.supportsInterface("0x" + interfaceId.toString(16).padStart(8, "0"))).to.equal(true);
    });
    it("supportsInterface IERC6551Executable", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      let interfaceId = parseInt(ethers.keccak256(ethers.toUtf8Bytes("execute(address,uint256,bytes,uint8)")).substring(0, 10), 16);
      expect(await ERC6551Account.supportsInterface("0x" + interfaceId.toString(16).padStart(8, "0"))).to.equal(true);
    });
  });

  describe("ERC6551Registry", function () {
    it("account", async function () {
      const { ERC20Demo, ERC721Demo, ERC6551Account, ERC6551Registry, signer1, signer2 } = await loadFixture(deployFixture);
      const implementation = ERC6551Account.target;
      const salt = 0;
      const chainId = (await signer1.provider.getNetwork()).chainId;
      const tokenContract = ERC721Demo.target;
      const tokenId = 1;
      const initCode = ethers.concat([
        "0x3d60ad80600a3d3981f3363d3d373d3d3d363d73",     // ERC-1167 Constructor + Header  (20 bytes)  
        implementation,                                   // implementation (address)       (20 bytes)
        "0x5af43d82803e903d91602b57fd5bf3",               // ERC-1167 Footer                (15 bytes)
        ethers.zeroPadValue(ethers.toBeHex(salt), 32),    // salt (uint256)                 (32 bytes)
        ethers.zeroPadValue(ethers.toBeHex(chainId), 32), // chainId (uint256)              (32 bytes)
        ethers.zeroPadValue(tokenContract, 32),           // tokenContract (address)        (32 bytes)
        ethers.zeroPadValue(ethers.toBeHex(tokenId), 32), // tokenId (uint256)              (32 bytes)
      ]);
      const initCodeHash = ethers.keccak256(initCode);
      const saltHex = ethers.zeroPadValue(ethers.toBeHex(salt), 32);
      expect(await ERC6551Registry.account(implementation, saltHex, chainId, tokenContract, tokenId))
        .to.equal(ethers.getCreate2Address(ERC6551Registry.target, saltHex, initCodeHash));
    });
  });

});
