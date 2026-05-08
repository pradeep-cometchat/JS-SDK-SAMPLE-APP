import { ErrorBoundary } from '../../App';
import { Centered } from '../_helpers';

const Boom = () => { throw new Error('Component exploded'); };

export default {
  title: 'Web/Misc/Error Boundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Top-level React error boundary. When a child throws, shows the error message and a Try Again button.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Centered maxWidth={720}>
      <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
        <ErrorBoundary><Boom /></ErrorBoundary>
      </div>
    </Centered>
  ),
};

export const ErrorStateDisplay = Default;

export const HealthyChild = {
  render: () => (
    <Centered maxWidth={720}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
        <ErrorBoundary>
          <h3 style={{ margin: 0 }}>Everything is fine</h3>
          <p style={{ color: 'var(--text-muted)' }}>Nothing crashed, so the boundary is invisible.</p>
        </ErrorBoundary>
      </div>
    </Centered>
  ),
};

export const AllVariantsShowcase = Default;
