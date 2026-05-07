import { useState, useEffect } from 'react';
import { LoginScreen } from '../../App';
import { Centered } from '../_helpers';

export default {
  title: 'Web/Screens/LoginScreen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The auth screen. Users pick a sample user or type a UID/username. The App Credentials view (Region + App ID + Auth Key) lives in the same component and is toggled internally.',
      },
    },
  },
};

const DesktopStage = ({ children, height = 780 }) => (
  <Centered maxWidth={900} padding={24}>
    <div style={{ width: '100%', height, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
      {children}
    </div>
  </Centered>
);

export const SignIn = {
  render: () => {
    const [loggedIn, setLoggedIn] = useState(null);
    return (
      <DesktopStage>
        {loggedIn ? (
          <div style={{ padding: 40, textAlign: 'center', fontFamily: 'var(--font)' }}>
            <h3>Signed in as {loggedIn.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{loggedIn.username}</p>
            <button className="btn-ghost" onClick={() => setLoggedIn(null)} style={{ marginTop: 16 }}>Sign out</button>
          </div>
        ) : (
          <LoginScreen onLogin={setLoggedIn} />
        )}
      </DesktopStage>
    );
  },
};

const OpenCredentials = () => {
  useEffect(() => {
    const id = setTimeout(() => {
      const link = document.querySelector('.login-footer-link span[style*="color"]');
      link?.click();
    }, 30);
    return () => clearTimeout(id);
  }, []);
  return <LoginScreen onLogin={() => {}} />;
};

export const AppCredentials = {
  render: () => <DesktopStage><OpenCredentials /></DesktopStage>,
};
