import {
  createWalletClient,
  custom,
  createPublicClient,
  defineChain,
  parseEther,
  formatEther,
} from "https://esm.sh/viem";
import { FUND_ME_CONTRACT_ANVIL_ADDRESS, abi } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

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
  event.preventDefault();

  const ethAmount = ethAmountInput.value;
  if (!window.ethereum) {
    connectButton.innerHTML = "Please install MetaMask";
    return;
  }

  const transport = custom(window.ethereum);

  // Initialize a temporary public client to get the current chain
  const tempClient = createPublicClient({ transport });
  const chain = await getCurrentChain(tempClient);

  // Create both wallet and public clients with the same chain
  const walletClient = createWalletClient({ transport, chain });
  const publicClient = createPublicClient({ transport, chain });

  const [account] = await walletClient.requestAddresses();
  connectButton.innerHTML = "Connected";
  try {
    const { request } = await publicClient.simulateContract({
      address: FUND_ME_CONTRACT_ANVIL_ADDRESS,
      abi,
      functionName: "fund",
      account,
      value: parseEther(ethAmount),
    });

    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);
  } catch (error) {
    console.error("Transaction failed:", error);

    // Optional: Extract and show revert reason (if available)
    if (error.cause?.reason) {
      alert(`Transaction reverted: ${error.cause.reason}`);
    } else if (error.shortMessage) {
      alert(`Error: ${error.shortMessage}`);
    } else {
      alert("Transaction failed. Check console for details.");
    }
  }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:8545"] },
    },
  });
  return currentChain;
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    }); // define a wallet client with a cusotom transport handled by MetaMask
    const balance = await publicClient.getBalance({
      address: FUND_ME_CONTRACT_ANVIL_ADDRESS,
    });
    console.log(formatEther(balance));
  } else connectButton.innerHTML = "Please install MetaMask";
}
async function withdraw(event) {
  event.preventDefault();

  if (!window.ethereum) {
    connectButton.innerHTML = "Please install MetaMask";
    return;
  }

  const transport = custom(window.ethereum);
  const tempClient = createPublicClient({ transport });
  const chain = await getCurrentChain(tempClient);

  const walletClient = createWalletClient({ transport, chain });
  const publicClient = createPublicClient({ transport, chain });

  const [account] = await walletClient.requestAddresses();
  connectButton.innerHTML = "Connected";

  try {
    const { request } = await publicClient.simulateContract({
      address: FUND_ME_CONTRACT_ANVIL_ADDRESS,
      abi,
      functionName: "withdraw",
      account,
    });

    const hash = await walletClient.writeContract(request);
    console.log("Withdraw transaction hash:", hash);
  } catch (error) {
    console.error("Transaction failed:", error);

    // Optional: Extract and show revert reason (if available)
    if (error.cause?.reason) {
      alert(`Transaction reverted: ${error.cause.reason}`);
    } else if (error.shortMessage) {
      alert(`Error: ${error.shortMessage}`);
    } else {
      alert("Transaction failed. Check console for details.");
    }
  }
}

connectButton.onclick = connectWallet;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
