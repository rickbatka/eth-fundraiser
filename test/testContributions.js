var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should tally contributions', async function(){
        let fr1 = await (Fundraiser.new("Test1", 1e10));
        await fr1.contribute({value: 22});
        assert.equal(22, (await fr1.getTotalWeiContributed()).toNumber());

        await fr1.invite(accounts[1]);

        await fr1.contribute({value: 1, from: accounts[1]});
        assert.equal(23, (await fr1.getTotalWeiContributed()).toNumber());

        await fr1.invite(accounts[2]);

        await fr1.contribute({value: 5, from: accounts[2]});
        assert.equal(28, (await fr1.getTotalWeiContributed()).toNumber());
    });

    it('should not accept contributions from non-members', async function(){
        let fr1 = await (Fundraiser.new("Test1", 1e10));
        await fr1.contribute({value: 22});
        assert.equal(22, (await fr1.getTotalWeiContributed()).toNumber());
        assert.equal(22, web3.eth.getBalance(fr1.address));

        await fr1.contribute({value: 1, from: accounts[0]});
        assert.equal(23, (await fr1.getTotalWeiContributed()).toNumber());
        assert.equal(23, web3.eth.getBalance(fr1.address));

        let thrown = false;
        try{
            await fr1.contribute({value: 1, from: accounts[1]});
            await fr1.contribute({value: 1, from: accounts[2]});
        } catch (e) {
            thrown = true;
        }
        assert.equal(23, web3.eth.getBalance(fr1.address));
        assert.equal(23, (await fr1.getTotalWeiContributed()).toNumber());
        
        // TODO require() not throwing despite enforcing its rule?
        //assert.isTrue(thrown);
    });
});