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
    docs: {
      // Auto-expand the source block on the Docs page so the JSX shows without
      // clicking 'Show code'. On the Canvas tab the '<>' toggle still works.
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
    // Stories render centered by default. Individual stories can still override
    // with `parameters: { layout: 'fullscreen' }` (used by anything wrapped in
    // Centered/DesktopSidebarFrame/DesktopChatFrame/MobileFrame helpers).
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Overview',
          'Base Elements',
          ['Avatar', 'Button', 'File Icon', 'Icons', 'Input', 'Status Dot', '*'],
          'App Screens',
          ['Web', 'Mobile'],
          'Web',
          ['Conversations', 'Messages', 'Bubbles', 'Users', 'Groups', 'Calls', 'Misc'],
          'Mobile',
          ['Conversations', 'Messages', 'Bubbles', 'Users', 'Groups', 'Calls', 'Misc'],
        ],
      },
    },
  },
  // Global autodocs: every component title automatically gets a Docs page.
  tags: ['autodocs'],
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
