const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Otras configuraciones de Webpack...
  plugins: [
    // Otros plugins...
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === 'https://apipwa-courses.up.railway.app', // Cambia esto si tu API está en otro dominio
          handler: 'NetworkFirst', // Intenta obtener de la red primero, pero usa el caché si no hay conexión.
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50, // Número máximo de entradas en caché
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
            networkTimeoutSeconds: 10, // Tiempo límite antes de usar el caché
          },
        },
        {
          urlPattern: /\.(?:js|css|html|png|jpg|svg)$/, // Archivos estáticos
          handler: 'CacheFirst', // Usa el caché primero para los recursos estáticos.
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
            },
          },
        },
      ],
    }),
  ],
};
