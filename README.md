[View the codumentation on github pages at https://rickbatka.github.io/eth-fundraiser/ -->](https://rickbatka.github.io/eth-fundraiser/)

# eth-fundraiser
A [socio-anarchist](https://en.wikipedia.org/wiki/Social_anarchism) crowdfunding platform.
===================

**WARNING! This is an experimental project and is not intended for production use. DO NOT USE THIS CONTRACT.**

Like k-ckstarter without the middleman.
-------------------

eth-fundraiser is a barebones, middleman-free distributed social crowdfunding platform on the Ethereum blockchain.

Getting started
-------------------

A curator publishes a new instance of the Fundraiser contract to the blockchain with a fundraising goal (in Wei) and a name for the fundraiser. For example, in your truffle migration:

```
Fundraiser.new("Help me raise 1ETH to start construction on a new community garden.", 1e18);
```

Once a fundraiser is published, it is active until either: 
a) the fundraising goal is reached and the funds are withdrawn for use in their intended purpose, or 
b) the fundraiser is abandoned, at which time all contributors are able to withdraw a full refund.

The fundraiser's creator (also known as the curator) must invite others to participate in the fundraiser:
```
await fundraiserInstance.invite("0x...");
```

Once invited, members (including the curator) can contribute unlimited funds to the cause as long as it remains active. All funds contributed are counted together towards the shared fundraising goal.
```
await fundraiserInstance.contribute({value: 1e10});
```

Once the fundraising goal is met or exceeded, the curator may cash out the fundraiser, transferring all the funds to their address and permanently deactivating the fundraiser, preventing further contributions:
```
try{
  await fundraiserInstance.cashOut();
}catch (e){
  ...
}
assert.equal(0, web3.eth.getBalance(fundraiserInstance.address));
```

A fundraiser can be abandoned (cancelled) any time as long as it has not already been cashed out. In this case, all members' contributions are unlocked for full refunds and the contract is permanently deactivated to prevent future contributions:
```
await fundraiserInstance.invite(accounts[1]);

await fundraiserInstance.contribute({value: 10, from: accounts[0]});
await fundraiserInstance.contribute({value: 1, from: accounts[1]});

await fundraiserInstance.abandon();
try{
    await fundraiserInstance.withdrawRefund({from: accounts[0]});
    assert(web3.eth.getBalance(fundraiserInstance.address).equals(1));
    assert((await fundraiserInstance.getTotalWeiContributed()).equals(1));

    assert((await fundraiserInstance.weiBalances(accounts[0])).equals(0));
    assert((await fundraiserInstance.weiBalances(accounts[1])).equals(1));

    await fundraiserInstance.withdrawRefund({from: accounts[1]});
    assert(web3.eth.getBalance(fundraiserInstance.address).equals(0));
    assert((await fundraiserInstance.getTotalWeiContributed()).equals(0));
}catch (e){
    ...
}
```

Compile & test
==============
```
>truffle compile
```

```
>truffle migrate --reset
```

```
>truffle test
```

More documentation to come...
