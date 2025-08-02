import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import Loader from './Loader';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: transparent;
    width: 98%;
    max-width: 100%;
    height: 93px;
    margin: 0 auto;
    position: relative;
`;

const Logo = styled.img`
    height: 141px;
    width: 141px;
`;

const Menu = styled.nav`
    display: flex;
    gap: 80px;
`;

const MenuLink = styled.a`
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    letter-spacing: 0.01em;
    color: #000000;
    text-decoration: none;
`;

const RightMenu = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
`;

const RegisterLink = styled.a`
    width: 146px;
    height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    letter-spacing: 0.01em;
    text-align: left;
    background: transparent;
    color: rgba(0, 0, 0, 0.4);
    text-decoration: none;
    cursor: pointer;
    &:hover {
        color: #029491;
    }
`;

const Rectangle7 = styled.div`
    width: 2px;
    height: 26px;
    background: #029491;
    opacity: 0.6;
    margin-right: 30px;
`;

const LoginLink = styled.a`
    width: 43px;
    height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: 0.01em;
    text-align: left;
    background: transparent;
    position: relative;
    z-index: 1;
    cursor: pointer;
    color: ${props => (props.$active ? '#029491' : 'rgba(0, 0, 0, 0.4)')};
    &:hover {
        color: #029491;
    }
`;

const Rectangle6 = styled.div`
    width: 65px;
    height: 26px;
    background: #7CE3E1;
    border-radius: 5px;
    position: absolute;
    top: -22%;
    left: 79%;
    z-index: 0;
    margin-top: 5px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const UserName = styled.span`
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
`;

const LogoutButton = styled.button`
    background: transparent;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #029491;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const LimitPanel = styled.div`
    width: 175px;
    height: 63px;
    position: absolute;
    top: -15px;
    left: -400px;
    background: #F0F0F0;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
`;

const LimitText = styled.span`
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #000000;
    line-height: 1.2;
`;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(false);

    // Получаем все необходимые данные из контекста аутентификации
    const {
        user,
        isAuthenticated,
        logout,
        isLoading: authLoading
    } = useAuth();

    // Извлекаем данные о лимитах из информации о пользователе
    const eventFiltersInfo = user?.eventFiltersInfo || {};
    const usedCompanies = eventFiltersInfo.usedCompanyCount;
    const companyLimit = eventFiltersInfo.companyLimit;

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isLoginParam = searchParams.get('isLogin');
        setIsLogin(isLoginParam === 'true');
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/register?isLogin=true');
    };

    const handleRegisterClick = () => {
        navigate('/register?isLogin=false');
    };

    return (
        <HeaderContainer>
            <Logo src={logo} alt="Логотип" />
            <Menu>
                <MenuLink href="/">Главная</MenuLink>
                <MenuLink href="/tariffs">Тарифы</MenuLink>
                <MenuLink href="/faq">FAQ</MenuLink>
            </Menu>
            <RightMenu>
                {isAuthenticated ? (
                    <>
                        <LimitPanel>
                            {authLoading ? (
                                <Loader size="small" />
                            ) : (
                                <>
                                    <LimitText>Использовано компаний: {usedCompanies}</LimitText>
                                    <LimitText>Лимит по компаниям: {companyLimit}</LimitText>
                                </>
                            )}
                        </LimitPanel>
                        <UserInfo>
                            <Avatar src={avatar} alt="Аватар" />
                            <UserName>{user?.name || user?.login || 'Пользователь'}</UserName>
                            <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
                        </UserInfo>
                    </>
                ) : (
                    <>
                        <RegisterLink onClick={handleRegisterClick}>
                            Зарегистрироваться
                        </RegisterLink>
                        <Rectangle7 />
                        <LoginLink onClick={handleLoginClick} $active={isLogin}>
                            Войти
                        </LoginLink>
                        <Rectangle6 />
                    </>
                )}
            </RightMenu>
        </HeaderContainer>
    );
};

export default Header;