import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import importedJson from '../src/artifacts/contracts/FakeBAYC.sol/FakeBAYC.json';

// FakeBayc component to display contract data and claim tokens
function FakeBayc() {
  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [tokenIds, setTokenIds] = useState([]); // Store token IDs
  const navigate = useNavigate(); // Hook for navigation

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // FakeBAYC contract address
  const ABI = importedJson["abi"];

  // Fetch contract data such as name, total supply, and token IDs
  const fetchContractData = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const contractName = await contract.name();
      const contractTotalSupply = await contract.tokenCounter(); // Get total token count

      setName(contractName);
      setTotalSupply(contractTotalSupply.toString());

      // Fetch all token IDs
      const ids = [];
      for (let i = 1; i <= contractTotalSupply; i++) {
        ids.push(i);
      }
      setTokenIds(ids); // Update token ID list
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching contract data.");
    }
  };

  // Claim a token from the contract
  const claimToken = async () => {
    try {
      if (!window.ethereum) {
        setClaimError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setLoading(true);
      setClaimError(null);

      // Call claimAToken function
      const tx = await contract.claimAToken();

      // Wait for transaction confirmation
      await tx.wait();

      // Reload contract data after claiming
      fetchContractData();  // Refresh contract info

      setLoading(false);
    } catch (err) {
      console.error(err);
      setClaimError("An error occurred while claiming a new token.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData(); // Fetch contract data on component mount
  }, []);

  // Navigate to selected token's details page
  const handleTokenSelect = (event) => {
    const tokenId = event.target.value;
    navigate(`/fakeBayc/${tokenId}`); // Navigate to token details page
  };

  return (
    <div>
      <h1>Fake BAYC</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && (
        <div>
          <p><strong>Name :</strong> {name || "Loading..."}</p>
          <p><strong>Total tokens :</strong> {totalSupply || "Loading..."}</p>

          <button
            onClick={claimToken}
            disabled={loading || claimError}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: loading || claimError ? "#6c757d" : "#28a745", // Green when active, grey when loading or error
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading || claimError ? "not-allowed" : "pointer",
              marginBottom: "20px", // Space between button and dropdown
            }}
          >
            {loading ? "Claiming..." : "Claim a new token"}
          </button>
          {claimError && <p style={{ color: "red" }}>{claimError}</p>}

          <div>
            <label htmlFor="tokenSelect">Select token ID for more information: </label>
            <select 
              id="tokenSelect" 
              onChange={handleTokenSelect} 
              style={{
                padding: "10px", // Padding inside the dropdown
                fontSize: "16px", // Font size inside dropdown
                backgroundColor: "white", // White background
                border: "2px solid #007bff", // Blue border
                borderRadius: "5px", // Rounded corners
                cursor: "pointer", // Pointer cursor
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                width: "100%", // Full width dropdown
              }}
            >
              <option value="">Select token</option>
              {tokenIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default FakeBayc;
