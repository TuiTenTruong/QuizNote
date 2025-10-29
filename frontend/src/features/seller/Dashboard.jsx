import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";



const Dashboard = () => {
    return <>
        <div className="d-flex">
            <Sidebar />
            <div className=" text-light min-vh-100 w-100">
                <Topbar />
                {<Outlet />}
            </div>
        </div>
    </>
}
export default Dashboard;