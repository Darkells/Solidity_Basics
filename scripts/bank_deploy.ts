import { ethers, run } from "hardhat";

async function main() {
    // 部署合约
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    await bank.waitForDeployment();

    const bankAddress = await bank.getAddress();
    console.log("Bank deployed to:", bankAddress);

    // 等待几个区块确认后验证合约
    await bank.deploymentTransaction()?.wait(6);

    // 验证合约
    try {
        await run("verify:verify", {
            address: bankAddress,
            constructorArguments: [],
        });
        console.log("Contract verified");
    } catch (error) {
        console.log("Verification failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 