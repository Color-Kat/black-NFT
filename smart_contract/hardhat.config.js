// https://eth-ropsten.alchemyapi.io/v2/2dW1C1L15ivv4LbAOIVh_jgH9-0znyd5

// Contract address
// first -0x42e627a16c0Bf4bfdfB00f6B9B4187b80D020C62

// deploy by `npx hardhat run scripts/deploy.js --network ropsten`


require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      // alchemy -> app -> view key -> http key
      url: 'https://eth-ropsten.alchemyapi.io/v2/2dW1C1L15ivv4LbAOIVh_jgH9-0znyd5',
      // metamask -> acc details -> copy private key
      accounts: ['9baa42e383b4e405328d7b943b8052390f11e81b558c6d40ace2e6fff34c144a']
    }
  }
}



// require("@nomiclabs/hardhat-waffle");

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more

// /**
//  * @type import('hardhat/config').HardhatUserConfig
//  */
// module.exports = {
//   solidity: "0.8.4",
// };
