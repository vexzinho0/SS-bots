import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

// Convex client opcional - não quebra se VITE_CONVEX_URL não estiver configurado
let convexClient = null;
try {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (convexUrl) {
    convexClient = new ConvexReactClient(convexUrl);
  }
} catch (e) {
  console.warn("[SS Bots] Convex não configurado. Alguns recursos podem não funcionar.");
}

function Root() {
  if (!convexClient) {
    return (
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ConvexProvider client={convexClient}>
          <App />
        </ConvexProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
