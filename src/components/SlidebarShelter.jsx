import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";

const SidebarShelter = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(true);
  const [username, setUsername] = useState("");
  const [shelterID, setShelterID] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedShelterID = localStorage.getItem("shelterID");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedShelterID) {
      setShelterID(storedShelterID);
    }
  }, []);

  const handleCloseSideBar = () => {
    if (window.innerWidth <= 900) {
      setActiveMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const normalLink = "flex items-center gap-1 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:text-black m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/shelter/dashboard"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-black text-slate-900"
            >
              <MDBIcon icon="home" /> <span>Shelter Panel</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              title="Menu"
            >
              <MDBIcon icon="times" />
            </button>
          </div>
          <div className="mt-10">
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              Welcome: {username}
            </p>
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              Shelter ID: {shelterID}
            </p>
          </div>
          <div className="mt-10">
            <NavLink
              to="/shelter/dashboard"
              onClick={handleCloseSideBar}
              className={({ isActive }) => (isActive ? `${normalLink} font-bold` : normalLink)}
            >
              <MDBIcon icon="tachometer-alt" />
              <span className="capitalize ml-3">Dashboard</span>
            </NavLink>
          </div>
          <div className="mt-15">
            <button
              onClick={handleLogout}
              className={`${normalLink} text-Grey-600 hover:text-red-800`}
            >
              <MDBIcon icon="sign-out-alt" />
              <span className="capitalize ml-3">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarShelter;
