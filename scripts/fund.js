

const {  ethers, getNamedAccounts } = require("hardhat");


async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(" funde contract starting ...");
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("1")
    })
    await transactionResponse.wait(1);
    console.log(" funde contract end");
}

main()
    .then(() => process.exit(0))
    .catch((error) => { 
        console.error(error);
        process.exit(1);
    })