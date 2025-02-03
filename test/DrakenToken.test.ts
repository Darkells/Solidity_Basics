import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DrakenToken } from "../typechain-types";

describe("DrakenToken", function () {
    let token: DrakenToken;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const DrakenToken = await ethers.getContractFactory("DrakenToken");
        token = await DrakenToken.deploy();
        await token.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right name and symbol", async function () {
            expect(await token.name()).to.equal("Draken Token");
            expect(await token.symbol()).to.equal("DRK");
        });

        it("Should assign the total supply to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });

        it("Should have correct total supply", async function () {
            const expectedSupply = ethers.parseEther("1000000");
            expect(await token.totalSupply()).to.equal(expectedSupply);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const amount = ethers.parseEther("100");
            await token.transfer(addr1.address, amount);
            expect(await token.balanceOf(addr1.address)).to.equal(amount);

            await token.connect(addr1).transfer(addr2.address, amount);
            expect(await token.balanceOf(addr2.address)).to.equal(amount);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);
            await expect(
                token.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

            expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update allowances on approve", async function () {
            const amount = ethers.parseEther("100");
            await token.approve(addr1.address, amount);
            expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);
        });

        it("Should transfer tokens using transferFrom", async function () {
            const amount = ethers.parseEther("100");
            await token.approve(addr1.address, amount);
            await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);
            expect(await token.balanceOf(addr2.address)).to.equal(amount);
        });
    });
}); 