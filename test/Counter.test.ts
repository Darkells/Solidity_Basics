import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Counter", function () {
    let counter: any;  // 临时使用 any 类型，或者使用更具体的类型
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;

    // 在每个测试用例前部署新的合约
    beforeEach(async function () {
        // 获取测试账户
        [owner, addr1] = await ethers.getSigners();

        // 部署合约
        const Counter = await ethers.getContractFactory("Counter");
        counter = await Counter.deploy();
        await counter.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should initialize with count of 0", async function () {
            expect(await counter.countter()).to.equal(0);
        });

        it("Should set the right owner", async function () {
            expect(await counter.owner()).to.equal(owner.address);
        });
    });

    describe("Transactions", function () {
        it("Should allow owner to increment counter", async function () {
            // 记录初始值
            const initialCount = await counter.countter();

            // 调用count函数
            await counter.count();

            // 验证计数器增加了1
            expect(await counter.countter()).to.equal(initialCount + 1n);
        });

        it("Should allow owner to increment multiple times", async function () {
            // 连续调用三次
            await counter.count();
            await counter.count();
            await counter.count();

            // 验证计数器增加了3
            expect(await counter.countter()).to.equal(3);
        });

        it("Should revert when non-owner tries to increment", async function () {
            await expect(
                counter.connect(addr1).count()
            ).to.be.revertedWithCustomError(counter, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
        });
    });
}); 