// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, {ethers} from "hardhat";
import {Contract, ContractFactory} from "ethers";
import {Environment} from "../environments/environment";

import logger from 'node-color-log';
import {Token, TokenPolygon} from "../typechain-types";
import {delay, getHardwareSigner, promptToContinue, verifyCode} from "./utils";

function isMainnet(networkName: string): boolean {
    return networkName === 'mainnet' || networkName === 'polygon';
}

async function main() {
    const projectName = require('../package.json');
    logger.bold().info(`Project: ${projectName.name}`);

    const networkName = hre.network.name
    const network = await hre.ethers.provider.detectNetwork()

    if (isMainnet(networkName)) {
        logger.bold().warn(`Network: ${networkName}`)
        logger.bold().warn(`Chain ID: ${network.chainId}`)
    } else {
        logger.bold().info(`Network: ${networkName}`)
        logger.bold().info(`Chain ID: ${network.chainId}`)
    }
    const filename = require('path').basename(__filename);
    logger.debug(`Executing ${filename}`)
    //@ts-ignore
    logger.debug(`Network URL ${hre.network.config.url}`)
    const remoteOrigin = require('child_process').execSync('git remote get-url origin').toString().trim()
    logger.debug(`Remote Origin ${remoteOrigin}`)

    logger.info(`Loading config file environments/${networkName}.ts`)
    const config = require(`../environments/${networkName}`)
    const envConfig = config.configuration() as Environment;
    logger.debug(envConfig)
    if (envConfig.ledger) {
        logger.info("Ledger will be used for signing")
    }

    if (network.chainId === 137 || network.chainId === 80001) {
        await deployContract<TokenPolygon>("TokenPolygon", envConfig)
    } else {
        await deployContract<Token>("Token", envConfig)
    }
    return true
}

async function deployContract<T extends Contract>(contractName: string, config: Environment): Promise<T> {
    logger.bold().info(`Deploying Contract ${contractName}`)
    if (config.constructorParams) {
        logger.bold().info(`Constructor params: ${config.constructorParams}`)
    }

    const factory = await prepareDeployment(config.ledger, contractName, config.constructorParams, true);

    const txContract = await factory.deploy(...config.constructorParams!, {type:1, nonce:0}) as T;
    const contract = await txContract.deployed() as T
    logger.bold().info("Deployed finish")
    logger.bold().info(`Contract address ${contract.address}`)

    try {
        const timeout = 60
        logger.debug(`Wait for ${timeout} seconds for etherscan to index`)
        await delay(timeout * 1000);
        await verifyCode(config.autoVerify, [{address: contract.address, args: config.constructorParams!}])

    } catch (err) {
        logger.error(err);
        logger.error("Couldn't run/calculate verify command");
    }

    return contract;
}


async function prepareDeployment(ledger: boolean, contractName: string, constructorParams: any[] = [], showGasInfos = false): Promise<ContractFactory> {
    const signer = await getHardwareSigner(ledger);
    const factory = await ethers.getContractFactory(contractName, signer);

    logger.bold().info(`Deployer address: ${await factory.signer.getAddress()}`)
    logger.bold().info(`Deployer balanace: ${ethers.utils.formatEther(await factory.signer.getBalance())}`)

    if (showGasInfos) {
        const gasPrice = await factory.signer.getGasPrice();
        logger.info(`Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
        const deployTx = factory.getDeployTransaction(...constructorParams);
        const gasLimit = await factory.signer.estimateGas({data: deployTx.data});
        logger.info(`Gas Limit: ${gasLimit}`);
        logger.bold().info(`Gas: ${ethers.utils.formatUnits(gasPrice.mul(gasLimit), 'ether')} ETH`);
    }

    await promptToContinue(`Press y or yes to continue: `, ["y", "yes"]);

    logger.bold().info("Deploying")
    if (ledger) {
        logger.bold().warn("Sign on Ledger")
    }
    return factory;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});
