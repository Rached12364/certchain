const hre = require("hardhat");
async function main() {
  console.log("Deploiement de CertChain sur Sepolia...");
  const CertChain = await hre.ethers.getContractFactory("CertChain");
  const certChain = await CertChain.deploy();
  await certChain.waitForDeployment();
  const address = await certChain.getAddress();
  console.log("CertChain deploye a l adresse:", address);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});