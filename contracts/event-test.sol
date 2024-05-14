// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract EventTest {
  uint private number = 10;

  event numberChange(address indexed addr, uint oldValue, uint newValue);

  function increase(uint num) public returns (bool) {
    number = number + num;
    return true;
  }

  function increaseWithEvent(uint num) public returns (bool) {
    uint oldValue = number;
    number = number + num;
    emit numberChange(msg.sender, oldValue, number);

    return true;
  }
}
