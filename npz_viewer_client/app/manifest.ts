import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NPZ Viewer - Interactive Visualization for NumPy Arrays',
    short_name: 'NPZ Viewer',
    description: 'A modern web tool for visualizing and exploring .npy and .npz files with 3D plots, machine learning integration, and data analysis features.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}