import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import DefaultLayout from './layout/DefaultLayout';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];

    page.default.layout = name !== 'Login' && name !== 'Register' 
      ? (page) => <DefaultLayout>{page}</DefaultLayout> 
      : undefined;

    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
