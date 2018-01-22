pragma solidity ^0.4.17;

contract Fundraiser {
    address private curator;
    string public name;
    uint public weiGoal;
    mapping(address => uint) public weiBalances;

    function Fundraiser(string _name, uint _weiGoal) public payable {
        require(msg.value > 0);
        curator = msg.sender;
        name = _name;
        weiGoal = _weiGoal;
        weiBalances[curator] = msg.value;
    }

    function invite(address _invitee) public payable onlyCurator {
        require(msg.value > 0);
        weiBalances[_invitee] = msg.value;
        // TODO fire event that can be detected to send emails, etc...
    }

    function contribute() public payable onlyInvitees {
        weiBalances[msg.sender] += msg.value;
    }

    modifier onlyCurator {
        require(msg.sender == curator);
        _;
    }

    modifier onlyInvitees {
        require(weiBalances[msg.sender] > 0);
        _;
    }
}