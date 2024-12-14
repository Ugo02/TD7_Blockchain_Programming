import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import importedJson from '../src/artifacts/contracts/FakeBAYC.sol/FakeBAYC.json';

function FakeBaycToken() {
  const { tokenId } = useParams(); // Retrieve tokenId from URL
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // FakeBAYC contract address
  const ABI = importedJson["abi"];

  // Function to fetch metadata for a token
  const fetchTokenMetadata = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      setLoading(true);
      setError(null);

      // Get the token's metadata URI
      const tokenUri = await contract.tokenURI(tokenId);

      // Fetch metadata from the URI
      const response = await fetch(tokenUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata from URI: ${tokenUri}`);
      }

      const data = await response.json();
      setMetadata(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // Handle errors based on the error message
      if (err.message.includes("invalid token ID") || err.message.includes("revert")) {
        setError(`Token #${tokenId} does not exist.`);
      } else {
        setError("An error occurred while fetching token metadata.");
      }
    }
  };

  // Fetch metadata whenever the tokenId changes
  useEffect(() => {
    if (tokenId) {
      fetchTokenMetadata();
    }
  }, [tokenId]);

  // Helper function to resolve IPFS URLs
  function resolveIpfsUrl(ipfsUrl) {
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUrl;
  }

  return (
    <div>
      <h1>Token details for {tokenId}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {metadata && (
        <div>
          <img 
            src={resolveIpfsUrl(metadata.image)} 
            alt={`Token ${tokenId}`} 
            style={{ maxWidth: "300px" }} 
          />
          <h2>{metadata.name}</h2>
          <p>{metadata.description}</p>
          <h3>Attributes:</h3>
          <ul>
            {metadata.attributes.map((attr, index) => (
              <li key={index}>
                <strong>{attr.trait_type}:</strong> {attr.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FakeBaycToken;
