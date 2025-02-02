import { ethers, run } from "hardhat";

async function main() {
    // 部署 Score 合约
    const Score = await ethers.getContractFactory("Score");
    const score = await Score.deploy();
    await score.waitForDeployment();
    const scoreAddress = await score.getAddress();
    console.log("Score deployed to:", scoreAddress);

    // 部署 Teacher 合约
    const Teacher = await ethers.getContractFactory("Teacher");
    const teacher = await Teacher.deploy(scoreAddress);
    await teacher.waitForDeployment();
    const teacherAddress = await teacher.getAddress();
    console.log("Teacher deployed to:", teacherAddress);

    // 将 Score 合约的所有权转移给 Teacher 合约
    await score.transferOwnership(teacherAddress);
    console.log("Score ownership transferred to Teacher contract");

    // 验证合约
    await score.deploymentTransaction()?.wait(6);
    await teacher.deploymentTransaction()?.wait(6);

    try {
        await run("verify:verify", {
            address: scoreAddress,
            constructorArguments: [],
        });
        await run("verify:verify", {
            address: teacherAddress,
            constructorArguments: [scoreAddress],
        });
        console.log("Contracts verified");
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