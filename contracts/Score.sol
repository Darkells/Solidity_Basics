// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Score is Ownable {
    mapping(address => uint256) public scores;
    uint256 public constant MAX_SCORE = 100;

    event ScoreSet(address indexed student, uint256 score);

    constructor() Ownable(msg.sender) {}

    function setScore(address student, uint256 _score) public onlyOwner {
        require(_score <= MAX_SCORE, "Score cannot exceed 100");
        scores[student] = _score;
        emit ScoreSet(student, _score);
    }

    function getScore(address student) public view returns (uint256) {
        return scores[student];
    }
}
