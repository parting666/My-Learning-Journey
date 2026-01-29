import { Network, Alchemy } from "alchemy-sdk";

// Get network from env or use Sepolia as default
const getNetwork = () => {
    const envNetwork = import.meta.env.VITE_ALCHEMY_NETWORK;
    switch (envNetwork) {
        case 'polygon-amoy':
            return Network.MATIC_AMOY;
        case 'polygon-mumbai':
            return Network.MATIC_MUMBAI;
        case 'sepolia':
            return Network.ETH_SEPOLIA;
        default:
            return Network.ETH_SEPOLIA;
    }
};

const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: getNetwork(),
};

// Check if API key is set
if (!settings.apiKey) {
    console.warn('⚠️ Alchemy API Key not set. ERC20 token scanning will not work.');
}

export const alchemy = new Alchemy(settings);
