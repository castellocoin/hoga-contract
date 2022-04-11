import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import {Token} from "../typechain-types";

const name = "Test Token";
const symbol = "TST";
const amount = 100;

describe("Token", function () {
  beforeEach(async function () {
    await hre.network.provider.send("hardhat_reset")
  })

  it("Should create the correct amount of tokens", async function () {

    const factory = await ethers.getContractFactory("Token");
    const token = await factory.deploy(name, symbol, amount * Math.pow(10, 8)) as Token;
    await token.deployed();

    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.totalSupply()).to.equal(amount * Math.pow(10, 8));
    expect(await token.decimals()).to.equal(8);
    expect(await token.balanceOf(await factory.signer.getAddress())).to.equal(amount * Math.pow(10, 8));

  });
});
