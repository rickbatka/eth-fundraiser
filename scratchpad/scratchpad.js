var Fundraiser = artifacts.require("Fundraiser");

/* var fundraiserContract;
Fundraiser.new("Test fundraiser 2").then(function(instance){
    fundraiserContract = instance;
    //console.log(fundraiserContract.instanceName());
    return fundraiserContract.instanceName.call();
})

.then(function(bb){
    console.log(bb);
});
 */


    Fundraiser.at("0x2a504b5e7ec284aca5b6f49716611237239f0b97").instanceName.call()
    .then(function(bb){
        console.log(bb);
    });