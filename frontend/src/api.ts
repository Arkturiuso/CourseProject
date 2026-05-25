const API = 'http://localhost:8000/api';

export async function loginApi(login: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ detail: 'Ошибка сервера' }));
        throw new Error(err.detail || 'Неверный логин или пароль');
    }
    return res.json();
}

export async function registerApi(login: string, password: string) {
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ detail: 'Ошибка сервера' }));
        throw new Error(err.detail || 'Не удалось зарегистрироваться');
    }
    return res.json();
}

// Типы для турнира
export type Tournament = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: 'registration' | 'active' | 'finished';
    maxParticipants: number;
    currentParticipants: number;
};

// Заглушки для тестов интерфейса
const mockTournaments: Tournament[] = [
    {
        id: 1,
        name: 'Clash Pro League S1',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        status: 'registration',
        maxParticipants: 32,
        currentParticipants: 12,
    },
    {
        id: 2,
        name: 'TH12 Masters Cup',
        startDate: '2026-05-20',
        endDate: '2026-05-22',
        status: 'active',
        maxParticipants: 16,
        currentParticipants: 16,
    },
    {
        id: 3,
        name: 'Novice Friendly',
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        status: 'finished',
        maxParticipants: 64,
        currentParticipants: 40,
    },
];

export async function getTournamentsApi(): Promise<Tournament[]> {
    await new Promise((res) => setTimeout(res, 500));
    return mockTournaments;
}

export async function applyToTournamentApi(id: number) {
    console.warn(`Заявка отправлена на турнир #${id}`);
    await new Promise((res) => setTimeout(res, 500));
    return { success: true };
}

// Профиль
export async function updateUserProfileApi(gameName: string, thLevel: number) {
    console.warn(`Обновлен профиль: ${gameName}, TH${thLevel}`);
    await new Promise((res) => setTimeout(res, 300));
    return { success: true };
}
