//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    // 接收ETH的事件
    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed recipient, uint256 amount);

    constructor() ReentrancyGuard() {
    }

    // 接收ETH的函数
    receive() external payable {
        deposit();
    }

    // 记录存款
    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // 提取ETH
    function withdraw() public nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        // 重要：先将余额设为0，再转账，防止重入攻击
        balances[msg.sender] = 0;
        
        // 转账ETH
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }

    // 查询合约ETH余额
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
