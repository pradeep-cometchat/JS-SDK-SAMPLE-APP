import { useState, useRef, useEffect } from 'react';
import { LoginScreen } from '../../../App';
import { MobileFrame } from '../../_helpers';

export default {
  title: 'App Screens/Mobile/Login Screen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Login screen inside a 390×740 mobile viewport. The sample-user grid wraps into 2 columns on narrow widths.',
      },
    },
  },
};

const SignedIn = ({ user, onReset }) => (
  <div style={{ padding: 24, textAlign: 'center', fontFamily: 'var(--font)' }}>
    <h3>Signed in as {user.name}</h3>
    <button className="btn-ghost" onClick={onReset} style={{ marginTop: 12 }}>Sign out</button>
  </div>
);

const SignInPreview = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  return (
    <MobileFrame>
      {loggedIn
        ? <SignedIn user={loggedIn} onReset={() => setLoggedIn(null)} />
        : <LoginScreen onLogin={setLoggedIn} />}
    </MobileFrame>
  );
};

export const Default = {
  render: () => <SignInPreview />,
};

export const SignIn = Default;

/**
 * Scoped + passive auto-click:
 * - Only touch the iframe inside our own container via ref.
 * - Fire after two animation frames so Storybook's Docs page has settled,
 *   which stops it from scroll-jumping to this story on open.
 */
const AppCredentialsPreview = () => {
  const ref = useRef(null);
  useEffect(() => {
    let raf1, raf2, cancelled = false;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const doc = ref.current?.querySelector('iframe[title="mobile-preview"]')?.contentDocument;
        const link = doc?.querySelector('.login-footer-link span[style*="color"]');
        link?.click();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);
  return (
    <div ref={ref}>
      <MobileFrame>
        <LoginScreen onLogin={() => {}} />
      </MobileFrame>
    </div>
  );
};

export const AppCredentials = {
  render: () => <AppCredentialsPreview />,
};
