// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./CallerContractInterface.sol";

/**
 * @dev Contract module that allows to to get off-cahin ETH price.
 */
contract EthPriceOracle is AccessControl {
    using SafeMath for uint256;
    uint256 private randNonce = 0;
    uint256 private modulus = 1000;
    uint256 private numOracles = 0;
    uint256 private THRESHOLD = 0;
    mapping(uint256 => bool) pendingRequests;
    mapping(uint256 => Response[]) public requestIdToResponse;
    struct Response {
        address oracleAddress;
        address callerAddress;
        uint256 ethPrice;
    }
    event GetLatestEthPriceEvent(address callerAddress, uint256 id);
    event SetLatestEthPriceEvent(uint256 ethPrice, address callerAddress);
    event AddOracleEvent(address oracleAddress);
    event RemoveOracleEvent(address oracleAddress);
    event SetThresholdEvent(uint256 threshold);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev can only be added by contract owner.
     */
    function addOracle(address _oracle) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not an owner!");
        require(!hasRole(keccak256("Oracle"), _oracle), "Already an oracle!");
        _grantRole(keccak256("Oracle"), _oracle);
        numOracles++;
        emit AddOracleEvent(_oracle);
    }

    /**
     * @dev can only be removed by contract owner.
     */
    function removeOracle(address _oracle) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not an owner!");
        require(hasRole(keccak256("Oracle"), _oracle), "Not an oracle!");
        require(numOracles > 1, "Do not remove the last oracle!");
        _revokeRole(keccak256("Oracle"), _oracle);
        numOracles--;
        emit RemoveOracleEvent(_oracle);
    }

    /**
     * @dev can only be set by contract owner.
     */
    function setThreshold(uint256 _threshold) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not an owner!");
        THRESHOLD = _threshold;
        emit SetThresholdEvent(THRESHOLD);
    }

    /**
     * @dev generate a random id. store id in state variable pendingRequests
     * and emit GetLatestEthPriceEvent.
     */
    function getLatestEthPrice() public returns (uint256) {
        randNonce++;
        uint256 id = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))
        ) % modulus;
        pendingRequests[id] = true;
        emit GetLatestEthPriceEvent(msg.sender, id);
        return id;
    }

    /**
     * @dev can only be called by oracle address. when oracle response
     * meet the threshold, caculate the average price. delete id in pendingRequests
     * and requestIdToResponse. EthPriceOracle make a external call to CallerContract
     * to update the ETH price with the id. Then emit SetLatestEthPriceEvent.
     */
    function setLatestEthPrice(
        uint256 _ethPrice,
        address _callerAddress,
        uint256 _id
    ) public {
        require(hasRole(keccak256("Oracle"), msg.sender), "Not an oracle!");
        require(
            pendingRequests[_id],
            "This request is not in my pending list."
        );
        Response memory resp = Response(msg.sender, _callerAddress, _ethPrice);
        requestIdToResponse[_id].push(resp);
        uint256 numResponses = requestIdToResponse[_id].length;
        if (numResponses == THRESHOLD) {
            uint256 computedEthPrice = 0;
            for (uint256 i = 0; i < requestIdToResponse[_id].length; i++) {
                computedEthPrice = computedEthPrice.add(
                    requestIdToResponse[_id][i].ethPrice
                );
            }
            computedEthPrice = computedEthPrice.div(numResponses);
            delete pendingRequests[_id];
            delete requestIdToResponse[_id];
            CallerContractInterface callerContractInstance;
            callerContractInstance = CallerContractInterface(_callerAddress);
            callerContractInstance.callback(computedEthPrice, _id);
            emit SetLatestEthPriceEvent(computedEthPrice, _callerAddress);
        }
    }
}
