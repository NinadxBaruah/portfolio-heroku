// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 4321,
//     strictPort:true
//   }
// })

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 4321,
//     host: '0.0.0.0', // This will make the server accessible on your local network
//     cors: true,
//     proxy: {
//       '/api': {
//         target: `http://localhost:3000`, // Replace with your backend URL
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/projects/chat-app/api': 'https://ninadbaruah.me',
      '/auth': 'https://ninadbaruah.me'
    }
  }
});