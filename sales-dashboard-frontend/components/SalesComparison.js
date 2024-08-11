import React, { useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { Line } from 'react-chartjs-2';
import { TextField, Button } from '@mui/material';

function SalesComparison() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [rowData, setRowData] = useState([]);
  const [productChartData, setProductChartData] = useState({});
  const [categoryChartData, setCategoryChartData] = useState({});

  const fetchComparisonData = () => {
    axios.post('http://localhost:5000/api/sales-comparison', { date1, date2 })
      .then(response => {
        const { date1Sales, date2Sales } = response.data;
        const productData = {
          labels: date1Sales.map(sale => sale.productName),
          datasets: [{
            label: `Sales Amount by Product on ${date1}`,
            data: date1Sales.map(sale => sale.salesAmount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }, {
            label: `Sales Amount by Product on ${date2}`,
            data: date2Sales.map(sale => sale.salesAmount),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          }]
        };
        setProductChartData(productData);

        const categoryData = {
          labels: [...new Set(date1Sales.map(sale => sale.category))],
          datasets: [{
            label: `Sales Amount by Category on ${date1}`,
            data: date1Sales.reduce((acc, sale) => {
              acc[sale.category] = (acc[sale.category] || 0) + sale.salesAmount;
              return acc;
            }, {}),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }, {
            label: `Sales Amount by Category on ${date2}`,
            data: date2Sales.reduce((acc, sale) => {
              acc[sale.category] = (acc[sale.category] || 0) + sale.salesAmount;
              return acc;
            }, {}),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          }]
        };
        setCategoryChartData(categoryData);

        const comparisonData = date1Sales.map((sale, index) => ({
          productName: sale.productName,
          category: sale.category,
          date1SalesAmount: sale.salesAmount,
          date2SalesAmount: date2Sales[index].salesAmount,
          difference: date2Sales[index].salesAmount - sale.salesAmount,
        }));
        setRowData(comparisonData);
      });
  };

  return (
    <div>
      <h1>Sales Comparison</h1>
      <div>
        <TextField type="date" label="Date 1" value={date1} onChange={(e) => setDate1(e.target.value)} />
        <TextField type="date" label="Date 2" value={date2} onChange={(e) => setDate2(e.target.value)} />
        <Button variant="contained" color="primary" onClick={fetchComparisonData}>Compare</Button>
      </div>
      <div>
        <Line data={productChartData} />
      </div>
      <div>
        <Line data={categoryChartData} />
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={[
            { headerName: 'Product Name', field: 'productName' },
            { headerName: 'Category', field: 'category' },
            { headerName: 'Date 1 Sales Amount', field: 'date1SalesAmount' },
            { headerName: 'Date 2 Sales Amount', field: 'date2SalesAmount' },
            { headerName: 'Difference', field: 'difference' }
          ]}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default SalesComparison;
