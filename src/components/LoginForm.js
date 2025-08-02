import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/account/login', {
                login: login,
                password: password
            });

            // Сохраняем токен через контекст
            authLogin({
                accessToken: data.accessToken,
                expire: data.expire,
                user: data.user // Предполагая, что сервер возвращает информацию о пользователе
            });

            navigate('/'); // Перенаправляем на главную страницу

        } catch (err) {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Логин"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
            />
            {error && <div className="error">{error}</div>}
            <button type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;