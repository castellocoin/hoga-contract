import {ethers} from "ethers";
import {Environment} from "./environment";

export const configuration = (): Environment => {
    return {
        ledger: false,
        autoVerify: true,
        constructorParams: [
            "TEST Coin",
            "TEST",
            ethers.BigNumber.from("440000000").mul("100000000"),
        ]
    };
}
