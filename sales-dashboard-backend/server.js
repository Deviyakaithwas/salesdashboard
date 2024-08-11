const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Mock data for today's sales
const salesData = [
  { id: 1, productName: 'Product A', category: 'Category 1', quantitySold: 20, salesAmount: 200 },
  { id: 2, productName: 'Product B', category: 'Category 2', quantitySold: 30, salesAmount: 300 },
  { id: 3, productName: 'Product C', category: 'Category 3'},


  // Add more mock data as needed
];

// Endpoint to get today's sales
app.get('/api/todays-sales', (req, res) => {

  res.json(salesData);
});

// Endpoint to get sales data between two dates
app.post('/api/sales-comparison', (req, res) => {
  const { date1, date2 } = req.body;
  // Implement logic to fetch sales data between date1 and date2
  // For now, return an empty array
  
  // You would typically fetch this data from a database based on the dates.
  res.json({
    
    date1Sales: salesData,
    date2Sales: salesData.map(sale => ({ ...sale, quantitySold: sale.quantitySold + 10, salesAmount: sale.salesAmount + 100 })),
  });
});

app.listen(port, () => {

  console.log(`Server running at http://localhost:${port}`);
});
