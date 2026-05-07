import { useState, useEffect } from 'react';
import { LoginScreen } from '../../App';
import { MobileFrame } from '../_helpers';

export default {
  title: 'Mobile/Screens/LoginScreen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Login screen rendered inside a 390×740 mobile viewport. The sample-user grid wraps into 2 columns on narrow widths.',
      },
    },
  },
};

export const SignIn = {
  render: () => {
    const [loggedIn, setLoggedIn] = useState(null);
    return (
      <MobileFrame>
        {loggedIn ? (
          <div style={{ padding: 24, textAlign: 'center', fontFamily: 'var(--font)' }}>
            <h3>Signed in as {loggedIn.name}</h3>
            <button className="btn-ghost" onClick={() => setLoggedIn(null)} style={{ marginTop: 12 }}>Sign out</button>
          </div>
        ) : (
          <LoginScreen onLogin={setLoggedIn} />
        )}
      </MobileFrame>
    );
  },
};

const OpenCredentials = () => {
  useEffect(() => {
    const id = setTimeout(() => {
      const doc = document.querySelector('iframe[title="mobile-preview"]')?.contentDocument;
      const link = doc?.querySelector('.login-footer-link span[style*="color"]');
      link?.click();
    }, 100);
    return () => clearTimeout(id);
  }, []);
  return <LoginScreen onLogin={() => {}} />;
};

export const AppCredentials = {
  render: () => <MobileFrame><OpenCredentials /></MobileFrame>,
};
