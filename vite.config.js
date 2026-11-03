import { fileURLToPath } from 'node:url';
import { routingMiddleware } from './scripts/preview-routing.mjs';

export default {
  appType: 'mpa',
  plugins: [{
    name: 'unravel-static-page-routes',
    configureServer(server) {
      server.middlewares.use(routingMiddleware({ publicRoot: fileURLToPath(new URL('./public/', import.meta.url)) }));
    },
    configurePreviewServer(server) {
      server.middlewares.use(routingMiddleware({ publicRoot: fileURLToPath(new URL('./dist/', import.meta.url)) }));
    }
  }]
};
