import {
  createWalletClient,
  custom,
  createPublicClient,
} from "https://esm.sh/viem";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");

let walletClient;
let publicClient;
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    }); // define a wallet client with a cusotom transport handled by MetaMask
    const accounts = await walletClient.requestAddresses(); // request accounts for connection
    connectButton.innerHTML = "Connected";
  } else connectButton.innerHTML = "Please install MetaMask";
}

async function fund(event) {
  event.preventDefault(); // prevent form default form submission
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}`);
  // check wallet connection
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    }); // define a wallet client with a cusotom transport handled by MetaMask
    const accounts = await walletClient.requestAddresses(); // request accounts for connection
    connectButton.innerHTML = "Connected";

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    publicClient.simulateContract({
      //address
      // abi
      // functionName
      // argu
      // account
    });
  }
}

connectButton.onclick = connectWallet;

fundButton.onclick = fund;
