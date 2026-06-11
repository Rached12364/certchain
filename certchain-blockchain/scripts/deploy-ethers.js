const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Deploiement depuis:", wallet.address);
    // Lire l ABI et bytecode compiles par Hardhat
    const artifactPath = path.join(__dirname, "../artifacts/contracts/CertChain.sol/CertChain.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    console.log("CONTRACT_ADDRESS:" + address);
}
main().catch(e => { console.log("ERROR:" + e.message); process.exit(1); });