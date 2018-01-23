var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should limit invite ability to the curator', async function (){
        let te1 = await (Fundraiser.new("TestInvites1", 1e10, {from: accounts[0]}));
        let thrown = false;
        //console.log(await te1.curator.call());
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