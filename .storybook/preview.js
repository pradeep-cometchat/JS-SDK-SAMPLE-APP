import '../src/index.css';
import '../src/app.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Auto-expand the source-code block on the Docs tab so the JSX is visible
    // without a click. On the Canvas tab, the `<>` Show code button still works.
    docs: {
      source: { state: 'open' },
      toc: true,
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#e8ecf1' },
        { name: 'surface', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
    // Centered layout by default — stories render in the middle of the preview canvas.
    // Individual stories can still override with `parameters: { layout: 'fullscreen' }`.
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Overview',
          'Web',
          ['Screens', 'Sidebar', 'Chat Panel', 'Messages', 'Overlays', 'Primitives'],
          'Mobile',
          ['Screens', 'Sidebar', 'Chat Panel', 'Messages', 'Overlays'],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'CometChat theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', ctx.globals.theme || 'light');
      }
      return Story();
    },
  ],
};

export default preview;
