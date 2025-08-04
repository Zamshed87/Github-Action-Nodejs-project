import React, { useEffect, useState } from "react";
import "./markdownDiagramPreview.css"

type ResultItem = Record<string, string | number | null | undefined>;

interface ApiResponse {
 message: {
   results: ResultItem[];
 }
}

function JsonPreview({ message }: ApiResponse) {
  console.log(message, "message in json preview");
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [columnTotals, setColumnTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const allKeys = new Set<string>();
    message.results.forEach((item: any) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    const columnList = Array.from(allKeys);
    setColumns(columnList);

    const rowList = message.results.map((item) =>
      columnList.map((col) => item[col] ?? "")
    );
    setRows(rowList);

    // Calculate totals for numeric columns
    const totals: Record<string, number> = {};
    columnList.forEach((col) => {
      const numericValues = message.results
        .map((item) => item[col])
        .filter((val): val is number => typeof val === 'number' && !isNaN(val));
      
      if (numericValues.length > 0) {
        totals[col] = numericValues.reduce((sum, val) => sum + val, 0);
      }
    });
    setColumnTotals(totals);
  }, [message.results]);

  return (
    <div className="ai-chatbot-markdown-body">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {
                rows?.length >1 && <th style={{ width: '50px' }}>SL</th>
              }
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowValues: any, idx) => (
              <tr key={idx}>
                {rows?.length > 1 && <td>{idx + 1}</td>}
                {rowValues.map((val: any, colIdx: any) => (
                  <td key={colIdx}>{val}</td>
                ))}
              </tr>
            ))}
            {/* Total row - only show if there are numeric columns */}
            {Object.keys(columnTotals).length > 0 && (
             <>
              <tr style={{ fontWeight: 'bold', borderTop: '2px solid #ddd' }}>
                {rows?.length > 1 && <td>Total</td>}
                {columns.map((col) => (
                  <td key={`total-${col}`}>
                    {columnTotals[col] !== undefined ? columnTotals[col] : ''}
                  </td>
                ))}
              </tr></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JsonPreview;