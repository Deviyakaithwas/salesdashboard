import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodaysSales from './components/TodaysSales';
import SalesComparison from './components/SalesComparison';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodaysSales />} />
        <Route path="/comparison" element={<SalesComparison />} />
      </Routes>
    </Router>
  );
}

export default App;
