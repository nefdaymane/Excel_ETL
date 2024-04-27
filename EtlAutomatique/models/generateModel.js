// generateModel.js

const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs = require('fs');

// Charger la configuration depuis le fichier YAML
const configFile = 'C:/Users/Hp/Desktop/EtlAutomatique/config/config.yml';
const config = yaml.load(fs.readFileSync(configFile, 'utf8'));

// Créer dynamiquement le schéma MongoDB
const schemaDefinition = {};
config.database.attributes.forEach(attribute => {
    schemaDefinition[attribute.name] = {
        type: attribute.type,
        default: attribute.type === 'Date' ? Date.now : undefined,
    };
});

// Créer dynamiquement le modèle MongoDB
const dynamicSchema = new mongoose.Schema(schemaDefinition);

// Créer dynamiquement le modèle MongoDB en minuscules
const dynamicModel = mongoose.model(config.database.model.toLowerCase(), dynamicSchema);

module.exports = dynamicModel;
