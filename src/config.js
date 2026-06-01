// URL de base de l'API Express.
// Toutes les routes fetch du client l'utilisent pour cibler le bon serveur.
// En développement : localhost:3001. En production sur GCP : remplacé par le domaine Nginx.
export const API_URL = "http://localhost:3001";
