import {ethers} from "ethers";
import {Environment} from "./environment";

export const configuration = (): Environment => {
    return {
        ledger: false,
        autoVerify: false,
        constructorParams: [
            "TEST Coin",
            "TEST",
            ethers.BigNumber.from("1000000").mul("100000000"),
        ]
    };
}
