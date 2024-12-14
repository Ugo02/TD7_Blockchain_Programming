import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import importedJson from '../src/artifacts/contracts/FakeNefturians.sol/FakeNefturians.json';

const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1"; // FakeNefturians contract address
const contractABI = importedJson["abi"];

const FakeNefturians = () => {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch token price on mount
  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const price = await contract.tokenPrice();
        setTokenPrice(ethers.formatEther(price)); // Convert to Ether
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };
    fetchTokenPrice();
  }, []);

  // Handle token purchase
  const handleBuyToken = async () => {
    try {
      setLoading(true);
      if (typeof window.ethereum === "undefined") {
        setErrorMessage("MetaMask is not installed.");
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const value = ethers.parseEther((parseFloat(tokenPrice) + 0.01).toFixed(2)); // Add margin
      const tx = await contract.buyAToken({ value });
      await tx.wait();
      setSuccessMessage("Token purchased successfully!");
      setLoading(false);
    } catch (error) {
      setErrorMessage("An error occurred during the purchase.");
      setLoading(false);
    }
  };

  // Validate address and navigate
  const handleAddressSubmit = () => {
    if (ethers.isAddress(userAddress)) {
      setAddressError("");
      navigate(`/fakeNefturians/${userAddress}`);
    } else {
      setAddressError("Please enter a valid Ethereum address.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fake Nefturians</h1>
      {tokenPrice !== null ? (
        <>
          <p>Token price : <strong>{tokenPrice} ETH</strong></p>

          <button
            onClick={handleBuyToken}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: loading ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px", 
            }}
          >
            {loading ? "Claiming..." : "Buy a Token"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <label htmlFor="userAddress" style={{ fontSize: "22px", marginBottom: "10px" }}>
              Enter user address to view tokens:
            </label>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <input
                type="text"
                id="userAddress"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                style={{
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "2px solid #007bff",
                  marginRight: "10px",
                  width: "350px",
                  outline: "none"
                }}
              />
              <button
                onClick={handleAddressSubmit}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View tokens
              </button>
            </div>
            {addressError && <p style={{ color: "red", marginTop: "10px" }}>{addressError}</p>}
          </div>

        </>
      ) : (
        <p>Loading token price...</p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default FakeNefturians;
