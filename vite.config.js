const staticPageRoutes = new Set([
  '/philosophy/',
  '/trauma-therapy-bc/',
  '/sex-therapy-bc/',
  '/couples-therapy-bc/',
  '/emdr-therapy-bc/',
  '/low-cost-counselling-bc/',
  '/depression-counselling-bc/',
  '/anxiety-counselling-bc/'
]);

export default {
  plugins: [
    {
      name: 'unravel-static-page-routes',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const pathname = request.url?.split('?')[0];
          if (pathname && staticPageRoutes.has(pathname)) {
            request.url = `${pathname}index.html`;
          }
          next();
        });
      }
    }
  ]
};
