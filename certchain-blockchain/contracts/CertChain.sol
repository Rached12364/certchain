// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract CertChain {
    struct Certificate {
        bytes32 certHash;
        address issuedBy;
        uint256 issuedAt;
        bool    isValid;
    }
    mapping(bytes32 => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;
    address public owner;
    event CertificateIssued(bytes32 indexed certHash, address indexed issuer, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed certHash);
    event IssuerAuthorized(address indexed issuer);
    modifier onlyOwner() { require(msg.sender == owner, "Pas owner"); _; }
    modifier onlyIssuer() { require(authorizedIssuers[msg.sender], "Pas emetteur"); _; }
    constructor() { owner = msg.sender; authorizedIssuers[msg.sender] = true; }
    function authorizeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    function issueCertificate(bytes32 certHash) external onlyIssuer {
        require(certificates[certHash].issuedAt == 0, "Deja enregistre");
        certificates[certHash] = Certificate(certHash, msg.sender, block.timestamp, true);
        emit CertificateIssued(certHash, msg.sender, block.timestamp);
    }
    function revokeCertificate(bytes32 certHash) external onlyIssuer {
        require(certificates[certHash].issuedAt != 0, "Inexistant");
        require(certificates[certHash].issuedBy == msg.sender, "Pas votre certificat");
        certificates[certHash].isValid = false;
        emit CertificateRevoked(certHash);
    }
    function verifyCertificate(bytes32 certHash) external view
        returns (bool exists, bool isValid, address issuedBy, uint256 issuedAt)
    {
        Certificate memory cert = certificates[certHash];
        if (cert.issuedAt == 0) return (false, false, address(0), 0);
        return (true, cert.isValid, cert.issuedBy, cert.issuedAt);
    }
}