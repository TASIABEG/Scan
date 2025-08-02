import React, { useState } from 'react';
import styled from 'styled-components';
import ChevronLeft from '../assets/icons8-шеврон-вправо-90 1.png';
import ChevronRight from '../assets/icons8-шеврон-вправо-90 2.png';

const CarouselContainer = styled.div`
    display: flex;
    overflow: visible;
    width: 100%;
    max-width: 1320px;
    margin: 20px 0;
    position: relative;
`;

const CarouselContent = styled.div`
    display: flex;
    transition: transform 0.3s ease-in-out;
    transform: ${({ translateX }) => `translateX(-${translateX}px)`};
`;

const Slide = styled.div`
    min-width: 400px;
    margin: 0 15px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 1;
`;

const CardIcon = styled.img`
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
`;

const CardText = styled.div`
    font-size: 18px;
`;

const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 1;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    img {
        width: 30px;
        height: 30px;
    }

    ${({ direction }) => direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
`;

const Carousel = ({ cardsData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideWidth = 400 + 30; // Ширина карточки + отступ

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cardsData.length); // Переход по кругу
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cardsData.length) % cardsData.length); // Переход по кругу
    };

    return (
        <CarouselContainer>
            <NavButton onClick={handlePrev} direction="left">
                <img src={ChevronLeft} alt="Влево" />
            </NavButton>
            <CarouselContent translateX={currentIndex * slideWidth}>
                {cardsData.map((card, index) => (
                    <Slide key={index}>
                        <CardIcon src={card.icon} alt="" />
                        <CardText>{card.text}</CardText>
                    </Slide>
                ))}
            </CarouselContent>
            <NavButton onClick={handleNext} direction="right">
                <img src={ChevronRight} alt="Вправо" />
            </NavButton>
        </CarouselContainer>
    );
};

export default Carousel;
