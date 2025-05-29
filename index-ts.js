"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var viem_1 = require("https://esm.sh/viem");
var constants_js_js_1 = require("./constants-js.js");
// Element references with proper type assertions
var connectButton = document.getElementById("connectButton");
var fundButton = document.getElementById("fundButton");
var ethAmountInput = document.getElementById("ethAmount");
var balanceButton = document.getElementById("balanceButton");
var withdrawButton = document.getElementById("withdrawButton");
var walletClient;
var publicClient;
function connectWallet() {
    return __awaiter(this, void 0, void 0, function () {
        var accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 2];
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 1:
                    accounts = _a.sent();
                    connectButton.innerHTML = "Connected";
                    return [3 /*break*/, 3];
                case 2:
                    connectButton.innerHTML = "Please install MetaMask";
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCurrentChain(client) {
    return __awaiter(this, void 0, void 0, function () {
        var chainId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getChainId()];
                case 1:
                    chainId = _a.sent();
                    return [2 /*return*/, (0, viem_1.defineChain)({
                            id: chainId,
                            name: "Custom Chain",
                            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                            rpcUrls: {
                                default: { http: ["http://127.0.0.1:8545"] },
                            },
                        })];
            }
        });
    });
}
function fund(event) {
    return __awaiter(this, void 0, void 0, function () {
        var ethAmount, transport, tempClient, chain, account, request, hash, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    event.preventDefault();
                    ethAmount = ethAmountInput.value;
                    if (!window.ethereum) {
                        connectButton.innerHTML = "Please install MetaMask";
                        return [2 /*return*/];
                    }
                    transport = (0, viem_1.custom)(window.ethereum);
                    tempClient = (0, viem_1.createPublicClient)({ transport: transport });
                    return [4 /*yield*/, getCurrentChain(tempClient)];
                case 1:
                    chain = _d.sent();
                    walletClient = (0, viem_1.createWalletClient)({ transport: transport, chain: chain });
                    publicClient = (0, viem_1.createPublicClient)({ transport: transport, chain: chain });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    account = (_d.sent())[0];
                    connectButton.innerHTML = "Connected";
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_js_js_1.FUND_ME_CONTRACT_ANVIL_ADDRESS,
                            abi: constants_js_js_1.abi,
                            functionName: "fund",
                            account: account,
                            value: (0, viem_1.parseEther)(ethAmount),
                        })];
                case 4:
                    request = (_d.sent()).request;
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 5:
                    hash = _d.sent();
                    console.log("Transaction hash:", hash);
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _d.sent();
                    console.error("Transaction failed:", error_1);
                    alert((_c = (_b = (_a = error_1.cause) === null || _a === void 0 ? void 0 : _a.reason) !== null && _b !== void 0 ? _b : error_1.shortMessage) !== null && _c !== void 0 ? _c : "Transaction failed. Check console for details.");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 2];
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_js_js_1.FUND_ME_CONTRACT_ANVIL_ADDRESS,
                        })];
                case 1:
                    balance = _a.sent();
                    console.log((0, viem_1.formatEther)(balance));
                    return [3 /*break*/, 3];
                case 2:
                    connectButton.innerHTML = "Please install MetaMask";
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function withdraw(event) {
    return __awaiter(this, void 0, void 0, function () {
        var transport, tempClient, chain, account, request, hash, error_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    event.preventDefault();
                    if (!window.ethereum) {
                        connectButton.innerHTML = "Please install MetaMask";
                        return [2 /*return*/];
                    }
                    transport = (0, viem_1.custom)(window.ethereum);
                    tempClient = (0, viem_1.createPublicClient)({ transport: transport });
                    return [4 /*yield*/, getCurrentChain(tempClient)];
                case 1:
                    chain = _d.sent();
                    walletClient = (0, viem_1.createWalletClient)({ transport: transport, chain: chain });
                    publicClient = (0, viem_1.createPublicClient)({ transport: transport, chain: chain });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    account = (_d.sent())[0];
                    connectButton.innerHTML = "Connected";
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_js_js_1.FUND_ME_CONTRACT_ANVIL_ADDRESS,
                            abi: constants_js_js_1.abi,
                            functionName: "withdraw",
                            account: account,
                        })];
                case 4:
                    request = (_d.sent()).request;
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 5:
                    hash = _d.sent();
                    console.log("Withdraw transaction hash:", hash);
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _d.sent();
                    console.error("Transaction failed:", error_2);
                    alert((_c = (_b = (_a = error_2.cause) === null || _a === void 0 ? void 0 : _a.reason) !== null && _b !== void 0 ? _b : error_2.shortMessage) !== null && _c !== void 0 ? _c : "Transaction failed. Check console for details.");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Event bindings
connectButton.onclick = connectWallet;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
