import React from 'react';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Welcome to Shlok Marathon Fair</div>} />
    </Routes>
  );
};

export default App;
