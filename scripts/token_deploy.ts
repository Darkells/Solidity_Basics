import { ethers, run } from "hardhat";

async function main() {
    const DrakenToken = await ethers.getContractFactory("DrakenToken");
    const token = await DrakenToken.deploy();
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log("DrakenToken deployed to:", tokenAddress);

    // 等待几个区块确认后验证合约
    await token.deploymentTransaction()?.wait(6);

    try {
        await run("verify:verify", {
            address: tokenAddress,
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