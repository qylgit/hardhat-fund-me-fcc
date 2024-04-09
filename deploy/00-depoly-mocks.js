//部署属于自己的喂价 

const { network } = require("hardhat");
const { developmentChains,DECIMALS,INITIAL_ANSWER } = require("../helper-hardhat-config");


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    //获取部署人
    const { deployer } = await getNamedAccounts();
    
    const chainId = network.config.chainId;
    console.log(`developmentChains = ${developmentChains}`);
    console.log(`chainId = ${chainId}`);

    if (chainId == 31337){
        log("local network detected");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args:[DECIMALS,INITIAL_ANSWER]
        });
    }
    log("mocks deployed");
    log("-----------------------------------------");
}

module.exports.tags = ["all","mocks"]