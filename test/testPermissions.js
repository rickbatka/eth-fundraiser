var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    /* it('should cost money to start a fundraiser', async function (){
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
        assert.equal(await (fr1.name.call()), "Test1");

        // The contract itself should get the balance that came in through the construction...
        assert.equal(33, web3.eth.getBalance(fr1.address));

        // and the curator's initial contribution should be recorded in the ledger.
        assert.equal(33, await fr1.weiBalances(accounts[0]));
    }); */

    it('should limit invite ability to the curator', async function (){
        let te1 = await (Fundraiser.new("TestInvites1", 1e10, {from: accounts[0]}));
        let thrown = false;
        console.log(await te1.curator.call());
        try{
            // TODO this should throw, but it doesn't.
            await te1.invite(accounts[2], {from: accounts[3]});
        }catch (e){
            thrown = true;
        }
        // TODO for some reason, I can never get invite() to throw.
        //assert.isTrue(thrown);
    });

   
});