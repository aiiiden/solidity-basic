// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistModel is Ownable {
  constructor(address initialOwner) Ownable(initialOwner) {}

  mapping(address => bool) public whitelist;
  mapping(address => string) public messageMap;

  struct Wallet {
    address wallet;
    bool isEligible;
  }

  function updateWhitelist(Wallet[] memory wallets) public onlyOwner {
    for (uint i = 0; i < wallets.length; i++) {
      whitelist[wallets[i].wallet] = wallets[i].isEligible;
    }
  }

  function greeting(string memory message) public {
    require(whitelist[msg.sender], "You are not eligible.");
    messageMap[msg.sender] = message;
  }
}
