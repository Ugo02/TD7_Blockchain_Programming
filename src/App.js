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
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chain-info">Chain Info</Link>
            </li>
            <li>
              <Link to="/fakeBayc">Fake Bayc</Link> {/* Lien vers la page FakeBayc */}
            </li>
            <li>
              <Link to="/fakeNefturians">Fake Nefturians</Link> {/* Lien vers la page FakeNefturians */}
            </li>
            <li>
              <Link to="/FakeMeebits">Fake Meebits</Link> {/* Lien vers la page FakeNefturians */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/fakeBayc" element={<FakeBayc />} /> 
          <Route path="/fakeBayc/:tokenId" element={<FakeBaycToken />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} /> 
          <Route path="/fakeNefturians/:userAddress" element={<FakeNefturiansUser />} />
          <Route path="/FakeMeebits" element={<FakeMeebits />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
