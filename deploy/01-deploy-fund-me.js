// import
// function deployFunc(hre) { 
//     console.log("aaa")
//     hre.getNamedAccounts();
//     hre.deployments();
// };

// module.exports.default = deployFunc;


// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
// }
const { network } = require("hardhat");
const { networkConfig,developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify")
require("dotenv").config()
// const helperConfig = require("../helper-hardhat-config");
// const networkConfig = helperConfig.networkConfig;

module.exports = async ({getNamedAccounts ,deployments}) => {
   
    const { deploy, log } = deployments;
    //获取部署人
    const { deployer } = await getNamedAccounts();
    //获取 chainId
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        log("deploy start-----")
        const ethUsdAggregator = await deployments.get("MockV3Aggregator","bytecode");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log(`ethUsdPriceFeedAddress : ${ethUsdPriceFeedAddress}`);


    //当使用本地主机或“hardhat network”时，我们要使用 mock
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    
    if (!developmentChains.includes(network.name) && process.env.ETHVERIFY_API_KEY) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
    log("----------------------------------------");
}

module.exports.tags = ["all", "fundme"];