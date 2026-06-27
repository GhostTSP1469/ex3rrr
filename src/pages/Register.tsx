import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useRegisterMutation } from "../shared/api/storeApi";

// Сервер требует только: непустые поля и пароль от 4 символов.
function validate(
  userName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!userName.trim()) return "Введите имя пользователя";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Некорректный email";
  if (!phoneNumber.trim()) return "Введите номер телефона";
  if (password.length < 4) return "Пароль минимум 4 символа";
  if (password !== confirmPassword) return "Пароли не совпадают";
  return null;
}

type Strength = { level: 1 | 2 | 3; label: string; color: string };

// Индикатор надёжности — только подсказка, регистрацию не блокирует.
function passwordStrength(password: string): Strength | null {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Низкая", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Нормальная", color: "bg-amber-500" };
  return { level: 3, label: "Безопасная", color: "bg-green-500" };
}

export default function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [registerRequest, { isLoading }] = useRegisterMutation();

  const strength = passwordStrength(password);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate(userName, email, phoneNumber, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      await registerRequest({ userName, email, phoneNumber, password, confirmPassword }).unwrap();
      navigate("/login");
    } catch (err) {
      const failure = err as { status?: number; message?: string };
      setError(
        failure.status === 500
          ? "Пользователь с таким именем или почтой уже есть. Попробуй другие данные."
          : failure.message ?? "Не удалось зарегистрироваться",
      );
    }
  }

  return (
    <>
      <Header />

      <main className="auth-page">
        <form className="auth-card register-card" onSubmit={handleSubmit} data-aos="fade-up">
          <h1>Create an account</h1>
          <p>Enter your details below</p>

          <input
            className="plain-input"
            placeholder="Username (с ним будешь входить)"
            autoComplete="username"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
          <input
            className="plain-input"
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="plain-input"
            placeholder="Phone number"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
          <input
            className="plain-input"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {strength ? (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 flex-1 rounded ${
                      segment <= strength.level ? strength.color : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-(--muted)">Надёжность пароля: {strength.label}</span>
            </div>
          ) : null}

          <input
            className="plain-input"
            placeholder="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="primary-btn auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <button className="google-btn" type="button">
            <span>G</span>
            Sign up with Google
          </button>

          <p className="auth-switch">
            Already have account?
            <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>

      <Footer />
    </>
  );
}
