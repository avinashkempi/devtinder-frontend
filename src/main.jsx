import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </Provider>
);
