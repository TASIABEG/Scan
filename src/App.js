import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Tariffs from './pages/Tariffs';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import './App.css';
import Footer from './components/Footer';
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import SearchResultsPage from "./pages/Search-results";
import LoginForm from './components/LoginForm';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/tariffs" element={<Tariffs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/search-results" element={<SearchResultsPage />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
