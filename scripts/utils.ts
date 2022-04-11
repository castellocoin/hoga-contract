import logger from "node-color-log";
import hre from "hardhat";
import {Contract, ContractFactory, Signer} from "ethers";
import {LedgerSigner} from "@ethersproject/hardware-wallets";
import readline from "readline";
import {Manifest} from "@openzeppelin/upgrades-core";

export async function verifyCode(autoVerify: boolean, addresses: {address: string, args:any[]}[]) {
    for (const address of addresses) {
        if(autoVerify) {
            logger.info(`Publishing code for verification to address ${address.address}`)
            await Promise.race([
                hre.run("verify:verify", {
                    address: address.address,
                    constructorArguments: address.args,
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 30 * 1000))
            ]).catch((err) => {
                if (err.message.includes("Reason: Already Verified") || err.message.includes("Contract source code already verified")) {
                    logger.info("Contract is already verified!");
                } else {
                    console.error(err);
                    logger.error(err);
                    logger.error(`Error occurred during code verification of address ${address.address}`)
                    // TODO add verify with construtor
                    logger.bold().info(`Execute >>> npx hardhat verify ${address.address}  --network ${hre.network.name}`)
                }
            });
        } else {
            logger.bold().info(`Execute >>> npx hardhat verify ${address.address} --network ${hre.network.name}`)
        }
    }
}

export const delay = (ms:number) => new Promise(res => setTimeout(res, ms));


export async function getHardwareSigner(ledger: boolean): Promise<Signer | undefined> {
    if (!ledger) return undefined;
    //@ts-ignore
    const provider = hre.ethers.provider
    logger.info("Looking for Nano Ledger...")
    return new LedgerSigner(provider, 'hid', "m/44'/60'/0'/0/0");
}

const rl = readline.createInterface(process.stdin, process.stdout);

export async function promptToContinue(text: string, valid: string[]) {
    rl.setPrompt(text);
    rl.prompt()
    const it = rl[Symbol.asyncIterator]();
    const result = (await it.next()).value;
    if (!result || !valid.includes(result.toLowerCase())) {
        logger.error("Cancelled")
        throw Error("Cancelled");
    }
}


export async function getManifest(chainId: number) {
    const manifest = new Manifest(chainId);
    return await manifest.read()
}

export async function checkProxy(factory: ContractFactory, contract: Contract) {

    try {
        const chainId = (await factory.signer.provider?.getNetwork()!).chainId;
        if (chainId == 137) {
            logger.bold().info(`Check proxy contract: https://polygonscan.com/proxyContractChecker?a=${contract.address}`)
        } else if (chainId == 80001) {
            logger.bold().info(`Check proxy contract: https://mumbai.polygonscan.com/proxyContractChecker?a=${contract.address}`)
        }
    } catch (err) {
        logger.error(err);
    }

}