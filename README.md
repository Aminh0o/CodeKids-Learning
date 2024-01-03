Salam 3likoum.

Pour que le projet marche :
- Install Node.js : https://nodejs.org/en
- importer le projet sur votre PC 
- import le fichier avec VS-Code
- dans package.json ajouter et remplacer "scripts"
    par : "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
                "eject": "react-scripts eject"
            },
- supprimer :
    pachage-lock.json
    yarn-lock...
- dir : npm install
- dir : npm run dev
