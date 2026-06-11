const { ethers } = require("ethers");
require("dotenv").config();
async function main() {
    const certHash = process.argv[2];
    if (!certHash) { console.log("ERROR: no hash"); process.exit(1); }
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractAddress = "0x27d0fbF48EF7D9Bd1b3c3404741DB7c6D50Bde94";
    const abi = ["function issueCertificate(bytes32 certHash) external"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const hashBytes = ethers.zeroPadValue("0x" + certHash, 32);
    const tx = await contract.issueCertificate(hashBytes);
    console.log("TX_HASH:" + tx.hash);
    process.exit(0);
}
main().catch(e => { console.log("ERROR:" + e.message); process.exit(1); });