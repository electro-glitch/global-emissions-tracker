export const COUCHDB_URL = "http://127.0.0.1:5984/emissions_db"; // Update if needed

export const fetchEmissionsData = async () => {
  try {
    const response = await fetch("http://localhost:5984/emissions_db/_all_docs?include_docs=true"); // Change "emissions_db" to your actual DB name
    const data = await response.json();

    if (!data.rows) {
      throw new Error("Invalid data format received");
    }

    return data.rows.map((row) => row.doc); // Extract docs from CouchDB response
  } catch (error) {
    console.error("Error fetching data from CouchDB:", error);
    return [];
  }
};

