// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract StructArray {
  struct User {
    address wallet;
    string name;
  }

  User[] public users;

  function signup(string memory name) public {
    User memory user = User(msg.sender, name);
    users.push(user);
  }

  function getUser(address wallet) public view returns (User memory) {
    User memory matched;

    for (uint i = 0; i < users.length; i++) {
      if (users[i].wallet == wallet) {
        matched = users[i];
      }
    }

    return matched;
  }
}
