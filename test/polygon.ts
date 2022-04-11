import { expect } from "chai";
import hre, { ethers, upgrades } from "hardhat";
import { TokenPolygon } from "../typechain-types";

const name = "Test Token";
const symbol = "TST";

describe("TokenPolygon", function () {
  beforeEach(async function () {
    await hre.network.provider.send("hardhat_reset")
  })

  it("Should create the correct amount of tokens", async function () {

    const factory = await ethers.getContractFactory("TokenPolygon");
    const token = await factory.deploy(name, symbol) as TokenPolygon;
    await token.deployed();

    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.decimals()).to.equal(8);
    expect(await token.totalSupply()).to.equal(0);
    expect(await token.balanceOf(await factory.signer.getAddress())).to.equal(0);

  });
});
