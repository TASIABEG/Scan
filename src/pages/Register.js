import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../api';
import IconCharacters from '../assets/register/Characters.png';
import IconForm from '../assets/register/FormIcon.png';
import GoogleIcon from '../assets/register/Google.png';
import FacebookIcon from '../assets/register/Facebook.png';
import YandexIcon from '../assets/register/Yandex.png';
import './Register.css';

function Register() {
  const [isLogin, setIsLogin] = useState(true); // Состояние для выбора формы
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const { login } = useAuth(); // Получаем метод login из контекста
  const location = useLocation();
  const navigate = useNavigate();

  // При изменении URL, синхронизируем состояние
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const loginState = searchParams.get("isLogin");
    if (loginState !== null) {
      setIsLogin(loginState === "true");
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let validationErrors = {};
    // Общая валидация для обеих форм
    if (!formData.login) {
      validationErrors.login = "Введите логин";
    }

    if (formData.password.length < 6) {
      validationErrors.password = "Пароль должен быть не менее 6 символов";
    }

    // Валидация только для регистрации
    if (!isLogin) {
      if (!formData.name) {
        validationErrors.name = "Введите имя";
      }

      if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = "Пароли не совпадают";
      }
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Вызов API для входа
        const credentials = {
          login: formData.login,
          password: formData.password
        };

        // Вызываем метод login из AuthContext
        await login(credentials);
        navigate("/search"); // Перенаправляем после успешного входа
    }
        else {
        console.log("Регистрация:", formData);
        alert("Регистрация прошла успешно! Теперь вы можете войти.");
        setIsLogin(true); // Переключаем на форму входа
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setErrors({
        submit: "Ошибка: " + (error.response?.data?.message || error.message)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    alert(`Переход в ${platform}`);
  };

  const handleButtonClick = (loginState) => {
    setIsLogin(loginState);
    navigate(`/register?isLogin=${loginState}`); // Используем navigate вместо history.push
  };

  return (
    <div className="registration">
      <div className="register-content">
        <div className="text-image">
          <h1>{isLogin ? "Для оформления подписки на тариф, необходимо авторизироваться." : "Для оформления подписки на тариф, необходимо зарегистрироваться."}</h1>
          <img src={IconCharacters} alt="Подписка" className="subscription-image" />
        </div>
        <div className="form-container">
          <img src={IconForm} alt="Иконка формы" className="form-image" />
          <div className="form-buttons">
            <button
              onClick={() => handleButtonClick(true)}
              className={`button ${isLogin ? 'active' : ''}`}
            >
              Войти
            </button>
            <button
              onClick={() => handleButtonClick(false)}
              className={`button ${!isLogin ? 'active' : ''}`}
            >
              Зарегистрироваться
            </button>
          </div>
          <form className="register" onSubmit={handleSubmit}>
            {!isLogin && (
              <label>
                Имя
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите имя"
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </label>
            )}
            <label>
              Логин
              <input
                type="text"
                name="login"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите e-mail"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </label>
            <label>
              Пароль
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите пароль"
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </label>
            {!isLogin && (
              <label>
                Подтвердите пароль
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Повторите пароль"
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </label>
            )}
            <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            >
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </button>

            {/* Добавляем отображение ошибок запроса */}
            {errors.submit && <p className="error">{errors.submit}</p>}

            {isLogin && (
              <p className="forgot-password">
                <a href="#" className="forgot-password-link">Восстановить пароль</a>
              </p>
            )}

            {isLogin && (
              <div className="login-methods">
                <span>Войти через:</span>
                <div className="social-buttons">
                  <img src={GoogleIcon} alt="Google" onClick={() => handleSocialLogin("Google")} className="social-icon" />
                  <img src={FacebookIcon} alt="Facebook" onClick={() => handleSocialLogin("Facebook")} className="social-icon" />
                  <img src={YandexIcon} alt="Yandex" onClick={() => handleSocialLogin("Яндекс")} className="social-icon" />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="register-methods">
                <span>Зарегистрироваться через:</span>
                <div className="social-buttons">
                  <img src={GoogleIcon} alt="Google" onClick={() => handleSocialLogin("Google")} className="social-icon" />
                  <img src={FacebookIcon} alt="Facebook" onClick={() => handleSocialLogin("Facebook")} className="social-icon" />
                  <img src={YandexIcon} alt="Yandex" onClick={() => handleSocialLogin("Яндекс")} className="social-icon" />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
