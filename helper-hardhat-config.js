
// SEPOLIA
const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    300: {
        name: "zkSync",
        ethUsdPriceFeed: "0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF"
    },
    59144: {
        name: "linea",
        ethUsdPriceFeed: "0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF"
    }
}
const developmentChains = ["hardhat", "localhost","31337"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}