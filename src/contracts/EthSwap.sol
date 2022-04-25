// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "Exchange";
    Token public token; // for getting da code
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token; //for getting da address
    }
    
    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    function buytokens() public payable {
        uint tokenamount = msg.value * rate; // amount of ether used by user * rate of our token

        require(token.balanceOf(address(this)) >= tokenamount);

        token.transfer(msg.sender,tokenamount);

        emit TokenPurchased(msg.sender,address(token),tokenamount,rate);
    }
}