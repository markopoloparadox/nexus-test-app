import { NEXUS_EVENTS, NexusSDK } from '@avail-project/nexus-core';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export async function initialize_nexus(): Promise<NexusSDK> {
  const provider = window.ethereum;

  if (provider == undefined) {
    console.error("MetaMask is not installed");
    throw "Does not work"
  } else {
    console.log("MetaMask provider initialized:", provider);
  }

  // Initialize SDK
  const sdk = new NexusSDK({ network: 'testnet' });
  await sdk.initialize(provider); // Your EVM-compatible wallet provider

  // ---------------------------
  // 1️⃣ Get unified balances
  // ---------------------------
  const balances = await sdk.getBalancesForBridge();
  console.log('Balances:', balances);

  return sdk
}

export async function pay_you_bastard(sdk: NexusSDK) {
  const bridgeResult = await sdk.bridge(
    {
      token: 'USDC',
      amount: 10_000n,
      recipient: '0x198866cD002F9e5E2b49DE96d68EaE9d32aD0000',
      toChainId: 421614,
    },
    {
      onEvent: (event) => {
        if (event.name === NEXUS_EVENTS.STEPS_LIST) console.log('Bridge steps:', event.args);
        if (event.name === NEXUS_EVENTS.STEP_COMPLETE) console.log('Step completed:', event.args);
      },
    },
  );

}