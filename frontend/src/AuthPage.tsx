import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AuthPage.less';
import { loginApi, registerApi } from './api';

export default function AuthPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: SyntheticEvent<HTMLFormElement, SubmitEvent>
    ) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!isLogin && pass !== confirm) {
                throw new Error('Пароли не совпадают');
            }
            if (pass.length < 6) {
                throw new Error('Пароль минимум 6 символов');
            }

            const data = isLogin
                ? await loginApi(login, pass)
                : await registerApi(login, pass);

            if (isLogin) {
                localStorage.setItem(
                    'token',
                    (data as { access_token: string }).access_token
                );
                navigate('/');
            } else {
                alert('Регистрация успешна! Теперь войдите.');
                setIsLogin(true);
                setPass('');
                setConfirm('');
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Произошла неизвестная ошибка'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="page-bg" />
            <div className="auth-card">
                <h2 className="auth-title">
                    {isLogin ? 'Вход' : 'Регистрация'}
                </h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="input-field"
                        required
                        minLength={6}
                    />
                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="input-field"
                            required
                            minLength={6}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading
                            ? 'Загрузка...'
                            : isLogin
                              ? 'Войти'
                              : 'Зарегистрироваться'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="switch-link"
                >
                    {isLogin
                        ? 'Нет аккаунта? Регистрация'
                        : 'Уже есть аккаунт? Вход'}
                </button>
            </div>
        </div>
    );
}
