// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {EthPriceOracle} interface.
 */
interface EthPriceOracleInterface {
    function getLatestEthPrice() external returns (uint256);
}
