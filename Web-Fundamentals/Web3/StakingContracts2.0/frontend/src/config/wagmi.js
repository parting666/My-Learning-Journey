import { http, createConfig, fallback } from 'wagmi';
import { mainnet, sepolia, hardhat, polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || "";

export const config = createConfig({
    chains: [hardhat, sepolia, mainnet, polygonAmoy],
    connectors: [
        injected(),
    ],
    transports: {
        [hardhat.id]: http('http://127.0.0.1:8545'),
        [sepolia.id]: http(ALCHEMY_KEY ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}` : "https://rpc.ankr.com/eth_sepolia"),
        [mainnet.id]: http(ALCHEMY_KEY ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : "https://cloudflare-eth.com"),
        [polygonAmoy.id]: fallback([
            http(ALCHEMY_KEY ? `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
            http("https://rpc-amoy.polygon.technology"),
            http("https://polygon-amoy-bor-rpc.publicnode.com"),
            http("https://amoy.drpc.org"),
        ]),
    },
});
