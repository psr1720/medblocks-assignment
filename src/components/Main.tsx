import { Outlet } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Topnav />
      <div className="flex flex-1 overflow-hidden">
        <Leftnav />
        <div className="flex-1 p-5 overflow-x-hidden overflow-y-auto bg-gray-10 ">
          <div className="mx-auto max-w-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
