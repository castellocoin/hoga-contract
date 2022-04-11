import {ethers} from "ethers";
import {Environment} from "./environment";

export const configuration = (): Environment => {
    return {
        ledger: true,
        autoVerify: true,
        constructorParams: [
            "Castello Coin",
            "CAST"
        ]
    };
}
