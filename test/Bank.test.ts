import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Bank } from "../typechain-types";

describe("Bank", function () {
    let bank: Bank;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.waitForDeployment();
    });

    describe("Deposit", function () {
        it("Should accept ETH and update balance", async function () {
            const depositAmount = ethers.parseEther("1.0");
            
            await expect(bank.deposit({ value: depositAmount }))
                .to.emit(bank, "Deposit")
                .withArgs(owner.address, depositAmount);

            expect(await bank.balances(owner.address)).to.equal(depositAmount);
            expect(await bank.getContractBalance()).to.equal(depositAmount);
        });

        it("Should accept ETH via receive function", async function () {
            const depositAmount = ethers.parseEther("1.0");
            
            await expect(owner.sendTransaction({
                to: await bank.getAddress(),
                value: depositAmount
            })).to.emit(bank, "Deposit")
            .withArgs(owner.address, depositAmount);
        });
    });

    describe("Withdraw", function () {
        it("Should allow withdrawal of deposited ETH", async function () {
            const depositAmount = ethers.parseEther("1.0");
            await bank.deposit({ value: depositAmount });

            await expect(bank.withdraw())
                .to.emit(bank, "Withdraw")
                .withArgs(owner.address, depositAmount);

            expect(await bank.balances(owner.address)).to.equal(0);
            expect(await bank.getContractBalance()).to.equal(0);
        });

        it("Should revert if no balance to withdraw", async function () {
            await expect(bank.withdraw())
                .to.be.revertedWith("No balance to withdraw");
        });

        it("Should revert if non-depositor tries to withdraw", async function () {
            const depositAmount = ethers.parseEther("1.0");
            await bank.deposit({ value: depositAmount });

            await expect(bank.connect(addr1).withdraw())
                .to.be.revertedWith("No balance to withdraw");
        });
    });
}); 