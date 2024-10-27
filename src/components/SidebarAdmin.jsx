import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
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

  const activeLink =
    "flex items-center gap-1 pl-4 pt-3 pb-2.5 rounded-lg text-black font-bold m-2";
  const normalLink =
    "flex items-center gap-1 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:text-black m-2";

  const links = [
    {
      title: username || t("sidebar.main"),
      links: [
        {
          name: "dashboard",
          icon: <MDBIcon icon="chart-line" />,
          label: t("sidebar.dashboard"),
        },
        {
          name: "users",
          icon: <MDBIcon icon="users" />,
          label: t("sidebar.users"),
        },
        {
          name: "shelter",
          icon: <MDBIcon icon="home" />,
          label: t("sidebar.shelter"),
        },
        {
          name: "roles",
          icon: <MDBIcon icon="user-tag" />,
          label: t("sidebar.roles"),
        },
      ],
    },
  ];

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/admin/dashboard"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-black text-slate-900"
            >
              <MDBIcon icon="shield-alt" />
              <span>{t("sidebar.adminPanel")}</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              title={t("sidebar.menu")}
            >
              <MDBIcon icon="times" />
            </button>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {t("sidebar.welcome")}: {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/admin/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize ml-3">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-15">
            <button
              onClick={handleLogout}
              className={`${normalLink} text-Grey-600 hover:text-red-800`}
            >
              <MDBIcon icon="sign-out-alt" />
              <span className="capitalize ml-3">{t("sidebar.logout")}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarAdmin;
