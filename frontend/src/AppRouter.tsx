import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthPage from './AuthPage';
import MainPage from './MainPage';

export default function AppRouter() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
}
