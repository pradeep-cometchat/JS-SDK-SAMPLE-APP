import { useState, useRef, useEffect } from 'react';
import { LoginScreen } from '../../../App';
import { Centered } from '../../_helpers';

export default {
  title: 'App Screens/Web/Login Screen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The sign-in / app credentials entry point. Users pick a sample user from the grid, type a UID / username, or flip to the App Credentials form (Region + App ID + Auth Key). Both views live in the same component, toggled by an internal `showCredentials` state.',
      },
    },
  },
};

/**
 * Desktop stage. No fixed height — the stage grows to fit the login card so
 * there's never an internal scrollbar and the whole card is visible at once.
 * We also neutralize the app-wide `.login-screen { min-height: 100vh }` that
 * would otherwise force the card off the bottom of the Docs page.
 */
const DesktopStage = ({ children }) => (
  <Centered maxWidth={960} padding={24}>
    <style>{`
      .login-stage .login-screen {
        min-height: auto !important;
        height: auto !important;
        padding: 32px 24px !important;
      }
    `}</style>
    <div
      className="login-stage"
      style={{
        width: '100%',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </Centered>
);

const SignInPreview = () => {
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
};

export const Default = { render: () => <SignInPreview /> };
export const SignIn = Default;

/**
 * Scoped + passive auto-click:
 * - Query our own container via `ref` so we never touch other stories on Docs.
 * - Fire after two animation frames so the browser has finished its initial
 *   layout, which stops Storybook's Docs page from jumping to this story.
 */
const AppCredentialsPreview = () => {
  const ref = useRef(null);
  useEffect(() => {
    let raf1, raf2, cancelled = false;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const link = ref.current?.querySelector('.login-footer-link span[style*="color"]');
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
      <DesktopStage>
        <LoginScreen onLogin={() => {}} />
      </DesktopStage>
    </div>
  );
};

export const AppCredentials = {
  render: () => <AppCredentialsPreview />,
  parameters: { docs: { description: { story: 'App Credentials view — Region selector + App ID + Auth Key.' } } },
};
