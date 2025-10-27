import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") navigate("/main");
  }, [navigate]);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const validate = (isRegister) => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email є обов’язковим";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Некоректний формат email";

    if (!formData.password) newErrors.password = "Пароль є обов’язковим";
    else if (formData.password.length < 6)
      newErrors.password = "Мінімум 6 символів";

    if (isRegister && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Паролі не співпадають";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate(false)) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (
      storedUser &&
      formData.email === storedUser.email &&
      formData.password === storedUser.password
    ) {
      dispatch(login(storedUser));
      localStorage.setItem("loggedIn", "true");
      navigate("/main");
    } else {
      setErrors({ login: "Неправильний email або пароль" });
    }
  };


  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate(true)) return;

    const newUser = {
      email: formData.email,
      password: formData.password,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    alert("Реєстрація успішна! Тепер увійдіть у систему.");
    setFormData({ email: "", password: "", confirmPassword: "" });
    setIsLoginMode(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          {isLoginMode ? "Вхід у систему" : "Реєстрація"}
        </h1>

        <form
          onSubmit={isLoginMode ? handleLogin : handleRegister}
          className="space-y-5"
        >
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Введіть email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Введіть пароль"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Підтвердження пароля — лише при реєстрації */}
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Підтвердіть пароль:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Повторіть пароль"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Помилка логіну */}
          {errors.login && (
            <p className="text-red-600 text-center font-medium">
              {errors.login}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            {isLoginMode ? "Увійти" : "Зареєструватися"}
          </button>
        </form>

        {/* Кнопка перемикання */}
        <p className="text-center mt-4 text-gray-700">
          {isLoginMode ? (
            <>
              Не маєте акаунту?{" "}
              <button
                onClick={() => setIsLoginMode(false)}
                className="text-blue-600 hover:underline font-medium"
              >
                Зареєструватися
              </button>
            </>
          ) : (
            <>
              Вже маєте акаунт?{" "}
              <button
                onClick={() => setIsLoginMode(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                Увійти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default HomePage;