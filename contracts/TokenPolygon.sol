// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenPolygon is ERC20, AccessControl {
    bytes32 public constant CHILD_CHAIN_MANAGER = keccak256("CHILD_CHAIN_MANAGER");

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _setupRole(CHILD_CHAIN_MANAGER, 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa);
    }

  /**
   * @notice called when token is deposited on root chain
   * @dev Should be callable only by ChildChainManager
   * Should handle deposit by minting the required amount for user
   * Make sure minting is done only by this function
   * @param user user address for whom deposit is being done
   * @param depositData abi encoded amount
   */
    function deposit(address user, bytes calldata depositData) external onlyRole(CHILD_CHAIN_MANAGER)
    {
        uint256 amount = abi.decode(depositData, (uint256));
        _mint(user, amount);
    }

  /**
   * @notice called when user wants to withdraw tokens back to root chain
   * @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
   * @param amount amount of tokens to withdraw
   */
    function withdraw(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}
