import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo2.png';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Контейнер занимает всю высоту экрана */
`;

const Content = styled.main`
    flex: 1; /* Этот блок займет оставшееся пространство */
    padding: 20px;
    /* Убираем минимальную высоту, чтобы футер не отступал слишком сильно от контента */
`;

const FooterContainer = styled.footer`
    display: flex;
    justify-content: space-between; /* Распределение элементов по краям */
    align-items: center; /* Вертикальное выравнивание по центру */
    padding: 20px; /* Внутренние отступы */
    background: #029491; /* Цвет фона */
    width: 100%; /* Ширина футера */
    max-width: 98%; /* Максимальная ширина футера */
    height: 93px; /* Высота футера */
    margin-top: auto; /* Это обеспечит, что футер будет прижат к низу */
`;

const Logo = styled.img`
    height: 141px; /* Высота логотипа */
    width: 141px; /* Ширина логотипа */
`;

const RightMenu = styled.div`
    display: flex; /* Отображение в строку */
    flex-direction: column;
    align-items: flex-end; /* Вертикальное выравнивание по центру */
    gap: 0px; /* Увеличенные отступы между элементами */
    position: relative; /* Установите относительное позиционирование для контейнера */
    p {
        margin: 0; /* Убирает отступы между <p> */
        color: white; /* Изменяем цвет текста на белый */
    }
`;

const Footer = () => {
    return (
        <AppContainer>
            <Content>
                {/* Ваш основной контент здесь */}
            </Content>
            <FooterContainer>
                <Logo src={logo} alt="Логотип" />
                <RightMenu>
                    <p>г. Москва, Цветной б-р, 40</p>
                    <p>+7 495 771 21 11</p>
                    <p>info@skan.ru</p>
                    <p style={{ marginBottom: '20px' }}></p>
                    <p>Copyright, 2022</p>
                </RightMenu>
            </FooterContainer>
        </AppContainer>
    );
};

export default Footer;
