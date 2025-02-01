// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is Ownable {
    uint256 public countter;
    
    constructor() Ownable(msg.sender) {
        countter = 0;
    }
    
    function count() public onlyOwner {
        countter += 1;
    }
}