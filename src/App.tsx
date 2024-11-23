import { useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";
 
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
 
function App() {

    // State in u8 format and in 8 bits to control every switch individually
    const [switchesByte, setSwitchesByte] = useState<number>(0); // Valor u8
    const [switches, setSwitches] = useState<boolean[]>(new Array(8).fill(false)); // Array of switches
    console.log("switches:", switches); // QUITAR

  
    // Sync switches with switchesByte
    useEffect(() => {
      const newSwitches = Array.from({ length: 8 }, (_, index) => Boolean((switchesByte >> (7 - index)) & 1));
      setSwitches(newSwitches);
    }, [switchesByte]);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
 
  // Conversion of u8 to binary
  const switchesBinary = switchesByte.toString(2).padStart(8, "0");
  console.log("switchesBinary:", switchesBinary); // QUITAR

  // Function to manage the state change of the switches
  const handleSwitchChange = (index: number) => {
    const adjustedIndex = 7 - index;
    const newByte = switchesByte ^ (1 << adjustedIndex);
    setSwitchesByte(newByte); // Update u8 value
    const newSwitches = Array.from(
      { length: 8 },
      (_, i) => Boolean((newByte >> (7 - i)) & 1)
    );
    setSwitches(newSwitches); // Sync switches
  };
  console.log("handleSwitchChange:", handleSwitchChange); // QUITAR

 return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="wallet-container">
            <WalletMultiButton />
          </div>
          <h1 className="heading">Switch Master Control</h1>
          {/* Switches */}
          <div className="switch-container"> 
            {switches.map((state, index) => (
              <div key={index} className="switch-item"> 
                <label className="switch-label">{`Device ${index + 1}`}</label> 
                <button
                  className={`switch-button ${state ? "on" : "off"}`}
                  onClick={() => handleSwitchChange(index)} // Usa la función
                >
                  {state ? "ON" : "OFF"}
                </button>
              </div>
            ))}
          </div>
          {/* Binary and u8 coding from the switches */}
          <div
            style={{
              position: "absolute",
              top: "210px",     
              left: "5px",   
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px", marginLeft: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", marginRight: "10px" }}>Switches new value:</label>
                <input
                  type="text"
                  value={switchesBinary}
                  readOnly
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", marginRight: "10px" }}>(u8 Format):</label>
                <input
                  type="text"
                  value={switchesByte}
                  readOnly
                />
              </div>
            </div>
          </div> 
          {/* Components to show the switches states from the blockchain */}     
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
 
export default App;
