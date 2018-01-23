pragma solidity ^0.4.18;

library ArrayUtil {
    function contains(address[] vals, address search) public pure returns (bool) {
        for (uint i = 0; i < vals.length; i++) {
            if (vals[i] == search) {
                return true;
            }
        }
        return false;
    }
}