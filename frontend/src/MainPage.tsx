import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainPage.less';
import {
    type Tournament,
    applyToTournamentApi,
    getTournamentsApi,
    updateUserProfileApi,
} from './api';

export default function MainPage() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    // Состояние профиля
    const [gameName, setGameName] = useState('');
    const [thLevel, setThLevel] = useState<number | ''>('');
    const [savingProfile, setSavingProfile] = useState(false);

    // Загрузка данных при входе
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        // тестовые данные
        setGameName('PlayerOne');
        setThLevel(14);

        // Загружаем турниры
        getTournamentsApi()
            .then((data) => setTournaments(data))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const handleApply = async (id: number) => {
        if (!gameName || !thLevel) {
            alert('Сначала заполните профиль (Имя в игре и Уровень ратуши)!');
            return;
        }
        const res = await applyToTournamentApi(id);
        if (res.success) {
            alert('Заявка успешно отправлена!');
        }
    };

    const handleSaveProfile = async () => {
        if (!gameName || !thLevel) {
            return;
        }

        setSavingProfile(true);
        await updateUserProfileApi(gameName, Number(thLevel));
        setSavingProfile(false);
        alert('Профиль сохранен');
    };

    if (loading) {
        return <div className="loader">Загрузка...</div>;
    }

    return (
        <div className="main-container">
            {/* Шапка */}
            <header className="main-header">
                <h1>🏆 Мои Турниры</h1>
                <button className="btn-logout" onClick={handleLogout}>
                    Выйти
                </button>
            </header>

            <div className="main-content">
                {/* Профиль игрока */}
                <section className="card profile-card">
                    <h2>👤 Мой Профиль</h2>
                    <p className="subtitle">
                        Для участия в турнирах заполните игровые данные.
                    </p>

                    <div className="profile-form">
                        <div className="form-group">
                            <label>Игровое имя (Ник)</label>
                            <input
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                                placeholder="Например: ProPlayer123"
                            />
                        </div>
                        <div className="form-group">
                            <label>Уровень ратуши (TH)</label>
                            <input
                                type="number"
                                value={thLevel}
                                onChange={(e) =>
                                    setThLevel(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : ''
                                    )
                                }
                                placeholder="1-16"
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                        >
                            {savingProfile
                                ? 'Сохранение...'
                                : 'Сохранить профиль'}
                        </button>
                    </div>
                </section>

                {/* Список турниров */}
                <section className="tournaments-section">
                    <h2>Доступные турниры</h2>

                    <div className="tournaments-grid">
                        {tournaments.map((t) => (
                            <div
                                key={t.id}
                                className={`tournament-card status-${t.status}`}
                            >
                                <div className="t-header">
                                    <span className={`badge ${t.status}`}>
                                        {t.status === 'registration' && 'Набор'}
                                        {t.status === 'active' && 'Идет битва'}
                                        {t.status === 'finished' && 'Завершен'}
                                    </span>
                                    <h3>{t.name}</h3>
                                </div>

                                <div className="t-details">
                                    <p>
                                        📅 {t.startDate} — {t.endDate}
                                    </p>
                                    <p>
                                        👥 Участники: {t.currentParticipants} /{' '}
                                        {t.maxParticipants}
                                    </p>
                                </div>

                                <div className="t-footer">
                                    {t.status === 'registration' ? (
                                        <button
                                            className="btn-apply"
                                            onClick={() => handleApply(t.id)}
                                            disabled={!gameName || !thLevel}
                                        >
                                            Подать заявку
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-disabled"
                                            disabled
                                        >
                                            {t.status === 'active'
                                                ? 'Турнир идет'
                                                : 'Архив'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
