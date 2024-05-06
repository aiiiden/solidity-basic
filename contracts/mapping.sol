// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Mapping {
  mapping(address => uint) private votingMap;

  /**
   * 투표 수 증가
   * - 투표자의 주소를 받아 해당 주소의 투표 수를 1 증가시킴
   * - 만약, 처음 투표하는 주소는 보통 mapping에서는 0으로 초기화되어 있음
   * - 근데... 이것을 계속 실행할 수록 가스비가 증가하지 않을까?
   */
  function vote() public payable {
    votingMap[msg.sender] += 1;
  }

  function getVoteCount(address _address) public view returns (uint) {
    return votingMap[_address];
  }
}
