const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();

const CONFIG = {
    // 集合名称 / Collection Name
    COLLECTION_NAME: "My ERC1155 Collection",
    // 集合描述 / Collection Description
    COLLECTION_DESCRIPTION: "This is a highly configurable and reusable ERC1155 collection.",
    IMAGES_INPUT_DIR: path.join(__dirname, "../assets/images"),
    OUTPUT_DIR: path.join(__dirname, "../assets/output"),
    // 生成属性的函数 / Function to generate attributes
    generateAttributes: (imageName) => {
        return [
            { trait_type: "ID", value: imageName },
            { trait_type: "Rarity", value: Math.random() < 0.1 ? "Super Rare" : "Common" },
        ];
    }
};

const pinataJWT = process.env.PINATA_JWT;

async function uploadToIPFS(filePathOrData, fileName) {
    const isFilePath = typeof filePathOrData === 'string';
    const url = isFilePath ? "https://api.pinata.cloud/pinning/pinFileToIPFS" : "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    let data, headers;
    if (isFilePath) {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePathOrData));
        formData.append('pinataMetadata', JSON.stringify({ name: fileName }));
        data = formData;
        headers = { ...formData.getHeaders(), "Authorization": `Bearer ${pinataJWT}` };
    } else {
        data = { pinataContent: filePathOrData, pinataMetadata: { name: fileName } };
        headers = { "Content-Type": "application/json", "Authorization": `Bearer ${pinataJWT}` };
    }
    const response = await axios.post(url, data, { headers });
    return response.data.IpfsHash;
}

async function main() {
    if (!pinataJWT) return console.error("Pinata JWT is not set in the .env file.");
    if (!fs.existsSync(CONFIG.IMAGES_INPUT_DIR)) return console.error(`Images directory not found at: ${CONFIG.IMAGES_INPUT_DIR}`);
    if (!fs.existsSync(CONFIG.OUTPUT_DIR)) fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });

    console.log("🚀 Starting batch upload process...");
    const imageFiles = fs.readdirSync(CONFIG.IMAGES_INPUT_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    const tokenURIs = [];

    for (const fileName of imageFiles) {
        const imageName = path.parse(fileName).name;
        console.log(`\n--- Processing: ${fileName} ---`);
        const imageCID = await uploadToIPFS(path.join(CONFIG.IMAGES_INPUT_DIR, fileName), fileName);
        console.log(`🖼️  Image uploaded. CID: ${imageCID}`);
        const metadata = {
            name: `${CONFIG.COLLECTION_NAME} #${imageName}`,
            description: CONFIG.COLLECTION_DESCRIPTION,
            image: `ipfs://${imageCID}`,
            attributes: CONFIG.generateAttributes(imageName),
        };
        fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, `ERC1155-${imageName}.json`), JSON.stringify(metadata, null, 2));
        const metadataCID = await uploadToIPFS(metadata, `ERC1155-${imageName}.json`);
        console.log(`📄 Metadata uploaded. CID: ${metadataCID}`);
        tokenURIs.push(`ipfs://${metadataCID}`);
    }
    
    const outputFile = path.join(CONFIG.OUTPUT_DIR, "ERC1155_tokenURIs.json");
    fs.writeFileSync(outputFile, JSON.stringify(tokenURIs, null, 2));
    console.log(`\n🎉 All files processed! Token URIs saved to: ${outputFile}`);
}

main().catch(() => process.exit(1));
