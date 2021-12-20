pragma solidity >=0.5.16;


import "./IERC20.sol";
import "./ERC20.sol";





/**
 * This is an OpenZeppelin implementation
 */

contract ERC20Detailed is IERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    
    

    /**
     * Sets the values for `name`, `symbol`, and `decimals`. All three of
     * these values are immutable: they can only be set once
     */
    constructor (string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    
    
    // Returns the name of the token
     
   
     
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei.
     
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }
}



contract LearnToken is ERC20Detailed,ERC20 {
    address public owner;
    
    constructor() ERC20Detailed('Learn','LRN', 0) public{
        owner = msg.sender;
        _mint(owner,100000);
    }

    function mint(address account, uint256 amount) public returns (bool) {
        require(msg.sender == owner);
        _mint(account, amount);
        return true;
    }
    
}




