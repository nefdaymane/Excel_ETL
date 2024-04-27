// RouteExcel.js

const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('C:/Users/Hp/Desktop/EtlAutomatique/config/config.yml', 'utf8'));  // Assurez-vous de spécifier le chemin correct
const dynamicModel = require('../models/generateModel');  // Assurez-vous de spécifier le chemin correct
const excelController = require('../controllers/excelController');


router.post('/importer-excel', async (req, res) => {
    const nomFichierExcel = `C:/Users/Hp/Desktop/EtlAutomatique/resources/${config.excel.sheetName}.xlsx`;

    console.log("🚀 ~ file: RouteExcel.js:13 ~ router.post ~ config.excel.sheetName:", config.excel.sheetName)
    try {
        const resultat = await excelController.importerExcelEnMongoDB(nomFichierExcel, dynamicModel, config);
        res.send(resultat);
    } catch (erreur) {
        console.error('Erreur lors de la requête :', erreur);
        res.status(500).send('Erreur lors de l\'importation des données');
    }
});
router.get('/columns', excelController.getCollectionColumns);
router.get('/documents', excelController.getAllDocuments);

module.exports = router;
