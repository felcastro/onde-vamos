import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-scroll mx-2 mt-2">
          <Home />
          <ToastContainer />
        </div>
        <Navigation />
      </div>
    </QueryClientProvider>
  );
}
