# CertChain - Certification de Diplomes sur Blockchain
dApp full-stack de certification et verification de diplomes universitaires sur Ethereum Sepolia Testnet.
## Architecture
CertChain/
├── certchain-blockchain/   Smart Contract Solidity + Hardhat
├── certchain-backend/      API REST Spring Boot + PostgreSQL + JWT
└── certchain-frontend/     Interface React + Vite
## Stack Technique
| Couche | Technologies |
|--------|-------------|
| Smart Contract | Solidity 0.8.19, Hardhat, Ethers.js |
| Backend | Spring Boot 3, Java 17, PostgreSQL, JWT |
| Frontend | React 18, Vite, Axios |
| Blockchain | Ethereum Sepolia Testnet, Alchemy |
## Fonctionnalites
- Emission de certificats avec hash SHA-256
- Enregistrement immuable sur la blockchain Ethereum
- Verification de l authenticite via le hash
- Authentification JWT pour les universites
- Lien direct vers Etherscan pour chaque transaction
## Smart Contract
Deploye sur Sepolia Testnet :
0x27d0fbF48EF7D9Bd1b3c3404741DB7c6D50Bde94
https://sepolia.etherscan.io/address/0x27d0fbF48EF7D9Bd1b3c3404741DB7c6D50Bde94
## Installation
Prerequis : Java 17, Maven 3.9+, Node.js 18+, PostgreSQL 15+
### Backend
cd certchain-backend
mvn spring-boot:run
### Frontend
cd certchain-frontend
npm install
npm run dev
Ouvre http://localhost:5173
## API Endpoints
POST   /api/auth/register         Creer un compte
POST   /api/auth/login            Connexion JWT
POST   /api/certificates/issue    Emettre un certificat (auth)
GET    /api/certificates/verify/{hash}  Verifier un certificat
GET    /api/certificates          Liste des certificats (auth)
## Auteur
Ali Rached - ENICarthage 2026