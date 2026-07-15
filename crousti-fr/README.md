# Crousti FR – Espace Créatrices 18+

Site vitrine de recrutement pour créatrices de contenu.

## Arborescence

```
crousti-fr/
├── index.html          ← Page principale (HTML)
├── css/
│   └── style.css       ← Tous les styles (variables, animations, sections)
├── js/
│   └── main.js         ← Logique JS (données, composants, formulaire, scroll reveal)
├── assets/
│   └── hero.jpg        ← Image héro (à ajouter manuellement)
└── README.md
```

## Déploiement sur GitHub Pages

1. Créer un dépôt GitHub (ex: `crousti-fr`)
2. Pousser ces fichiers à la racine du dépôt
3. Aller dans **Settings → Pages** et sélectionner la branche `main`
4. Le site sera accessible à `https://<ton-pseudo>.github.io/crousti-fr/`

## Image héro

Ajoute ton image sous `assets/hero.jpg` et mets à jour la référence dans `index.html` :

```html
<img src="assets/hero.jpg" alt="Crousti FR modèle" ... />
```

## Sections du site

- **Hero** – Accroche principale avec bandes colorées
- **Profils** – Sélecteur de segments (débutante, digitale, locale, senior, voyageuse)
- **Manifeste** – Texte de présentation de la marque
- **Process** – Les 6 étapes pour rejoindre Crousti FR
- **Garanties** – Les engagements de la plateforme
- **Témoignages** – Avis de créatrices
- **FAQ** – Questions fréquentes
- **Postuler** – Formulaire de candidature
