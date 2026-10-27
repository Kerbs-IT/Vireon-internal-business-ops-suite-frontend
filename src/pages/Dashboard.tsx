import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Calendar, CircleAlert, FolderKanban, Users2 } from "lucide-react";

interface statCard{
    icon: React.ReactNode;
    label: string;
    value?: number;
    color: string;
}

const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
};

const statItems: statCard[] = [
    {
        icon: <Calendar />, label:'Pending Leave', value:0, color:'orange'
    },
    {
        icon: <CircleAlert />, label:'Overdue Task', value:2, color:'orange'
    },
    {
        icon: <FolderKanban />, label:'Active Projects', value:0, color:'blue'
    },
    {
        icon: <Users2/>, label:'Team Members', value:2,color:'green'
    }
]


function Dashboard() {
    const auth = useContext(AuthContext);
    const userName = auth?.user ? (`${auth?.user?.first_name} ${auth?.user?.last_name.charAt(0)}.`) : 'Guest';
    
    // console.log(auth.user);
    return (
        <>
            <div className="page flex flex-1 flex-col">
                <div className="top-part bg-linear-to-r from-orange-100 to-blue-100 p-4 rounded-2xl mb-3">
                    <h3 className="font-bold  italic text-orange-800">Good morning</h3>
                    <h1 className="font-bold text-2xl 3xl">{userName}</h1>
                    <p className="text-gray-500 font-sm">You have (3) pending works and 2 tasks due today.</p>
                </div>
                <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  xl:grid-cols-4 gap-3">
                    {
                        statItems.map((item) => (
                            <div className="stat-item-con shadow bg-white p-4 rounded-2xl">
                                <div className={`icon inline-block ${colorMap[item.color]} p-2 rounded-lg`}>
                                    {item.icon}
                                </div>
                                
                                <h2 className="font-bold text-2xl">{item.value}</h2>
                                <h4 className="text-gray-400 font-sm ">{item.label }</h4>
                            </div>

                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard;