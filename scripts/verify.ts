// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import readline from 'readline';
import {Environment} from "../environments/environment";

import logger from 'node-color-log';
import {verifyCode} from "./utils";

const rl = readline.createInterface(
    process.stdin, process.stdout);

function isMainnet(networkName: string): boolean {
    return networkName === 'mainnet' || networkName === 'polygon';
}

async function main() {
    const address = "0x3FAb0bBAa03BCEAF7C49E2b12877dB0142BE65FC"
    const projectName = require('../package.json');
    logger.bold().info(`Project: ${projectName.name}`);
    logger.bold().info(`Verification for address ${address}`);

    const networkName = hre.network.name
    const config = require(`../environments/${networkName}`)
    const envConfig = config.configuration() as Environment;
    logger.debug(envConfig)

    await verifyCode(true, [{address: address, args: envConfig.constructorParams!}])

    return true
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});
