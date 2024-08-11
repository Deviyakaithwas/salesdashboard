import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { Line } from 'react-charts-2';

function TodaysSales() {
  const [rowData, setRowData] = useState([]);
  const [productChartData, setProductChartData] = useState({});
  const [categoryChartData, setCategoryChartData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/todays-sales')
      .then(response => {
        setRowData(response.data);
        const productData = {
          labels: response.data.map(sale => sale.productName),
          datasets: [{
            label: 'Sales Amount by Product',
            data: response.data.map(sale => sale.salesAmount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }]
        };
        setProductChartData(productData);

        const categoryData = {
          labels: [...new Set(response.data.map(sale => sale.category))],
          datasets: [{
            label: 'Sales Amount by Category',
            data: response.data.reduce((acc, sale) => {
              acc[sale.category] = (acc[sale.category] || 0) + sale.salesAmount;
              return acc;
            }, {}),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          }]
        };
        setCategoryChartData(categoryData);
      });
  }, []);

  return (
    <div>
      <h1>Today's Sales</h1>
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
            { headerName: 'Quantity Sold', field: 'quantitySold' },
            { headerName: 'Sales Amount', field: 'salesAmount' }
          ]}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default TodaysSales;
