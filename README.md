<p align="center">
  <img src="./public/img/logo.svg" alt="Memories of Ghibli Logo" width="220" />
</p>

<h1 align="center">Memories of Ghibli</h1>

<p align="center">
  Un jeu de mémoire immersif en 3D, plongé dans l'univers des films de Hayao Miyazaki.
</p>

---

## 🌿 Concept

Memories of Ghibli est une expérience interactive qui vous plonge dans une scène 3D inspirée des univers Ghibli. Des objets iconiques des films de Miyazaki sont cachés dans le monde — à vous de les trouver, d'identifier le film auquel ils appartiennent, et de collecter leurs anecdotes pour restaurer la mémoire perdue.

Le jeu est pensé comme une déambulation paisible : on explore, on clique, on se souvient.

---

## 🎮 Parcours joueur

1. **Création du profil** — le joueur choisit un avatar parmi 8 et se donne un pseudo.
2. **Exploration** — la scène 3D est librement parcourue à la souris. Des objets 3D se révèlent au survol.
3. **Quiz** — cliquer un objet ouvre une question : dans lequel de ces films cet objet est-il présent ?
4. **Anecdote** — une bonne réponse débloque une anecdote sur le film, avec son affiche, sa note et un lien vers sa bande-annonce (via l'API TMDB).
5. **Trophée** — chaque souvenir retrouvé incrémente le score et déclenche une notification toast.
6. **Paliers** — tous les X souvenirs, une récompense se débloque et l'expérience s'enrichit.

---

## 🏆 Système de paliers & Gamification

La progression récompense concrètement le joueur à chaque étape :

| Palier | Souvenirs | Récompense |
|--------|-----------|------------|
| <img src="./public/avatar/avatar-1.svg" width="28" /> | 5 | Choix de la musique d'ambiance |
| <img src="./public/avatar/avatar-2.svg" width="28" /> | 10 | Changement d'avatar |
| <img src="./public/avatar/avatar-3.svg" width="28" /> | 15 | Titre / badge affiché sous le pseudo |
| <img src="./public/avatar/avatar-4.svg" width="28" /> | 20 | Thème visuel de l'interface |
| ✨ | 32 | Écran de félicitations — mémoire entièrement restaurée |

---

## 🎧 Sound Design

L'ambiance sonore fait partie de l'expérience :

- **Playlist Ghibli** — 11 pistes de Joe Hisaishi jouées en fond, avec transition en fondu entre les morceaux.
- **Sons de feedback** — un son distinct pour les bonnes et mauvaises réponses.
- **Son de trophée** — déclenché à chaque souvenir retrouvé.
- **Contrôle total** — le bouton volume en haut à gauche coupe ou réactive tous les sons d'un clic.

Titres disponibles : *Ghibli Mix, A Journey, Bygone Days, Day of the River, Heartbroken, Kiki's Theme, Princess Mononoké, The Flower Garden, The Path of the Wind, The Promise of the World, To Ursula's Cabin.*

---

## 🌍 Construction de la scène 3D

La scène a été entièrement conçue sur Three.js :

- **Herbe procédurale** — 100 000 brins instanciés en un seul appel GPU grâce au *GPU Instancing*, avec des shaders personnalisés pour simuler le mouvement et la profondeur.
- **BVH (Bounding Volume Hierarchy)** — accélère le placement des brins au chargement.
- **Objets interactifs** — 32 modèles `.glb` placés dans la scène, détectés via un Raycaster Three.js.
- **Ciel, eau, brouillard, montagne** — chaque élément est un module indépendant.
- **Animations** — certains modèles sont animés (Warawara, avion…).

---

## 🏗️ Architecture technique

```
Navigateur (Three.js + Vite)
        │
        ├── Raycaster → détecte le clic sur un objet 3D
        │
        ├── models.js → catalogue des 32 objets (quiz, anecdotes, film TMDB ID)
        │
        ├── tmdb.js → appel API The Movie Database (poster, note, trailer, synopsis)
        │
        └── localStorage → persistance de la progression
                ├── miyaza_username
                ├── miyaza_score
                ├── miyaza_foundObjects
                ├── miyaza_avatar
                ├── miyaza_badge
                ├── miyaza_track (musique)
                ├── miyaza_theme
                └── miyaza_milestonesShown
```

> ⚙️ Un système d'authentification JWT et une base de données sont présents dans la codebase (branche commentée). Ils pourront être réintégrés lors d'un déploiement futur avec back-end dédié.

---

## 💻 Stack technique

| Outil | Usage |
|-------|-------|
| **Three.js** | Moteur 3D, scène, Raycaster, shaders |
| **Vite** | Bundler & serveur de développement |
| **GSAP** | Animations de caméra |
| **three-mesh-bvh** | Optimisation du placement de l'herbe |
| **API TMDB** | Données des films (poster, note, trailer) |
| **Vanilla JS (ES Modules)** | Logique de jeu, HUD, progression |
| **Figma** | Maquettes UI/UX |
| **Notion + Git** | Organisation et gestion de version |

---

## 📂 Arborescence du projet

```
miyazaki-three/
├── public/
│   ├── models/          → 32 objets 3D (.glb) + décors
│   ├── img/quiz/        → visuels des objets pour le quiz
│   ├── avatar/          → 8 avatars joueur (.svg)
│   ├── sound/music/     → 11 pistes audio Ghibli
│   ├── textures/        → skybox + herbe
│   └── fonts/
├── src/
│   ├── auth/            → profil joueur (pseudo, avatar)
│   ├── controls/        → caméra, zoom, rotation, souris
│   ├── data/            → models.js, films.js, progression.js, milestones.js
│   ├── hud/             → HUD.js, quiz.js, settings.js, milestone.js
│   ├── models/          → chargement des modèles 3D
│   ├── scene/           → setup, lumières, brouillard
│   ├── state/           → gameState.js
│   ├── utils/           → son, animations, raycaster utils
│   ├── world/           → herbe, eau, ciel, arbres, montagne
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Lancer le projet

```bash
# Cloner le repo
git clone https://github.com/[votre-repo]/miyazaki-three.git
cd miyazaki-three

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# → Renseigner VITE_TMDB_API_KEY avec votre clé TMDB

# Lancer en développement
npm run dev

# Build de production
npm run build
```

---

## 👥 Équipe

| Membre | Rôle |
|--------|------|
| **Guillaume** | Scène 3D, modèles, environnement, optimisation shaders |
| **Karen** | Optimisation GPU (instancing, BVH), performance |
| **Ramy** | Interface, HUD, système de paliers, intégration API |
| **Nassim** | Expérience de jeu, interactions, données |
