import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthPage from './AuthPage';
import MainPage from './MainPage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
}
