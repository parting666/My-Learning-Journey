const fs = require('fs');
const path = require('path');

const ARTIFACTS = [
  {
    name: 'MyERC20Token',
    source: '../artifacts/contracts/MyERC20Token.sol/MyERC20Token.json',
    dest: '../../frontend/src/artifacts/MyERC20Token.ts'
  },
  {
    name: 'MyERC721Token', // Frontend variable name
    source: '../artifacts/contracts/MyERC721NFT.sol/MyERC721NFT.json',
    dest: '../../frontend/src/artifacts/MyERC721Token.ts'
  },
  {
    name: 'MyERC1155Token',
    source: '../artifacts/contracts/MyERC1155Token.sol/MyERC1155Token.json',
    dest: '../../frontend/src/artifacts/MyERC1155Token.ts'
  }
];

function updateArtifact(artifactConfig) {
  const artifactPath = path.resolve(__dirname, artifactConfig.source);
  const frontendPath = path.resolve(__dirname, artifactConfig.dest);

  if (!fs.existsSync(artifactPath)) {
    console.error(`Artifact not found at: ${artifactPath}`);
    return;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const content = `export const ${artifactConfig.name} = {
  abi: ${JSON.stringify(artifact.abi, null, 2)},
  bytecode: '${artifact.bytecode}'
}
`;

  fs.writeFileSync(frontendPath, content);
  console.log(`Frontend artifact updated successfully at: ${frontendPath}`);
}

ARTIFACTS.forEach(updateArtifact);
