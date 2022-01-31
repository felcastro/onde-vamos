import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative h-full flex flex-col">
        <div className="flex-1 overflow-y-scroll mx-2">
          <Home />
        </div>
        <Navigation />
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={true}
          rtl={false}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </div>
    </QueryClientProvider>
  );
}
