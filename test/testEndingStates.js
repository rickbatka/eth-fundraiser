var Fundraiser = artifacts.require('Fundraiser');

contract('Fundraiser', function (accounts) {
    it('should not allow refund withdrawals before being abandoned', async function(){
        let tw1 = await (Fundraiser.new("tw1", 1e10, {from: accounts[0]}));
        assert.equal(0, web3.eth.getBalance(tw1.address));
        assert.equal(0, (await tw1.getTotalWeiContributed()).toNumber());

        await tw1.contribute({value: 10, from: accounts[0]});
        assert.equal(10, web3.eth.getBalance(tw1.address));
        assert.equal(10, (await tw1.getTotalWeiContributed()).toNumber());

        try{
            let stolen = await tw1.withdrawRefund();
        }catch (e){
            //console.log(e);
        }

        assert.equal(10, web3.eth.getBalance(tw1.address));
        assert.equal(10, (await tw1.getTotalWeiContributed()).toNumber());
    });

    it('should allow refund withdrawals after being abandoned', async function(){
        let tw1 = await (Fundraiser.new("tw1", 1e10, {from: accounts[0]}));
        assert.equal(0, web3.eth.getBalance(tw1.address));
        assert.equal(0, (await tw1.getTotalWeiContributed()).toNumber());

        await tw1.invite(accounts[1]);

        await tw1.contribute({value: 10, from: accounts[0]});
        await tw1.contribute({value: 1, from: accounts[1]});

        await tw1.abandon();
        try{
            await tw1.withdrawRefund();
            assert(web3.eth.getBalance(tw1.address).equals(1));
            assert((await tw1.getTotalWeiContributed()).equals(1));

            assert((await tw1.weiBalances(accounts[0])).equals(0));
            assert((await tw1.weiBalances(accounts[1])).equals(1));
            
            await tw1.withdrawRefund({from: accounts[1]});
            assert(web3.eth.getBalance(tw1.address).equals(0));
            assert((await tw1.getTotalWeiContributed()).equals(0));
        }catch (e){
            //console.log(e);
        }
        
        assert(web3.eth.getBalance(tw1.address).equals(0));
        assert((await tw1.getTotalWeiContributed()).equals(0));
        assert((await tw1.weiBalances(accounts[0])).equals(0));
        assert((await tw1.weiBalances(accounts[1])).equals(0));
    });
    

    it('should not allow contributions after being abandoned', async function(){
        let tw1 = await (Fundraiser.new("tw1", 1e10, {from: accounts[0]}));
        assert(web3.eth.getBalance(tw1.address).equals(0));
        assert((await tw1.getTotalWeiContributed()).equals(0));

        await tw1.invite(accounts[1]);

        await tw1.contribute({value: 10, from: accounts[0]});
        await tw1.contribute({value: 1, from: accounts[1]});

        assert((await tw1.getTotalWeiContributed()).equals(11));
        assert(web3.eth.getBalance(tw1.address).equals(11));

        await tw1.abandon();
        
        try{
            tw1.contribute({value: 22, from: accounts[0]});
        } catch(e) {}

        try{
            tw1.contribute({value: 111, from: accounts[1]});
        } catch(e) {}
        
        assert((await tw1.getTotalWeiContributed()).equals(11));
        assert(web3.eth.getBalance(tw1.address).equals(11));
    });

    it('should not allow double refunds after being abandoned', async function(){
        let tw1 = await (Fundraiser.new("tw1", 1e10, {from: accounts[0]}));
        assert(web3.eth.getBalance(tw1.address).equals(0));
        assert((await tw1.getTotalWeiContributed()).equals(0));

        await tw1.invite(accounts[1]);

        await tw1.contribute({value: 10, from: accounts[0]});
        await tw1.contribute({value: 1, from: accounts[1]});

        assert((await tw1.getTotalWeiContributed()).equals(11));
        assert(web3.eth.getBalance(tw1.address).equals(11));

        await tw1.abandon();
        try{
            await tw1.withdrawRefund();    
        }catch (e){
            console.log(e);
            assert.fail('Failed to refund in valid scenario.');
        }
        
        assert(web3.eth.getBalance(tw1.address).equals(1));
        assert((await tw1.getTotalWeiContributed()).equals(1));
        assert((await tw1.weiBalances(accounts[0])).equals(0));
        assert((await tw1.weiBalances(accounts[1])).equals(1));

        try{
            // attempt double-refund
            await tw1.withdrawRefund();
        }catch (e){
            console.log(e);
        }
        assert(web3.eth.getBalance(tw1.address).equals(1));
        assert((await tw1.getTotalWeiContributed()).equals(1));
        assert((await tw1.weiBalances(accounts[0])).equals(0));
        assert((await tw1.weiBalances(accounts[1])).equals(1));
    });
});