import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { EyeIcon } from "../components/Icons";
import { useLoginMutation } from "../shared/api/storeApi";
import { getRoleFromToken, isAdminRole } from "../shared/auth/jwt";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loginRequest, { isLoading }] = useLoginMutation();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const response = await loginRequest({ userName: userName.trim(), password }).unwrap();
      const tokenValue = response.data; // response.data — это JWT-токен
      login(tokenValue);
      // админа сразу в админ-панель, обычного юзера — в личный кабинет
      navigate(isAdminRole(getRoleFromToken(tokenValue)) ? "/admin" : "/account");
    } catch (err) {
      setError((err as { message?: string }).message ?? "Не удалось войти");
    }
  }

  return (
    <>
      <Header />

      <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Log in to Exclusive</h1>
          <p>Войди по имени пользователя (не email)</p>

          <label className="field-box">
            <span>Username</span>
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Имя пользователя из регистрации"
              autoComplete="username"
            />
          </label>

          <label className="field-box password-box">
            <span>Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Show password"
            >
              <EyeIcon />
            </button>
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <Link to="/login" className="forgot-link">
            Forget Password?
          </Link>

          <button className="primary-btn auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}
