import { useState } from "react"
import axios from "axios"

const API = "https://ai-chatapp-z17a.onrender.com"

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const res = await axios.post(`${API}${endpoint}`, { email, password })
      localStorage.setItem("token", res.data.token)
      onLogin()
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0b0b12] text-white">
      <div className="bg-white/5 p-8 rounded-2xl w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-cyan-400 text-center">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 px-4 py-2 rounded-xl outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 px-4 py-2 rounded-xl outline-none"
        />

        <button
          onClick={handleSubmit}
          className="bg-cyan-500 hover:bg-cyan-400 py-2 rounded-xl font-medium transition-all"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center text-white/40 text-sm cursor-pointer hover:text-white/70"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  )
}

export default Auth