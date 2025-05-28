import {
  createWalletClient,
  custom,
  createPublicClient,
  defineChain,
  parseEther,
} from "https://esm.sh/viem";
import { FUND_ME_CONTRACT_ANVIL_ADDRESS, abi } from "./constants-js.js";

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
    // dummy client
    const dummyClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: await getCurrentChain(dummyClient),
    }); // define a wallet client with a cusotom transport handled by MetaMask
    const [connectedAccount] = await walletClient.requestAddresses(); // request accounts for connection
    connectButton.innerHTML = "Connected";
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: currentChain,
    });
    const { result, request, gas } = await publicClient.simulateContract({
      address: FUND_ME_CONTRACT_ANVIL_ADDRESS,
      abi,
      functionName: "fund",
      account: connectedAccount,
      value: parseEther(ethAmount),
    });

    const hash = await walletClient.writeContract(request);
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

connectButton.onclick = connectWallet;

fundButton.onclick = fund;
