const TableThree = ({ tableData, columns }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        {(!tableData || tableData.length === 0) ? (
          <p className="py-5 text-center text-gray-500 dark:text-gray-400">No data available</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, key) => (
                <tr key={key}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                    >
                      {column.render ? column.render(item) : item[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TableThree;
