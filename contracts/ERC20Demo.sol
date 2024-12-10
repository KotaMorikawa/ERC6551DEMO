// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Demo is ERC20, Ownable {
    constructor() ERC20("Demo Token", "DTC") Ownable(msg.sender) {}

    function mint(address account, uint256 value) public onlyOwner {
        _mint(account, value);
    }
}
