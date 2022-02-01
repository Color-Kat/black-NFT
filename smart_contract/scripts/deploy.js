// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const main = async () => {
  // We get the contract to deploy
  const AuctionBox = await hre.ethers.getContractFactory("AuctionBox");
  const auctionBox = await AuctionBox.deploy();

  await auctionBox.deployed();

  console.log("Contract deployed to:", auctionBox.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
