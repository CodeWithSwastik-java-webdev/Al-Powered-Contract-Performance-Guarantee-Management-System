import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './app/router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
const queryClient = new QueryClient();
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(ThemeProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }) }) }) }));
}
export default App;
