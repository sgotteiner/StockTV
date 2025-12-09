import React from 'react'; // Removed useState
import { useNavigation } from '../context/NavigationContext';
import AppHeader from './AppHeader';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import '../App.css';

/**
 * TabNavigator Component
 * Manages navigation between different app sections (Feed and Profile)
 */
function TabNavigator() {
  const { activeTab, setActiveTab } = useNavigation();

  /**
   * Renders the appropriate screen based on the active tab
   * @returns {JSX.Element} The component for the active tab
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <FeedScreen />; // Default to feed
    }
  };

  return (
    <div className="tab-navigator">
      {/* Header removed as per request */}

      <div className="tab-content">
        {renderContent()}
      </div>

      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          Feed
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>
    </div>
  );
}

export default TabNavigator;