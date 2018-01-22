pragma solidity ^0.4.18;

contract Fundraiser {
    address public curator;
    string public name;
    uint public weiGoal;
    address[] private invitees;
    mapping(address => uint) public weiBalances;

    function Fundraiser(string _name, uint _weiGoal) public payable {
        require(msg.value > 0);
        curator = msg.sender;
        name = _name;
        weiGoal = _weiGoal;
        weiBalances[curator] = msg.value;
    }

    function invite(address invitee) public onlyCurator {
        invitees.push(invitee);
        // TODO fire event that can be detected to send emails, etc...
    }

    function contribute() public payable onlyContributors {
        weiBalances[msg.sender] += msg.value;
    }

    modifier onlyCurator {
        require(msg.sender == curator);
        _;
    }

    modifier onlyContributors {
        require(weiBalances[msg.sender] > 0);
        _;
    }
}