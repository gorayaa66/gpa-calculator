import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Landing from './layout/Landing';
import Footer from './layout/Footer';

function App() {
  return (
    <Router>
      <div className='App'>
        <div style={{ minHeight: '88vh' }}>
          <Landing />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
