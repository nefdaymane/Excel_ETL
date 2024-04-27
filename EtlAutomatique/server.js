const mongoose = require('mongoose');
const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())

// Charger la configuration depuis le fichier YAML
const configFile = 'C:/Users/Hp/Desktop/EtlAutomatique/config/config.yml';  // Assurez-vous de remplacer par votre chemin réel
const config = yaml.load(fs.readFileSync(configFile, 'utf8'));

// Charger le modèle dynamique
const dynamicModel = require('./models/generateModel');

const dynamicRoute = require(`./routes/RouteExcel`);
app.use(`/api/v1/collection`, dynamicRoute);

// Établir la connexion à la base de données
mongoose.connect('mongodb://127.0.0.1/ExcelEtl')
    .then(async () => {
        // Vérifier si la collection existe déjà
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(collection => collection.name === dynamicModel.collection.name);

        if (!collectionExists) {
            // Si la collection n'existe pas, créez-la
            await dynamicModel.createIndexes();
            console.log(`Collection '${dynamicModel.collection.name}' créée avec succès.`);
        } else {
            console.log(`La collection '${dynamicModel.collection.name}' existe déjà.`);
        }

        app.listen(5000, () => {
            console.log('Server has started!');
        });
    })
    .catch((err) => {
        console.error('Erreur lors de la connexion à la base de données:', err);
    });