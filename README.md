# Labo Techno Cycle 4

Prototype d'idle game 2D original, pense comme un carnet d'atelier de technologie au cycle 4.

## Lancement

Ouvrir directement :

```txt
index.html
```

Aucun serveur, aucun port, aucun moteur 3D. Le projet utilise seulement HTML, CSS, JavaScript classique et des visuels 2D locaux.

## Deploiement GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` publie automatiquement le dossier complet sur GitHub Pages a chaque push sur `main`.

## Boucle De Jeu

- Creer un joueur et choisir le niveau 5e, 4e ou 3e avant le plateau.
- Une nouvelle sauvegarde demarre avec eleves, pieces, mentors, fiches, savoir-faire et modules a zero.
- Commencer par former la premiere equipe d'eleves.
- La salle de classe est le plateau central : chaque eleve recrute prend une place.
- Les pieces et kits stockes apparaissent dans la salle, sur les tables ou dans les zones techniques.
- Mobiliser ensuite d'autres eleves ou mentors selon les besoins.
- Activer et ameliorer des stations : capteurs, energie, donnees, zone prototype.
- Produire des fiches d'atelier et du savoir-faire.
- Gerer motivation et agitation.
- Resoudre des pop-ups de situations-problemes adaptees au niveau choisi.
- Couvrir IA, energie, programmation Scratch, moyens de locomotion, chaine d'energie et chaine d'information.
- Chaque theme dispose de 120 defis par niveau, avec plusieurs formats : choix cible, vrai/faux, ordre logique, classement, diagnostic, decision, mots a attraper, mots croises, mots fleches, associations, dossiers a trier, schemas interactifs, debug Scratch, variables, mini-enquetes et comparateurs.
- Chaque reponse affiche un retour vrai/faux, un feedback et un point de cours avant de continuer.
- Les boutons indisponibles restent cliquables pour expliquer ce qu'il manque au joueur.
- Les actions d'atelier ont un delai entre deux utilisations pour eviter le spam.
- Une action ludique coute plus de ressources, donne un gros gain de savoir-faire, mais augmente fortement l'agitation.
- Gagner des jetons savoir et les investir dans des protocoles : demarche de projet, reparabilite, donnees, energie, impact environnemental.
- Suivre le parcours du labo jusqu'a l'Expo Techno finale.
- Perdre si l'agitation atteint 100 %.

## Organisation

```txt
index.html          Entree ouvrable directement
css/                Interface carnet d'atelier
js2d/app.js         Idle game complet et scene de classe 2D
js2d/challenges.js  Banque locale de defis par theme et par niveau
assets/idle/icons/  Icones 2D locales
assets/home/        Image d'accueil generee pour le jeu
assets/students/    Sprite sheet et eleves decoupes avec generate2dsprite
```
