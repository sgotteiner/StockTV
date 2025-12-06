import React from 'react';
import { UserProvider } from './context/UserProvider';
import TabNavigator from './components/TabNavigator';
import './styles/genericStyles.css';
import './styles/feedStyles.css';
import './styles/videoStyles.css';
import './styles/tabNavigatorStyles.css';
import './styles/profileStyles.css';

/**
 * Main App Component
 * Entry point for the application, sets up user context and tab navigation
 */
function App() {
  return (
    <UserProvider>
      <div className="App">
        <main>
          <TabNavigator />
        </main>
      </div>
    </UserProvider>
  );
}

export default App;