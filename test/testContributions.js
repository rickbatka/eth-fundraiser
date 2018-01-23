var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should tally contributions', async function(){
        let fr1 = await (Fundraiser.new("Test1", 1e10));
        await fr1.contribute({value: 22});
        assert.equal(22, (await fr1.getTotalWeiContributed()).toNumber());

        await fr1.invite(accounts[1]);

        await fr1.contribute({value: 1, from: accounts[1]});
        assert.equal(23, (await fr1.getTotalWeiContributed()).toNumber());
    });
});