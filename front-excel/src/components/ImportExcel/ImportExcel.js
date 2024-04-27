import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { importFichierExcel, getAllColumns } from '../../services/ExcelService';
import "./ImportExcel.css";
import Swal from 'sweetalert2';

function ImportExcel() {
  const [collectionColumns, setCollectionColumns] = useState([]);
  const [excelColumns, setExcelColumns] = useState([]);
  const [data, setData] = useState([]);
  

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains column headers
      const importedColumns = excelData[0];
      console.log("🚀 ~ file: ImportExcel.js:26 ~ handleImportExcel ~ importedColumns:", importedColumns)
      const importedData = excelData.slice(1);
      console.log("🚀 ~ file: ImportExcel.js:28 ~ handleImportExcel ~ importedData:", importedData)

      setExcelColumns(importedColumns);
      setData(importedData);
    };

    reader.readAsBinaryString(file);
  };

  const isOrderValid = () => {
    // Vérifiez si l'ordre actuel des colonnes Excel correspond à l'ordre des colonnes de la collection
    return JSON.stringify(excelColumns) === JSON.stringify(collectionColumns);
  };



  const handleSave = () => {
    if (isOrderValid()) {
        // Seulement sauvegarder si l'ordre est valide
        importFichierExcel(data)
            .then(() => {
                console.log('Data saved successfully!');

                // Utiliser SweetAlert pour afficher une alerte de succès
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data saved successfully!',
                });
            })
            .catch((error) => {
                console.error('Error saving data:', error);
                // Utiliser SweetAlert pour afficher une alerte d'erreur
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error saving data',
                });
            });
    } else {
        console.log('Invalid order. Please arrange the columns correctly.');
        // Utiliser SweetAlert pour afficher une alerte d'avertissement
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Order',
            text: 'Please arrange the columns correctly.',
        });
    }
};

  const fetchCollectionColumns = () => {
    // Fetch columns from the collection
    getAllColumns()
      .then((columns) => {
        setCollectionColumns(columns);
      })
      .catch((error) => {
        console.error('Error fetching columns:', error);
      });
  };



  const moveColumn = (currentIndex, targetIndex) => {
    if (currentIndex !== targetIndex) {
      const updatedColumns = [...excelColumns];
      const updatedData = [...data];

      // Mettez à jour l'ordre des colonnes
      const selectedColumn = updatedColumns[currentIndex];
      updatedColumns.splice(currentIndex, 1);
      updatedColumns.splice(targetIndex, 0, selectedColumn);

      // Mettez à jour l'ordre des données
      updatedData.forEach((row) => {
        const temp = row[currentIndex];
        row[currentIndex] = row[targetIndex];
        row[targetIndex] = temp;
      });

      setExcelColumns(updatedColumns);
      setData(updatedData);
    }
  };






  useEffect(() => {
    fetchCollectionColumns();
  }, []); // Fetch collection columns on component mount

  // ... (autres parties du composant)

  return (
    <div className="container">
      <div className="file-input-container">
        <span>Choisir un fichier</span>
        <input type="file" className="file-input" accept=".xlsx, .xls" onChange={handleImportExcel} />
      </div>
      <div className="columns-container">
        <div>
          <h3 className='text-collection'>Collection Columns:</h3>
          <ul className="columns-list">
            {collectionColumns.map((column, index) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Excel Columns:</h3>
          <ul className="columns-list">
            {excelColumns.map((column, index) => (
              <li key={index}>
                {column}
                {isOrderValid() ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                ) : (
                  <FontAwesomeIcon icon={faTimesCircle} color="red" />
                )}
                <button onClick={() => moveColumn(index, index - 1)} disabled={index === 0}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button onClick={() => moveColumn(index, index + 1)} disabled={index === excelColumns.length - 1}>
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3>Data:</h3>
        <table className="data-table">
          <thead>
            <tr>
              {excelColumns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="save-button" onClick={handleSave} disabled={!isOrderValid()}>
          Save
        </button>
        {isOrderValid() ? (
          <p style={{ color: 'green' }}>Order is valid - Save enabled</p>
        ) : (
          <p style={{ color: 'red' }}>Order is invalid - Save disabled</p>
        )}
      </div>
    </div>
  );

}

export default ImportExcel;
