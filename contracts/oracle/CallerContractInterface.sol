// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {CallerContract} interface.
 */
interface CallerContractInterface {
    function callback(uint256 _ethPrice, uint256 id) external;
}
