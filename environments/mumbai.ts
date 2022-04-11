import {ethers} from "ethers";
import {Environment} from "./environment";

export const configuration = (): Environment => {
    return {
        ledger: false,
        autoVerify: true,
        constructorParams: [
            "TEST Coin",
            "TEST"
        ]
    };
}
