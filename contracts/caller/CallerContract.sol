// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./EthPriceOracleInterface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Contract module that allows to call oracle for updating ETH price.
 */
contract CallerContract is Ownable {
    uint256 private ethPrice;
    EthPriceOracleInterface private oracleInstance;
    address private oracleAddress;
    mapping(uint256 => bool) myRequests;
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    event PriceUpdatedEvent(uint256 ethPrice, uint256 id);

    /**
     * @dev Only contract owner can change oracleAddress.
     */
    function setOracleInstanceAddress(address _oracleInstanceAddress)
        public
        onlyOwner
    {
        oracleAddress = _oracleInstanceAddress;
        oracleInstance = EthPriceOracleInterface(oracleAddress);
        emit newOracleAddressEvent(oracleAddress);
    }

    /**
     * @dev Called by client. updateEthPrice return a random id.
     * CallerContract make a external call to EthPriceOracle to
     * get the random id, which store in state variavle myRequests.
     */
    function updateEthPrice() public {
        uint256 id = oracleInstance.getLatestEthPrice();
        myRequests[id] = true;
        emit ReceivedNewRequestIdEvent(id);
    }

    /**
     * @dev Called by EthPriceOracle. EthPriceOracle response
     * ETH price and id, callback check the id if was sotre in
     * myRequests. Then delete id and emit PriceUpdatedEvent.
     */
    function callback(uint256 _ethPrice, uint256 _id) public onlyOracle {
        require(myRequests[_id], "This request is not in my pending list.");
        ethPrice = _ethPrice;
        delete myRequests[_id];
        emit PriceUpdatedEvent(_ethPrice, _id);
    }

    /**
     * @dev Throws if called by any none oracle address.
     */
    modifier onlyOracle() {
        require(
            msg.sender == oracleAddress,
            "You are not authorized to call this function."
        );
        _;
    }
}
