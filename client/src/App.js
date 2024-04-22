import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from  "./components/Display";
import Modal from "./components/Modal";
import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const wallet = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        
        window.ethereum.on("chainChanged" , () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged" , () => {
             window.location.reload();
        });

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed");
      }
    };

    provider && wallet();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>Share</button>
      )}

      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>File Sharing Web</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload account={account} contract={contract} />
        <Display account={account} contract={contract} />
      </div>
    </>
  );
}

export default App;
