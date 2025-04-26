# Pokemon Trainer - Frontend

Bienvenue dans mon projet **Pokemon Trainer**, réalisé pour le cours de **Technologie Web** à l'**ECE Paris**.

---

## 🌟 Fonctionnalités principales

- **Connexion / Authentification** :
  - Formulaire de connexion (login)
  - Authentification JWT (token stocké localement)
  - Accès restreint à certaines actions pour les utilisateurs connectés

- **Affichage de la liste des Pokémon** :
  - Chargement dynamique des Pokémon depuis une API Express.js (backend)
  - Filtres disponibles :
    - Recherche par nom
    - Filtres par type (ex: Eau, Feu, Plante, etc.)
    - Filtrage par HP minimum, Attaque minimum, Défense minimum, Vitesse minimum

- **Affichage détaillé d'un Pokémon** :
  - Affichage complet des stats du Pokémon en cliquant dessus

- **Ajout d'un nouveau Pokémon** (protégé par login) :
  - Formulaire pour créer un nouveau Pokémon
  - Champs obligatoires : ID, Nom (anglais), Types, HP, Attaque, Défense, Vitesse, URL image

- **Suppression d'un Pokémon** (protégé par login) :
  - Supprimer un Pokémon directement depuis la liste

- **Gestion de l'affichage et design** :
  - Filtres de types par boutons colorés
  - Interface responsive et fluide

---

## 🛠️ Instructions d'installation

1. **Cloner le dépôt GitHub** :

```bash
git clone https://github.com/zkerkeb-class/pokedex-starter-SeynabouS.git
cd pokedex-starter-SeynabouS
```

2. **Installer les dépendances** :

```bash
npm install
```

3. **Configurer les variables d'environnement** :

Créez un fichier `.env` à la racine avec :

```
VITE_API_URL=http://localhost:3000
```

4. **Démarrer l'application en mode développement** :

```bash
npm run dev
```

Le projet sera disponible ici :

➡️ http://localhost:5173

---

## 📚 Documentation rapide de l'API backend

- `POST /api/login` : connexion d'un utilisateur
- `POST /api/register` : création d'un utilisateur
- `GET /api/pokemons` : récupération de tous les Pokémon
- `GET /api/pokemons/:id` : récupération d'un Pokémon précis
- `POST /api/pokemons` : ajout d'un Pokémon (authentification requise)
- `DELETE /api/pokemons/:id` : suppression d'un Pokémon (authentification requise)

> Voir aussi la documentation Swagger à : http://localhost:3000/api-docs

---

## 🎥 Vidéo de démonstration

🔗 [Découvrir la vidéo de présentation YouTube](https://www.youtube.com/watch?v=AcGhi0nzOQ0)

Contenu de la démonstration :
- Connexion / Authentification
- Ajout d'un Pokémon
- Suppression d'un Pokémon
- Filtres et affichage détaillé
- Points techniques expliqués

---

## 📚 Technologies utilisées

- **React.js** avec **Vite**
- **Axios** pour les requêtes HTTP
- **React Router** pour la navigation
- **CSS** personnalisé
- **JWT** pour la gestion de l'authentification

---

✨ Merci d'avoir consulté mon projet ✨

> Réalisé par **Seynabou S.**

