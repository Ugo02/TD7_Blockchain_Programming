import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import importedJson from '../src/artifacts/contracts/FakeBAYC.sol/FakeBAYC.json';

function FakeBaycToken() {
  const { tokenId } = useParams(); // Récupère le tokenId depuis l'URL
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // Adresse du contrat
  const ABI = importedJson["abi"];

  const fetchTokenMetadata = async () => {
    try {
      console.log("Fetching metadata for token ID:", tokenId); // Log du tokenId

      if (!window.ethereum) {
        setError("Metamask is not installed!");
        console.error("Metamask is not installed!"); // Log si MetaMask n'est pas installé
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      setLoading(true);
      setError(null);

      // Appeler tokenURI(tokenId) pour obtenir l'URI des métadonnées
      const tokenUri = await contract.tokenURI(tokenId);

      // Faire une requête HTTP à l'URI récupéré
      const response = await fetch(tokenUri);

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata from URI: ${tokenUri}`);
      }

      const data = await response.json();
      // Mettre à jour les données de métadonnées
      setMetadata(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching token metadata:", err); // Log de l'erreur
      if (err.message.includes("invalid token ID") || err.message.includes("revert")) {
        setError(`Token #${tokenId} does not exist.`);
      } else {
        setError("An error occurred while fetching token metadata.");
      }
      setLoading(false);
    }
  };

  function resolveIpfsUrl(ipfsUrl) {
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUrl;
  }
  

  useEffect(() => {
    fetchTokenMetadata();
  }, [tokenId]);

  return (
    <div>
      <h1>Token Details for #{tokenId}</h1>
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
