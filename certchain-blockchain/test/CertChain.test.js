const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("CertChain", function () {
  let certChain, owner, university, recruiter;
  const fakeDiplomaHash = ethers.keccak256(
    ethers.toUtf8Bytes("Rached|Master Informatique|ENICAR|2025")
  );
  beforeEach(async () => {
    [owner, university, recruiter] = await ethers.getSigners();
    const CertChain = await ethers.getContractFactory("CertChain");
    certChain = await CertChain.deploy();
  });
  it("Owner peut autoriser une universite", async () => {
    await certChain.authorizeIssuer(university.address);
    expect(await certChain.authorizedIssuers(university.address)).to.equal(true);
  });
  it("Universite peut emettre un certificat", async () => {
    await certChain.authorizeIssuer(university.address);
    await certChain.connect(university).issueCertificate(fakeDiplomaHash);
    const [exists, isValid] = await certChain.verifyCertificate(fakeDiplomaHash);
    expect(exists).to.equal(true);
    expect(isValid).to.equal(true);
  });
  it("Certificat falsifie detecte", async () => {
    const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("faux diplome"));
    const [exists] = await certChain.verifyCertificate(fakeHash);
    expect(exists).to.equal(false);
  });
  it("Universite peut revoquer un certificat", async () => {
    await certChain.authorizeIssuer(university.address);
    await certChain.connect(university).issueCertificate(fakeDiplomaHash);
    await certChain.connect(university).revokeCertificate(fakeDiplomaHash);
    const [exists, isValid] = await certChain.verifyCertificate(fakeDiplomaHash);
    expect(exists).to.equal(true);
    expect(isValid).to.equal(false);
  });
});
