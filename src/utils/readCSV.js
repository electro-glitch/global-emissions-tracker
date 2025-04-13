import Papa from "papaparse";

export const loadCSV = async (fileName) => {
  return new Promise((resolve, reject) => {
    Papa.parse(`${process.env.PUBLIC_URL}/data/${fileName}`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (error) => reject(error),
    });
  });
};
