const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ERC6551Demo", (m) => {
    const ERC6551Account = m.contract("ERC6551Account", []);
    const ERC6551Registry = m.contract("ERC6551Registry", []);
    const ERC20Demo = m.contract("ERC20Demo", []);
    const ERC721Demo = m.contract("ERC721Demo", []);

    return { ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo };
});
