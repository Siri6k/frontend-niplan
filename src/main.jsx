import "./index.css"; // <-- obligatoire pour charger Tailwind
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Vite PWA auto-inject gère ça, mais vous pouvez vérifier :
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.ready.then((registration) => {
      console.log("SW ready:", registration.scope);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
