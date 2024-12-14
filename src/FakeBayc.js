import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import importedJson from '../src/artifacts/contracts/FakeBAYC.sol/FakeBAYC.json';

function FakeBayc() {
  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // Ajout d'un état pour gérer le chargement du claim
  const [claimError, setClaimError] = useState(null); // Pour gérer les erreurs de claim

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // Adresse du contrat FakeBAYC sur Holesky
  const ABI = importedJson["abi"];

  // Fonction pour récupérer les données du contrat
  const fetchContractData = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const contractName = await contract.name();
      const contractTotalSupply = await contract.tokenCounter(); // Appeler tokenCounter pour obtenir le nombre de tokens

      setName(contractName);
      setTotalSupply(contractTotalSupply.toString());
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching contract data.");
    }
  };

  // Fonction pour réclamer un token
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

      // Appeler la fonction claimAToken du contrat
      const tx = await contract.claimAToken();

      // Attendre la confirmation de la transaction
      await tx.wait();

      // Mettre à jour l'état après le claim
      fetchContractData();  // Recharger les données pour afficher le nouveau total

      setLoading(false);
    } catch (err) {
      console.error(err);
      setClaimError("An error occurred while claiming a new token.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div>
      <h1>Fake BAYC</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && (
        <div>
          <p><strong>Name :</strong> {name || "Loading..."}</p>
          <p><strong>Total Tokens :</strong> {totalSupply || "Loading..."}</p>
            <button 
              onClick={claimToken} 
              disabled={loading} 
              style={{ backgroundColor: "red", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              {loading ? "Claiming..." : "Claim a new Token"}
            </button>
          {claimError && <p style={{ color: "red" }}>{claimError}</p>}
        </div>
      )}
    </div>
  );
}

export default FakeBayc;