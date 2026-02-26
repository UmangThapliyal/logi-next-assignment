const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found",
  className = "",
}) => {
  const columnCount = columns.length || 1;

  const getCellValue = (column, row, rowIndex) =>
    typeof column.render === "function"
      ? column.render(row, rowIndex)
      : (row?.[column.accessor] ?? "-");

  return (
    <table className={className} style={{ width: "100%" }}>
      <thead>
        <tr>
          {columns.length === 0 && <th>Data</th>}
          {columns.map((column) => (
            <th key={column.key ?? column.accessor}>{column.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columnCount}>Loading...</td>
          </tr>
        ) : data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.length === 0 && <td>{JSON.stringify(row)}</td>}
              {columns.map((column) => (
                <td key={column.key ?? column.accessor}>
                  {getCellValue(column, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columnCount}>{emptyMessage}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
