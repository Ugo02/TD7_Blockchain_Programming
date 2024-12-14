import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ChainInfo from './ChainInfo';
import ErrorPage from './ErrorPage';
import FakeBayc from './FakeBayc';
import FakeBaycToken from './FakeBaycToken';
import FakeNefturians from './FakeNefturians';
import FakeNefturiansUser from './FakeNefturiansUser';
import FakeMeebits from './FakeMeebits';

function App() {
  return (
    <div className="App">
      {/* Navigation bar at the top */}
      <header className="App-header">
        <nav>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/chain-info" className="nav-link">Chain Info</Link></li>
            <li><Link to="/fakeBayc" className="nav-link">Fake Bayc</Link></li>
            <li><Link to="/fakeNefturians" className="nav-link">Fake Nefturians</Link></li>
            <li><Link to="/FakeMeebits" className="nav-link">Fake Meebits</Link></li>
          </ul>
        </nav>
      </header>

      {/* Content below the navigation bar */}
      <div className="App-content">
        <Routes>
          <Route path="/" element={<h1>Welcome to the ERC721-ux app!</h1>} />
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/fakeBayc" element={<FakeBayc />} />
          <Route path="/fakeBayc/:tokenId" element={<FakeBaycToken />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} />
          <Route path="/fakeNefturians/:userAddress" element={<FakeNefturiansUser />} />
          <Route path="/FakeMeebits" element={<FakeMeebits />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
