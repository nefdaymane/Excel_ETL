import Axios from "./AxiosConfig";

export const importFichierExcel = async (fileData) => {
    try {
      const response = await Axios.post('/importer-excel', fileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


export const getAllColumns = async (columns) => {
    try {
        const response = await Axios.get('/columns', columns);
        return response.data;
    } catch (error) {
        throw error;
        
    }
}
