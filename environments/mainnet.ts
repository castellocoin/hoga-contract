import {BigNumber} from "ethers";
import {Environment} from "./environment";

export const configuration = (): Environment => {
    return {
        ledger: true,
        autoVerify: true,
        constructorParams: [
            "Castello Coin",
            "CAST",
            BigNumber.from("440000000").mul(BigNumber.from(10).pow(8)),
        ]
    };
}
