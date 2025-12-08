import React from 'react';
import { useUser } from '../context/UserProvider';
import '../App.css';

function AppHeader() {
  const { currentUser, isAuthenticated } = useUser();

  return (
    <header className="App-header">
      <div className="header-content">
        <h1>StockTV</h1>
      </div>
    </header>
  );
}

export default AppHeader;