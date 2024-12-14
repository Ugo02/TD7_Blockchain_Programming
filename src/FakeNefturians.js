import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import importedJson from '../src/artifacts/contracts/FakeNefturians.sol/FakeNefturians.json';

// Contract address and ABI
const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";
const contractABI = importedJson["abi"];

const FakeNefturians = () => {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const price = await contract.tokenPrice();
        setTokenPrice(ethers.formatEther(price)); // Convert the price to Ether
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };

    fetchTokenPrice();
  }, []);

  const handleBuyToken = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setErrorMessage("MetaMask is not installed.");
        return
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call buyAToken with the correct amount
      const value = ethers.parseEther((parseFloat(tokenPrice) + 0.01).toFixed(2)); // Add a small margin (e.g., 0.01 ETH)
      const tx = await contract.buyAToken({ value });
      await tx.wait();

      setSuccessMessage("Token purchased successfully!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error during token purchase:", error);
      setErrorMessage("An error occurred during the purchase.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fake Nefturians</h1>
      {tokenPrice !== null ? (
        <>
          <p>Minimum Token Price: <strong>{tokenPrice} ETH</strong></p>
          <button 
          onClick={handleBuyToken} 
          style={{ backgroundColor: "red", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >Buy a Token</button>
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
