use ethers::prelude::abigen;

abigen!(
    CallerContract,
    r#"[
        function setOracleInstanceAddress(address) public onlyOwner
        function updateEthPrice() public
        function callback(uint256, uint256) public onlyOracle 
        event newOracleAddressEvent(address oracleAddress)
        event ReceivedNewRequestIdEvent(uint256 id)
        event PriceUpdatedEvent(uint256 ethPrice, uint256 id)
    ]"#,
    event_derives(serde::Deserialize, serde::Serialize)
);

abigen!(
    EthPriceOracle,
    r#"[
        function addOracle(address) public
        function removeOracle(address) public
        function setThreshold(uint256) public
        function getLatestEthPrice() public returns (uint256)
        function setLatestEthPrice(uint256, address, uint256) public
        event GetLatestEthPriceEvent(address callerAddress, uint256 id)
        event SetLatestEthPriceEvent(uint256 ethPrice, address callerAddress)
        event AddOracleEvent(address oracleAddress)
        event RemoveOracleEvent(address oracleAddress)
        event SetThresholdEvent(uint256 threshold)
    ]"#,
    event_derives(serde::Deserialize, serde::Serialize)
);
