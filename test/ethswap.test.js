const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer,investor]) => {
  let token, ethSwap

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    // Transfer all tokens to EthSwap (1 million)
    await token.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      assert.equal(name, 'Exchange')
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })

    it('buyTokens()', async() => {
      // Check investor token balance after purchase
      let result = await ethSwap.buytokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      // Check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address) // for checking token balance
      assert.equal(ethSwapBalance.toString(), tokens('999900'))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)// for checking eth balance
      assert.equal(ethSwapBalance.toString(), tokens('1'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

    describe('selltokens()', async () =>{

      let result

    before(async () =>{
      //allowing ethswap contract to selll tokens from investor's account
      await token.approve(ethSwap.address,tokens('100'),{ from: investor})
      result = await ethSwap.selltokens(tokens('100'),{ from: investor})
    })

    it('sellTokens()', async() => {

      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))
    })
})
})