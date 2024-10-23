import React from "react";
import { Route, Routes } from "react-router-dom";
import ShelterLayout from "../layouts/ShelterLayout";
import Dashboard from "../pages/shelter/Dashboard";
import Pet from "../pages/shelter/Pet";
import PrivateRoute from "./PrivateRoute";
import PetDetail from "../pages/shelter/PetDetail";
import Adoption from "../pages/shelter/AdoptionForm";
import CreatePet from "../pages/shelter/CreatePet";
const ShelterRoutes = () => {
  return (
    <Routes>
      <Route element={<ShelterLayout />}>
        <Route
          path="dashboard"
          element={
            <PrivateRoute
              element={<Dashboard />}
              allowedRoles={["ShelterStaff"]}
            />
          }
        />
        <Route
          path="pets"
          element={
            <PrivateRoute element={<Pet />} allowedRoles={["ShelterStaff"]} />
          }
        />
        <Route
          path="pet/:id"
          element={
            <PrivateRoute
              element={<PetDetail />}
              allowedRoles={["ShelterStaff"]}
            />
          }
        />
        <Route
          path="Adoptions"
          element={
            <PrivateRoute
              element={<Adoption />}
              allowedRoles={["ShelterStaff"]}
            />
          }
        />
        <Route
          path="pets/create"
          element={
            <PrivateRoute
              element={<CreatePet />}
              allowedRoles={["ShelterStaff"]}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default ShelterRoutes;
