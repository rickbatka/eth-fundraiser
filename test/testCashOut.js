var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should not allow cashout if abandoned', async function(){
        let co1 = await (Fundraiser.new("co1", 10, {from: accounts[0]}));
        assert.equal(0, web3.eth.getBalance(co1.address));
        assert.equal(0, (await co1.getTotalWeiContributed()).toNumber());

        await co1.invite(accounts[1]);
        await co1.invite(accounts[2]);

        await co1.contribute({value: 10, from: accounts[0]});
        await co1.contribute({value: 1, from: accounts[1]});
        await co1.contribute({value: 2, from: accounts[2]});

        assert.equal(13, (await co1.getTotalWeiContributed()).toNumber());
        assert.equal(13, web3.eth.getBalance(co1.address));

        await co1.abandon();
        try{
            // should fail, money should not leave the contract.
            await co1.cashOut();
        }catch (e){
            //console.log(e);
        }
        assert.equal(13, web3.eth.getBalance(co1.address));
    });

    it('should not allow cashout before reaching its goal', async function(){
        let co1 = await (Fundraiser.new("co1", 1e16, {from: accounts[0]}));

        await co1.contribute({value: 10, from: accounts[0]});
        
        assert.equal(10, (await co1.getTotalWeiContributed()).toNumber());
        assert.equal(10, web3.eth.getBalance(co1.address));

        try{
            // should fail, money should not leave the contract.
            await co1.cashOut();
        }catch (e){
            //console.log(e);
        }
        assert.equal(10, web3.eth.getBalance(co1.address));
    });

    it('should allow curator to cashout once its goal is reached', async function(){
        let co1 = await (Fundraiser.new("co1", 1e16, {from: accounts[0]}));

        await co1.invite(accounts[1]);
        await co1.invite(accounts[2]);
        
        await co1.contribute({value: 10, from: accounts[0]});
        await co1.contribute({value: 3, from: accounts[1]});
        
        assert.equal(13, (await co1.getTotalWeiContributed()).toNumber());
        assert.equal(13, web3.eth.getBalance(co1.address));

        let acct0BalanceAfterContributing = web3.eth.getBalance(accounts[0]);

        assert.equal(13, web3.eth.getBalance(co1.address));
        
        await co1.contribute({value: 1e16, from: accounts[2]});

        await co1.cashOut();

        // verify that the contract paid out its entire balance, including overages.
        assert.equal(0, web3.eth.getBalance(co1.address));

        // verify money went to the curator's account (exact amount depends on gas cost, should be higher than it was before the cashOut).
        assert(web3.eth.getBalance(accounts[0]).greaterThan(acct0BalanceAfterContributing));
    });

    it('should not allow non-curator accounts to cashout, ever', async function(){
        let co1 = await (Fundraiser.new("co1", 1e16, {from: accounts[0]}));

        await co1.invite(accounts[1]);
        
        await co1.contribute({value: 10, from: accounts[0]});
        await co1.contribute({value: 1e16, from: accounts[1]});
        let totalFundsRaised = web3.eth.getBalance(co1.address);

        try{
            // should fail (this isn't the curator account), even though the goal has been reached
            await co1.cashOut({from: accounts[1]});
        }catch (e){
            //console.log(e);
        }

        // verify that the contract did not cash out to non-curator.
        assert(totalFundsRaised.equals(web3.eth.getBalance(co1.address)));
    });

    it('should permanently deactivate the contract after cashOut', async function(){
        let co1 = await (Fundraiser.new("co1", 1e16, {from: accounts[0]}));

        await co1.invite(accounts[1]);
        
        await co1.contribute({value: 10, from: accounts[0]});
        await co1.contribute({value: 1e16, from: accounts[1]});
        let totalFundsRaised = web3.eth.getBalance(co1.address);

        try{
            await co1.cashOut();
        }catch (e){
            //console.log(e);
        }

        // verify that the contract cashed out
        assert(web3.eth.getBalance(co1.address).equals(0));

        try{
            await co1.contribute({value: 10, from: accounts[0]});
            await co1.contribute({value: 1e16, from: accounts[1]});
        }catch (e){
            //console.log(e);
        }

        // verify new money was not accepted
        assert(web3.eth.getBalance(co1.address).equals(0));
    });
});