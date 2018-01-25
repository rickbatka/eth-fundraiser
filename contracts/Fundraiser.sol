pragma solidity ^0.4.18;
import {ArrayUtil} from "./ArrayUtil.sol";

contract Fundraiser {
    using ArrayUtil for address[];
    address public curator;
    string public name;
    uint public weiGoal;
    address[] private members;
    mapping(address => uint) public weiBalances;
    bool public active;

    function Fundraiser(string _name, uint _weiGoal) public {
        active = true;
        curator = msg.sender;
        name = _name;
        weiGoal = _weiGoal;
        members.push(msg.sender);
    }

    modifier onlyCurator {
        require(msg.sender == curator);
        _;
    }

    modifier onlyMembers {
        require(members.contains(msg.sender));
        _;
    }

    modifier onlyActive {
        require(active);
        _;
    }

    modifier onlyAbandoned {
        require(!active);
        _;
    }

    function invite(address invitee) public onlyCurator onlyActive {
        members.push(invitee);
        // TODO fire event that can be detected to send emails, etc...
    }

    function contribute() public payable onlyMembers onlyActive {
        assert(msg.value > 0);
        weiBalances[msg.sender] += msg.value;
    }

    function getTotalWeiContributed() public view onlyMembers returns (uint) {
        uint total = 0;
        for (uint i = 0; i < members.length; i++) {
            total += weiBalances[members[i]];
        }
        return total;
    }

    function cashOut() public onlyCurator onlyActive returns (bool) {
        var totalWeiContributed = getTotalWeiContributed();
        assert(this.balance == totalWeiContributed);
        if (totalWeiContributed >= weiGoal) {
             msg.sender.transfer(this.balance);
             active = false;
             return true;
        }
        
        return false;
    }

    function abandon() public onlyCurator onlyActive () {
        var totalWeiContributed = getTotalWeiContributed();
        assert(this.balance == totalWeiContributed);
        active = false;
    }

    function withdrawRefund() public onlyAbandoned returns (bool) {
        var totalWeiContributed = getTotalWeiContributed();
        assert(this.balance == totalWeiContributed);

        if (weiBalances[msg.sender] > 0) {
            msg.sender.transfer(weiBalances[msg.sender]);
            weiBalances[msg.sender] = 0;
            return true;
        }

        return false;
    }
}