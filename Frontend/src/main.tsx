import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import { queryCLient } from "./config/queryClient.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryCLient}>
      <BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
