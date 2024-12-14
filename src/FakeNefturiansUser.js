import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import importedJson from '../src/artifacts/contracts/FakeNefturians.sol/FakeNefturians.json';

// Contract details
const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";
const contractABI = importedJson["abi"];

const FakeNefturiansUser = () => {
  const { userAddress } = useParams(); // Retrieve user address from the route parameter

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to resolve IPFS URLs to HTTP URLs
  const resolveIpfsUrl = (ipfsUrl) => {
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUrl;
  };

  useEffect(() => {
    if (!userAddress) return;

    const fetchUserTokens = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Get the number of tokens the user owns
        const balance = await contract.balanceOf(userAddress);
        const tokenCount = ethers.toNumber(balance);

        const userTokens = [];
        for (let i = 0; i < tokenCount; i++) {
          // Get the token ID for each token
          const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);

          // Fetch metadata (e.g., name, description, image) from tokenURI
          const tokenURI = await contract.tokenURI(tokenId);
          const response = await fetch(resolveIpfsUrl(tokenURI));
          const metadata = await response.json();

          userTokens.push({
            image: resolveIpfsUrl(metadata.image), // Resolve IPFS URL for the image
            name: metadata.name,
            description: metadata.description,
          });
        }

        setTokens(userTokens);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
        setErrorMessage("An error occurred while fetching tokens.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTokens();
  }, [userAddress]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fake Nefturians - Tokens Owned by {userAddress}</h1>
      {loading && <p>Loading tokens...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!loading && tokens.length === 0 && <p>No tokens found for this address.</p>}

      {!loading && tokens.length > 0 && (
        <ul>
          {tokens.map((token, index) => (
            <li key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              {token.image && (
                <img 
                  src={token.image} 
                  alt={`NFT Image`} 
                  style={{ maxWidth: "300px", borderRadius: "10px" }}
                />
              )}
              <p><strong>Name:</strong> {token.name}</p>
              <p><strong>Description:</strong> {token.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FakeNefturiansUser;
