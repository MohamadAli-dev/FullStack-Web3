require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url:
        'https://eth-goerli.g.alchemy.com/v2/5h3mkUZUB74QHBcq2E9n_AMJOsw40XwU',
      accounts: [
        '8596eb03d5b99a3ae60b2e935ac76c9e1ef3c6cf57f627b268e95f545c018594',
      ],
    },
  },
}
