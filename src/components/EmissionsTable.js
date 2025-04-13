const EmissionsTable = ({ data }) => {
    return (
      <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Emissions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.year}</td>
              <td>{entry.emissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default EmissionsTable;
  