// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 * 배포된 컨트랙트 주소
 * -  https://sepolia.lineascan.build/address/0xD5d21d161Ffa70053d29339C0fcED8c970c60795#code
 */

contract VariableTest1 {
  /**
   * 솔리디티의 자료형 1
   *
   * [지역변수] local variables
   * - 함수 내에서 선언된 변수
   * - 함수가 실행될 때 생성되고 함수가 종료되면 소멸
   * - 함수 내에서만 사용 가능
   * - 체인에 기록되지 않음 (영속성 X)
   *
   * [상태변수] state variables
   * - 함수 밖에서 선언된 변수
   * - 체인에 기록되어 영속적으로 저장됨
   * - 함수 내부 어디서든 사용 가능
   * - *가시성 지정자* public, private, internal, external 등으로 접근 제어 가능
   *  + public: 누구나 읽고 쓸 수 있음
   *  + private: 컨트랙트 내부에서만 읽고 쓸 수 있음
   *  + internal: 컨트랙트 내부 또는 파생 컨트랙트에서만 읽고 쓸 수 있음
   *  + external: 외부 컨트랙트에서만 읽고 쓸 수 있음
   *
   * [전역변수] global variables
   * - 블록체인에 관한 정보를 제공하는 변수
   * - 예) block, msg, tx, now 등
   */

  // 상태변수 (state)
  string public message = "Hello world!"; // 접근지정자 public
  uint private number = 10;

  function testLocal() public pure returns (uint) {
    // 지역변수
    uint local = 1;

    // 함수 내에서만 사용 가능하며 함수가 종료되면 메모리에서 소멸
    return local;
  }

  function getBlockTimestamp() public view returns (uint) {
    // 전역변수 : block 정보
    uint blockTimestamp = block.timestamp; // 블록 생성 시간

    return blockTimestamp;
  }

  function getSender() public view returns (address) {
    // 전역변수 : msg sender 정보
    address sender = msg.sender;

    return sender;
  }

  function setMessage(string memory str) public {
    message = str;
  }

  // public 인 경우에는 따로 get을 구현하지 않아도 된다.

  function setNum(uint num) public {
    number = num;
  }

  function getNum() public view returns (uint) {
    return number;
  }
}
