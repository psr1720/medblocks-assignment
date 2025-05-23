import { Database, FileUser, LayoutDashboard, PersonStanding, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

const Leftnav = () => {
  const navOptions = [
    { logo: <LayoutDashboard />, text: "Dashboard", to: "/" },
    { logo: <PersonStanding />, text: "Patients", to: "/patients" },
    { logo: <Plus />, text: "Register Patient", to: "/register-patient" },
    { logo: <FileUser />, text: "View Patient", to: "/view-patient" },
    { logo: <Database/>, text: "Run Queries", to: "/run-queries"}
  ];
  const active = "text-blue-600 border-r-3 border-blue-600 bg-blue-100";
  const inactive =
    "text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:border-r-3";
  return (
    <div className="flex flex-col w-48 border-r border-gray-200 overflow-y-auto pt-4 bg-white space-y-1">
      {navOptions.map((option, index) => (
        <NavLink
          to={option.to}
          key={index}
          className={({ isActive }) =>
            `flex items-center px-5 py-3 text-sm font-medium rounded-md ${
              isActive ? active : inactive
            }`
          }
        >
          <span className="mr-3 text-primary-600">{option.logo}</span>
          <span className="text-primary-600">{option.text}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Leftnav;
