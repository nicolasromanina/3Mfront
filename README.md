# PrintPro - Application de Gestion de Services d'Impression

Une application web complète pour la gestion de services d'impression avec interface client et administrateur.

## 🚀 Fonctionnalités

### 👤 Partie Client
- **Authentification** : Connexion/inscription avec gestion des rôles
- **Commandes** : 
  - Formulaire de commande avec choix de services
  - Upload de fichiers (PDF, images, documents)
  - Calcul automatique des prix
  - Génération de devis
- **Suivi** : Statuts en temps réel (devis, en attente, en cours, terminée, livrée, annulée)
- **Historique** : Toutes les commandes avec filtres et recherche
- **Support** : Chat en temps réel avec l'équipe admin
- **Notifications** : Alertes sur l'état des commandes
- **Interface responsive** : Optimisée mobile et desktop

### 🧑‍💼 Partie Admin
- **Dashboard** : Vue d'ensemble avec statistiques
- **Gestion des commandes** : Liste complète avec tri et filtres
- **Changement de statuts** : Mise à jour en temps réel
- **Gestion des clients** : Historique et informations détaillées
- **Services** : Configuration des types d'impression et prix
- **Chat support** : Réponse aux clients
- **Statistiques** : Graphiques et métriques business

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : TailwindCSS
- **Routing** : React Router v6  
- **State Management** : Zustand
- **Icons** : Lucide React
- **Notifications** : React Hot Toast
- **PDF** : jsPDF + html2canvas

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd 3Mfront

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

## 🔐 Comptes de Test

### Client
- **Email** : client@example.com
- **Mot de passe** : password

### Administrateur  
- **Email** : admin@example.com
- **Mot de passe** : password

## 📱 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── layout/         # Layouts (Header, Sidebar, etc.)
│   ├── orders/         # Composants liés aux commandes
│   └── chat/           # Composants de chat
├── pages/              # Pages de l'application
│   ├── auth/           # Pages d'authentification
│   ├── client/         # Pages client
│   └── admin/          # Pages admin
├── store/              # État global (Zustand)
├── types/              # Types TypeScript
├── data/               # Données mockées
└── utils/              # Fonctions utilitaires
```

## 🎯 Fonctionnalités Détaillées

### Services d'Impression
- **Flyers** : A5, différents papiers, recto-verso, pelliculage
- **Cartes de visite** : Formats standards, finitions premium
- **Affiches** : A3, plastification, papier photo
- **Brochures** : Multi-pages, différentes reliures

### Calcul des Prix
- Prix de base par service
- Modificateurs selon les options
- Calcul automatique avec quantités
- Devis PDF générés automatiquement

### Chat Support
- Messages en temps réel simulés
- Historique des conversations
- Notifications non lues
- Interface intuitive

### Notifications
- Alertes sur changements d'état
- Système de badges
- Marquage lu/non lu
- Intégration avec les commandes

## 🔄 Simulation des Données

L'application utilise des données mockées pour simuler :
- Base de données des utilisateurs
- Commandes et historiques
- Messages de chat
- Notifications
- Statistiques admin

Les données sont stockées en mémoire et persistent durant la session.

## 📱 Responsive Design

- **Mobile First** : Optimisé pour smartphones
- **Breakpoints** : 
  - Mobile : < 768px
  - Tablet : 768px - 1024px  
  - Desktop : > 1024px
- **Navigation adaptative** : Menu burger sur mobile
- **Cartes flexibles** : S'adaptent à toutes les tailles

## 🎨 Design System

- **Couleurs** :
  - Primaire : Bleu (#3B82F6)
  - Succès : Vert (#10B981)
  - Warning : Orange (#F59E0B)
  - Erreur : Rouge (#EF4444)
- **Typography** : Hiérarchie claire avec Inter
- **Spacing** : Système 8px
- **Animations** : Transitions fluides
- **Shadows** : Profondeur moderne

## ⚡ Performance

- **Lazy Loading** : Routes et composants
- **Optimisations Vite** : Build ultra-rapide
- **State Management** : Zustand léger
- **Memoization** : Composants optimisés
- **Bundle Splitting** : Code splitting automatique

## 🔮 Extensions Possibles

- Intégration backend réel (Node.js, Python, etc.)
- Base de données (PostgreSQL, MongoDB)
- Paiements en ligne (Stripe, PayPal)
- Notifications push
- Email automatique
- Authentification OAuth
- API REST complète
- Tests unitaires et e2e
- Docker containerization
- Déploiement CI/CD

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**PrintPro** - Solution complète pour la gestion de services d'impression professionnelle.
