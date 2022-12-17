import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.js";
import { SocketProvider } from "./WebSocket";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <SocketProvider>
        <Router>
          <App />
        </Router>
      </SocketProvider>
    </Provider>
  </ErrorBoundary>
);
