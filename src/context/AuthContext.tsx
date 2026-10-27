
import { createContext, useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: { id: number, name: string };
    department: { id: number, name: string };
    position: string;
    date_hired: string;
    status: "active" | "inactive";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    loading: Boolean;
    logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // true until we've checked

    useEffect(() => {
        async function restoreSession() {
        const savedToken = localStorage.getItem("token");

        if (!savedToken) {
            setLoading(false); // nothing to check, stop loading immediately
            return;
        }

        try {
            const response = await api.get("/me");
            setUser(response.data);
        } catch (err) {
            // token exists but is invalid/expired — clear it
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
        }

        restoreSession();
    }, []); // empty array = run once, on mount only


    async function login(email:string,password:string) {
        const response = await api.post("/login", { email, password });
        const { user, token } = response.data;

        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);

        navigate("/dashboard");
    }

    // lets create the logout
    async function logout() {
        await api.post("/logout");
        // remove the token and the state of variable 
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user,token,login,logout,loading }}>
        {children}
        </AuthContext.Provider>)
}