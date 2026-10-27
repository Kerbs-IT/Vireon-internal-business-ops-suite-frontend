import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Topbar(){
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogout() {
        await auth?.logout();
        navigate("/login");
    }

    return (

        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
            <span className="text-sm text-slate-500">
                {auth?.user?.department?.name ?? "No department"}
            </span>
            <div className="flex items-center gap-3">
                <div className="user-info flex flex-col">
                    <span className="text-sm font-medium text-slate-800">
                        {auth?.user?.first_name} {auth?.user?.last_name}
                    </span>
                    <span className="text-xs text-slate-400">
                        {auth?.user?.role?.name}
                    </span>
                </div>
               
                <button
                onClick={handleLogout}
                className="text-sm text-white bg-red-500 py-1 px-5 rounded font-bold hover:cursor-pointer hover:bg-red-600"
                >
                Logout
                </button>
            </div>
        </header>
    )
}