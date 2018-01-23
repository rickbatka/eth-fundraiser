pragma solidity ^0.4.18;
import {ArrayUtil} from "./ArrayUtil.sol";

contract Fundraiser {
    using ArrayUtil for address[];
    address public curator;
    string public name;
    uint public weiGoal;
    address[] private members;
    mapping(address => uint) private weiBalances;

    function Fundraiser(string _name, uint _weiGoal) public {
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

    function invite(address invitee) public onlyCurator {
        members.push(invitee);
        // TODO fire event that can be detected to send emails, etc...
    }

    function contribute() public payable onlyMembers {
        weiBalances[msg.sender] += msg.value;
    }

    function getTotalWeiContributed() public view onlyMembers returns (uint) {
        uint total = 0;
        for (uint i = 0; i < members.length; i++) {
            total += weiBalances[members[i]];
        }
        return total;
    }
}