// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IScore.sol";

contract Teacher is Ownable {
    IScore public scoreContract;
    
    event ScoreContractUpdated(address newScoreContract);
    
    constructor(address _scoreContract) Ownable(msg.sender) {
        scoreContract = IScore(_scoreContract);
    }
    
    function setScoreContract(address _newScoreContract) external onlyOwner {
        scoreContract = IScore(_newScoreContract);
        emit ScoreContractUpdated(_newScoreContract);
    }
    
    function setStudentScore(address student, uint256 score) external onlyOwner {
        scoreContract.setScore(student, score);
    }
} 