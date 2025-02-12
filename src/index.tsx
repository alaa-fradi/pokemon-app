import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import pokemonBall from './assets/pokemonBall.jpg';  // Import the image

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const ChangeFavicon = () => {
  useEffect(() => {
    const createRoundFavicon = (imageUrl: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        const size = 64;  // Set size of the favicon
        canvas.width = size;
        canvas.height = size;
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);

        // Create base64 string
        const roundFavicon = canvas.toDataURL('image/png');
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = roundFavicon;
        }
      };
      img.src = imageUrl;
    };

    createRoundFavicon(pokemonBall);
  }, []);

  return null;
};

root.render(
  <ApolloProvider client={client}>
    <ChangeFavicon />
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
