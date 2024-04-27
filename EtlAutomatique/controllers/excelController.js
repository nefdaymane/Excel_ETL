const xlsx = require('xlsx');
const dynamicModel = require('../models/generateModel');

const getAllDocuments = async (req, res) => {
  try {
    const documents = await dynamicModel.find({});
    res.status(200).json(documents);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
};



const getCollectionColumns = async (req, res) => {
  try {
    const allColumns = Object.keys(dynamicModel.schema.paths);


    const excludedColumns = ['_id', 'createdAt', 'updatedAt', '__v'];


    const columns = allColumns.filter(column => !excludedColumns.includes(column));
    res.status(200).json(columns);
  } catch (error) {
    console.error('Erreur lors de la récupération des colonnes de la collection :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des colonnes de la collection' });
  }
};

async function importerExcelEnMongoDB(nomFichier, model, config) {
  console.log("🚀 ~ file: excelController.js:4 ~ importerExcelEnMongoDB ~ nomFichier:", nomFichier)
  try {
    // Extraction
    const fichier = xlsx.readFile(nomFichier);
    const nomFeuille = fichier.SheetNames[0]; // Supposons que les données sont dans la première feuille
    const feuilleDeCalcul = xlsx.utils.sheet_to_json(fichier.Sheets[nomFeuille]);


    const nomsColonnesDB = Object.keys(dynamicModel.schema.paths);
    console.log("🚀 ~ file: excelController.js:12 ~ importerExcelEnMongoDB ~ nomsColonnesDB:", nomsColonnesDB)

    //transformation
    const donneesTransformees = feuilleDeCalcul.map((ligne) => {
      const ligneTransformee = {};

      // Alignez l'ordre des colonnes selon le modèle MongoDB
      nomsColonnesDB.forEach((nomColonne) => {
        const valeurExcel = ligne[nomColonne];
        const valeurParDefautConfig = config.excel.defaultValue[nomColonne];

        ligneTransformee[nomColonne] = nettoyerChamp(valeurExcel, valeurParDefautConfig);
      });

      return ligneTransformee;
    });

    // Loading
    const resultat = await model.create(donneesTransformees);
    console.log("🚀 ~ file: excelController.js:30 ~ importerExcelEnMongoDB ~ donneesTransformees:", donneesTransformees)

    return resultat;
  } catch (erreur) {
    console.error('Erreur lors du processus ETL :', erreur);
    throw erreur;
  }
}

// nettoyage
function nettoyerChamp(valeur, valeurParDefaut) {
  return valeur !== null && valeur !== undefined && valeur !== '' ? valeur : valeurParDefaut;
}

module.exports = {
  importerExcelEnMongoDB,
  getCollectionColumns,
  getAllDocuments
};
