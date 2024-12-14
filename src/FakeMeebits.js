import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import importedJson2 from '../src/artifacts/contracts/FakeMeebitsClaimer.sol/FakeMeebitsClaimer.json';
import signatureData from "../src/artifacts/signatures/output-sig.json"; // Import the signature file

const contractAddress = "0x9B6F990793347005bb8a252A67F0FA4d56521447";
const contractABI = importedJson2["abi"];

const FakeMeebits = () => {
    const [tokenId, setTokenId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isClaimed, setIsClaimed] = useState(null);
  
    const checkTokenStatus = async () => {
      if (!tokenId || isNaN(tokenId) || tokenId < 0 || tokenId > 19999) {
        setMessage("Please enter a valid Token ID (0-19999).");
        return;
      }
  
      try {
        if (typeof window.ethereum === "undefined") {
          setMessage("MetaMask is not installed.");
          return;
        }
  
        setLoading(true);
        setMessage("");
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress,contractABI,provider);
  
        // Check if the token has already been claimed
        const claimed = await contract.tokensThatWereClaimed(tokenId);
        setIsClaimed(claimed);
  
        if (claimed) {
          setMessage(`Token ${tokenId} has already been minted.` );
        } else {
          setMessage(`Token ${tokenId} is available to claim.`);
        }
      } catch (err) {
        console.error(err);
        setMessage(err.message || "An error occurred while checking the token status.");
      } finally {
        setLoading(false);
      }
    };
  
    const claimToken = async () => {
      if (!tokenId || isNaN(tokenId) || tokenId < 0 || tokenId > 19999) {
        setMessage("Please select a valid Token ID (0-19999).");
        return;
      }
  
      if (isClaimed) {
        setMessage(`Token ${tokenId} has already been minted.`);
        return;
      }
  
      try {
        if (typeof window.ethereum === "undefined") {
          setMessage("MetaMask is not installed.");
          return;
        }
  
        setLoading(true);
  
        // Find the correct signature for the token ID from the JSON file
        const signatureEntry = signatureData.find(
          (entry) => entry.tokenNumber === Number(tokenId)
        );
  
        if (!signatureEntry) {
          setMessage("Signature not found for the selected Token ID.");
          return;
        }
  
        const signature = signatureEntry.signature;
  
        // Connect to the contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
  
        // Claim the token
        const tx = await contract.claimAToken(tokenId, signature);
        await tx.wait();
  
        setMessage(`Token ${tokenId} claimed successfully!`);
        setIsClaimed(true);
      } catch (err) {
        console.error(err);
        setMessage(err.message || "An error occurred while claiming the token.");
      } finally {
        setLoading(false);
      }
    };
  

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h1>Fake Meebits</h1>
            <p>Enter the Token ID you wish to check or claim.</p>

            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="tokenIdInput" style={{ display: "block", marginBottom: "10px" }}>
                    Token ID (0-19999):
                </label>
                <input
                    type="number"
                    id="tokenIdInput"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        width: "100%",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                    placeholder="Enter Token ID"
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={checkTokenStatus}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginRight: "10px",
                    }}
                >
                    {loading ? "Checking..." : "Check Token Status"}
                </button>
                <button
                    onClick={claimToken}
                    disabled={loading || isClaimed === true}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: isClaimed ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isClaimed || loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Claiming..." : "Claim Token"}
                </button>
            </div>

            {message && (
                <div
                    style={{
                        padding: "10px",
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        border: "1px solid #f5c6cb",
                        borderRadius: "4px",
                        marginTop: "20px",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default FakeMeebits;
