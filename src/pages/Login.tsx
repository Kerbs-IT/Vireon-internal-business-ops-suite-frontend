import React, { useContext, useState } from "react";
import { Mail, Lock, Sunrise, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: true,
  });

  const handleChange =
    (field: keyof LoginFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "rememberMe" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await auth?.login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-rose-200 via-orange-100 to-indigo-200">
        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-md">
            <Sunrise className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="font-semibold text-slate-800 text-lg">
            Sunrise Studio
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 max-w-sm">
          <p className="font-serif italic text-2xl leading-snug text-rose-900/80">
            "The way to get started is to quit talking and begin doing."
          </p>
          <p className="mt-3 text-sm text-rose-900/60">— Walt Disney</p>
        </div>

        {/* Footer note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500/70">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Enterprise-grade security. SOC 2 Type II certified.</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-1xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 mb-0 text-sm text-slate-500">
            Sign in to your workspace
          </p>
          {error && <p className="text-sm text-center text-red-500 mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-3 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-start text-xs font-medium text-slate-700 mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="ana@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-start text-xs font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  required
                />
              </div>
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange("rememberMe")}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-300"
                />
                Remember me
              </label>
              <a
                href="#"
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg mb-5 bg-gradient-to-r from-rose-500 to-orange-400 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Need help? Contact{" "}
            <a href="#" className="font-medium text-orange-500">
              IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;