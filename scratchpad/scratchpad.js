var Fundraiser = artifacts.require("Fundraiser");
/*

var fundraiserContract;
Fundraiser.new("Test fundraiser 3", 1e10).then(function(instance){
    fundraiserContract = instance;
    //console.log(fundraiserContract.instanceName());
    return fundraiserContract.name.call();
})

.then(function(bb){
    console.log(bb);
});


*/ 

    Fundraiser.at("0x2e335f247e91caa168c64b63104c4475b2af3942").name.call()
    .then(function(bb){
        console.log(bb);
    }); 
    
