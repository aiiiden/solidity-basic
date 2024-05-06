// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NumberFight is Ownable {
  constructor(address initialOwner) Ownable(initialOwner) {}

  uint public number = 0;

  // owner만 실행 가능
  function increment() public onlyOwner {
    number += 1;
  }

  // 일반 유저도 실행 가능
  function decrement() public {
    number -= 1;
  }
}
