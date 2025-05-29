import {
  createWalletClient,
  createPublicClient,
  custom,
  defineChain,
  parseEther,
  formatEther,
  Chain,
  PublicClient,
  WalletClient,
} from "viem";
import { FUND_ME_CONTRACT_ANVIL_ADDRESS, abi } from "./constants-js.js";

// Element references with proper type assertions
const connectButton = document.getElementById(
  "connectButton"
) as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById(
  "balanceButton"
) as HTMLButtonElement;
const withdrawButton = document.getElementById(
  "withdrawButton"
) as HTMLButtonElement;

let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

async function connectWallet(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const accounts = await walletClient.requestAddresses();
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function getCurrentChain(client: PublicClient): Promise<Chain> {
  const chainId = await client.getChainId();
  return defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:8545"] },
    },
  });
}

async function fund(event: Event): Promise<void> {
  event.preventDefault();
  const ethAmount = ethAmountInput.value;

  if (!window.ethereum) {
    connectButton.innerHTML = "Please install MetaMask";
    return;
  }

  const transport = custom(window.ethereum);
  const tempClient = createPublicClient({ transport });
  const chain = await getCurrentChain(tempClient);

  walletClient = createWalletClient({ transport, chain });
  publicClient = createPublicClient({ transport, chain });

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
  } catch (error: any) {
    console.error("Transaction failed:", error);
    alert(
      error.cause?.reason ??
        error.shortMessage ??
        "Transaction failed. Check console for details."
    );
  }
}

async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const balance = await publicClient.getBalance({
      address: FUND_ME_CONTRACT_ANVIL_ADDRESS,
    });
    console.log(formatEther(balance));
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function withdraw(event: Event): Promise<void> {
  event.preventDefault();

  if (!window.ethereum) {
    connectButton.innerHTML = "Please install MetaMask";
    return;
  }

  const transport = custom(window.ethereum);
  const tempClient = createPublicClient({ transport });
  const chain = await getCurrentChain(tempClient);

  walletClient = createWalletClient({ transport, chain });
  publicClient = createPublicClient({ transport, chain });

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
  } catch (error: any) {
    console.error("Transaction failed:", error);
    alert(
      error.cause?.reason ??
        error.shortMessage ??
        "Transaction failed. Check console for details."
    );
  }
}

// Event bindings
connectButton.onclick = connectWallet;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
