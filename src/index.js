import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./features/store/store";
import { Products } from "./components/products/Products";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Products />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
