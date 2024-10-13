// src/routes/AdminRoutes.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ShelterLayout from "../layouts/ShelterLayout";
import Dashboard from "../pages/shelter/Dashboard";
import PrivateRoute from "./PrivateRoute";

const ShelterRoutes = () => {
  return (
    <Routes>
      <Route element={<ShelterLayout />}>
        <Route
          path="shelter/dashboard"
          element={
            <PrivateRoute
              element={<Dashboard />}
              allowedRoles={["ShelterStaff"]}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default ShelterRoutes;
