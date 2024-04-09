
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
// expect.use(chaiAsPromised);

developmentChains.includes(network.name)
?describe.skip
:describe("FundMe", async function () {
    
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    let sendValue = ethers.parseEther("1"); //1 ETH
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        const fundMeArtifact = await deployments.getArtifact("FundMe");
        const fundMeABI = fundMeArtifact.abi;
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
        // console.log("FundMe address:", fundMe.address);
        // console.log("MockV3Aggregator ABI:", JSON.stringify(mockV3Aggregator.interface.abi));
        // console.log("MockV3Aggregator address:", mockV3Aggregator.address);
    });
    //测试构造函数
    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.target);
        })
    });
    describe("fund", function () { 
        it("Fails if you don't send enough ETH", async () => {
            const response = fundMe.fund();
            await expect(response).to.eventually.be.rejectedWith("You need to spend more ETH!");
        });

        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({value: sendValue})
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        });

        it("Adds funder to array of numbers", async () => {
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.getFunder(0);
            assert.equal(funder, deployer)
        }); 
    });
    //测试 withdraw 功能
    describe("withdraw", async () => {
        // 添加测试前置条件
        beforeEach(async function () { await fundMe.fund({ value: sendValue }) });
        // 
        it("withdraw ETH from a single founder", async () => {
            // 准备测试
            //首先获取余额 
            // 获取withdrow金额
            const startingFundMeBalannce = await ethers.provider.getBalance(fundMe.target);
            // 获取 合约金额
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            // 执行withdraw
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait();
            // 获取我们执行函数所消耗的gas
            const { gasUsed, gasPrice } = transactionReceipt;
            const gasCost = gasUsed * gasPrice;

            //再次获取余额  变动后
            const endingFundMeBalannce = await ethers.provider.getBalance(fundMe.target);
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);
            // const gas = gasCost();
            assert.equal(endingFundMeBalannce, 0);
            assert.equal((startingFundMeBalannce + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString());
        });
        
        it("allows us to withdrow witg multiple funders", async function () {
            const accounts = await ethers.getSigners();
            for (let index = 1; index < 6; index++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[index]
                );
                fundMeConnectedContract.fund({ value: sendValue });

            }

            const startingFundMeBalannce = await ethers.provider.getBalance(fundMe.target);
            // 获取 合约金额
            const startingDeployerBalance = await ethers.provider.getBalance(deployer);

            // 执行withdraw
            const transactionResponse = await fundMe.cheaperWithdraw();
            const transactionReceipt = await transactionResponse.wait();
            // 获取我们执行函数所消耗的gas
            const { gasUsed, gasPrice } = transactionReceipt;
            const gasCost = gasUsed * gasPrice;
            console.log(`GasCost: ${gasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${gasPrice}`)
            //再次获取余额  变动后
            const endingFundMeBalannce = await ethers.provider.getBalance(fundMe.target);
            const endingDeployerBalance = await ethers.provider.getBalance(deployer);
            // const gas = gasCost();
            assert.equal(endingFundMeBalannce, 0);
            // assert.equal((startingFundMeBalannce + startingDeployerBalance).toString(),
            // (endingDeployerBalance + gasCost).toString());
        
            // 保证 funders 正确
            await expect(fundMe.getFunder(0)).to.eventually.be.rejected;
            for (let index = 1; index < 6; index++) {
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[index].address), 0);
            }
        });


        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(
                accounts[1]
            )
            await expect(fundMeConnectedContract.withdraw()).to.eventually.be.rejectedWith("FundMe__NotOwner")
        });
    });
});