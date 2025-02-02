import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Score, Teacher } from "../typechain-types";

describe("Score and Teacher", function () {
    let score: Score;
    let teacher: Teacher;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let student: HardhatEthersSigner;

    beforeEach(async function () {
        [owner, addr1, student] = await ethers.getSigners();

        // 部署 Score 合约
        const Score = await ethers.getContractFactory("Score");
        score = await Score.deploy();
        await score.waitForDeployment();

        // 部署 Teacher 合约
        const Teacher = await ethers.getContractFactory("Teacher");
        teacher = await Teacher.deploy(await score.getAddress());
        await teacher.waitForDeployment();

        // 将 Score 合约所有权转移给 Teacher 合约
        await score.transferOwnership(await teacher.getAddress());
    });

    describe("Deployment", function () {
        it("Should set the right owner for Teacher contract", async function () {
            expect(await teacher.owner()).to.equal(owner.address);
        });

        it("Should set the right Score contract address", async function () {
            expect(await teacher.scoreContract()).to.equal(await score.getAddress());
        });

        it("Should transfer Score contract ownership to Teacher contract", async function () {
            expect(await score.owner()).to.equal(await teacher.getAddress());
        });
    });

    describe("Score Setting", function () {
        it("Should allow teacher owner to set student score", async function () {
            await teacher.setStudentScore(student.address, 85);
            expect(await score.getScore(student.address)).to.equal(85);
        });

        it("Should not allow non-owner to set student score", async function () {
            await expect(
                teacher.connect(addr1).setStudentScore(student.address, 85)
            ).to.be.revertedWithCustomError(teacher, "OwnableUnauthorizedAccount");
        });

        it("Should not allow scores above MAX_SCORE", async function () {
            await expect(
                teacher.setStudentScore(student.address, 101)
            ).to.be.revertedWith("Score cannot exceed 100");
        });
    });

    describe("Score Contract Updates", function () {
        it("Should allow owner to update score contract address", async function () {
            const newScoreAddress = addr1.address;
            await expect(teacher.setScoreContract(newScoreAddress))
                .to.emit(teacher, "ScoreContractUpdated")
                .withArgs(newScoreAddress);
            
            expect(await teacher.scoreContract()).to.equal(newScoreAddress);
        });

        it("Should not allow non-owner to update score contract address", async function () {
            await expect(
                teacher.connect(addr1).setScoreContract(addr1.address)
            ).to.be.revertedWithCustomError(teacher, "OwnableUnauthorizedAccount");
        });
    });
}); 