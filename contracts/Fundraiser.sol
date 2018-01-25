pragma solidity ^0.4.18;
import {ArrayUtil} from "./ArrayUtil.sol";

/** @title eth-fundraiser, a socio-anarchist crowdfunging platform. 
  * @author Rick Batka
  */
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

    /** Invite someone (via wallet address) to participate in the fundraiser. Once invited, 
      * they will be able to contribute an unlimited amount toward the goal.
      * (Can only be executed by the fundraiser's curator / owner).
      * (Can only be executed on still active fundraisers).
      * 
      * @param invitee Address of the wallet to invite.
      */
    function invite(address invitee) public onlyCurator onlyActive {
        members.push(invitee);
        // TODO fire event that can be detected to send emails, etc...
    }

    /** Contribute some wei toward the fundraiser's shared goal (Payable).
      * Members can get their money back via the withdrawRefund() method if the fundraiser is abandoned.
      * If the goal is reached, the curator can cash out the fundraiser, taking the shared pool of 
      * raised funds to use for its stated purpose. After cashOut, members can not get their money back.
      * (Can only be executed by invited members).
      * (Can only be executed on still active fundraisers).
      */
    function contribute() public payable onlyMembers onlyActive {
        assert(msg.value > 0);
        weiBalances[msg.sender] += msg.value;
    }

    /** Gets the sum total of contributions so far. Useful for checking 
      * in on the progress toward the shared fundraising goal.
      */
    function getTotalWeiContributed() public view returns (uint) {
        uint total = 0;
        for (uint i = 0; i < members.length; i++) {
            total += weiBalances[members[i]];
        }
        return total;
    }

    /** Cash out a successful fundraiser. Transfers all raised funds to 
      * the curator's wallet to be used for their stated purpose. Can only be performed
      * if the fundraiser's current balance is greater or equal to its stated goal ("weiGoal").
      * Permanently deactivates the fundraiser so no additional contributions can accidentally be made.
      * (Can only be executed by the fundraiser's curator / owner).
      * (Can only be executed on still active fundraisers).
      * 
      * @return True if conditions were met and cashOut succeeded, False otherwise (will throw and revert on fail).
      */
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

    /** Permanently abandon the fundraiser and unlock members' contributions for refund. Cannot 
      * be undone. Once abandoned, no further contributions are allowed and members are free to 
      * collect full refunds of their respective contribution amounts.
      * (Can only be executed by the fundraiser's curator / owner).
      * (Can only be executed on still active fundraisers).
      */
    function abandon() public onlyCurator onlyActive () {
        var totalWeiContributed = getTotalWeiContributed();
        assert(this.balance == totalWeiContributed);
        active = false;
    }

    /** Collect your refund from an abandoned fundraiser. 
      * Members can only withdraw their individual contributions, and must
      * take the entire refund in one transaction.
      *
      * @return True if conditions were met and refund was successful (fundraiser is abandoned and member has a positive balance), 
      * False otherwise (throw and revert on fail).
      */
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