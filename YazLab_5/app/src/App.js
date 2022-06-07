import React from "react";
import {LoginPage} from "./pages/LoginPage";
import {GraphPage, SearchPage, UserPage} from "./pages/UserPanel";
import {AdminPage, AddPublishmentPage} from "./pages/AdminPanel";
import { BrowserRouter, Routes, Route} from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/add_publishment" element={<AddPublishmentPage />} />
        <Route path="/user/search" element={<SearchPage />} />
        <Route path="/user/graph" element={<GraphPage/>} />
        <Route path="/user/graph/:id" element={<GraphPage/>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
