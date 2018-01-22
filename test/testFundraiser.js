var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should cost money to start a fundraiser', async function (){
        let fr1 = await (Fundraiser.new("Test1", 1e10, {value: 1}));
        let name1 = await (fr1.name.call());
        assert.equal(name1, "Test1");

        let thrown = false;
        let fr2;
        try {
            fr2 = await (Fundraiser.new("Test2", 1e10, {value: 0}));
            let name2 = await (fr2.name.call());
            assert.fail('Problem - I created a fundraiser for free.');
          } catch (e) {
            thrown = true;
          }
          assert.isTrue(thrown);
          assert.isUndefined(fr2);
    });

    it('should set starting balance when you start a fundraiser', async function (){
        let fr1 = await (Fundraiser.new("Test1", 1e10, {value: 33}));
        let name1 = await (fr1.name.call());
        assert.equal(name1, "Test1");
        assert.equal(33, web3.eth.getBalance(fr1.address));
    });
});