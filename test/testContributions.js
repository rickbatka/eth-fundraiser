var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should tally contributions', async function(){
        let fr1 = await (Fundraiser.new("Test1", 1e10));
        await fr1.contribute({value: 22});
        let result = await fr1.getTotalWeiContributed();
        assert.equal(22, result.toNumber());
    });
});