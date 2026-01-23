# MyNFT Project

This is a generic NFT project template using Hardhat, IPFS (Pinata), and Polygon.

## Project Structure

- `contracts/`: Smart contracts (ERC721).
- `scripts/`: Deployment and interaction scripts.
- `assets/images/`: Place your raw NFT images here.
- `assets/output/`: Generated metadata and token URIs.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy the template to `.env` and fill in your details:
    ```bash
    PRIVATE_KEY=your_wallet_private_key
    PINATA_JWT=your_pinata_jwt
    AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
    ETHERSCAN_API_KEY=your_etherscan_api_key
    ```

3.  **Prepare Assets**
    - Place your images (png, jpg, etc.) in `assets/images`.
    - They will be automatically processed by the upload script.

## Workflow

1.  **Upload to IPFS**
    Uploads images and metadata to Pinata.
    ```bash
    npx hardhat run scripts/batchUpload.js
    ```
    This will generate metadata files and `_tokenURIs.json` in `assets/output`.

2.  **Deploy Contract**
    Deploys the `MyNFT` contract.
    ```bash
    npx hardhat run scripts/deploy.js --network amoy
    ```
    The contract address will be saved to `deployments.json`.

3.  **Batch Mint**
    Mints NFTs using the URIs from the upload step.
    ```bash
    npx hardhat run scripts/batchMint.js --network amoy
    ```

## Configuration

You can customize the collection name, description, and attributes in `scripts/batchUpload.js` and the token name/symbol in `scripts/deploy.js`.
