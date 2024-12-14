import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom"; 

// ChainInfo component to display information about the chain, block, and user address
const ChainInfo = () => {
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  // Function to connect to Metamask and retrieve network info
  const connectMetamask = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed. Please install it to use this feature.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      console.log(network)

      if (network.chainId.toString() !== "17000") {
        navigate("/error"); // Navigate to error page if wrong network
        return;
      }

      const address = await signer.getAddress();
      const blockNumber = await provider.getBlockNumber();

      setChainId(network.chainId.toString());
      setBlockNumber(blockNumber);
      setUserAddress(address);
      setError("");
    } catch (err) {
      console.error("Error connecting to Metamask:", err);
      setError("Failed to connect to Metamask. Make sure it is unlocked.");
    }
  };

  useEffect(() => {
    connectMetamask(); // Connect to Metamask on component mount
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Chain Info</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && (
        <div>
          <p><strong>Chain ID:</strong> {chainId ? chainId : "Loading..."}</p>
          <p><strong>Last block number:</strong> {blockNumber ? blockNumber : "Loading..."}</p>
          <p><strong>User address:</strong> {userAddress ? userAddress : "Loading..."}</p>
        </div>
      )}
    </div>
  );
};

export default ChainInfo;
