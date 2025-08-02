import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import imageSrс from '../assets/2398 1.png';
import imageSrс2 from '../assets/Group14.png';
import IconTime from '../assets/time.png';
import IconDatabase from '../assets/magnifier.png';
import IconShield from '../assets/lock.png';
import IconLaptop from '../assets/laptop.png';
import IconBulb from '../assets/bulb.png';
import IconTarget from '../assets/target.png';
import Carousel from './Carousel'; // Импорт Carousel

// Стилизация компонентов
const PageContainer = styled.div`
  width: 100%;
  max-width: 1976px;
  margin: 0 auto;
`;

const MainContainer = styled.div`
  width: 90%;
  max-width: 1320px;
  margin: 100px auto 0px;
  display: flex;
  align-items: flex-start;
  gap: 30px;
`;

const TextBlock = styled.div`
  width: 100%;
  max-width: 743px;
  font-family: 'Ferry', sans-serif;
  font-size: 60px;
  font-weight: 900;
  line-height: 72px;
  text-transform: uppercase;
`;

const SubTextBlock = styled.div`
  font-family: 'Ferry', sans-serif;
  font-size: 18px;
  line-height: 28px;
  margin-top: 10px;
`;

const RequestDataContainer = styled.div`
  margin-top: 30px;
`;

const RequestText = styled.button`
  background-color: #00b8d9;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0096b5;
  }
`;

const ImageBlock = styled.img`
  max-width: 100%;
  height: auto;
`;

const AdvantagesSection = styled.section`
  background-color: #ffffff;
  padding: 50px 0;
  text-align: left;
  display: flex;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  text-align: left;
`;

// Данные для секции тарифов
const pricingData = [
  {
    title: "Beginner",
    description: "Для небольшого исследования",
    price: "799",
    discountPrice: "1 200",
    highlight: "Текущий тариф",
    benefits: ["Безлимитная история запросов", "Безопасная сделка", "Поддержка 24/7"],
    icon: IconBulb,
    headerColors: {
      bgColor: "#FFB64F",
      textColor: "#000000",
    },
  },
  {
    title: "Pro",
    description: "Для HR и фрилансеров",
    price: "1 299",
    discountPrice: "2 600",
    highlight: "Текущий тариф",
    benefits: [
      "Все пункты тарифа Beginner",
      "Экспорт истории",
      "Рекомендации по приоритетам",
    ],
    icon: IconTarget,
    headerColors: {
      bgColor: "#7CE3E1",
      textColor: "#000000",
    },
  },
  {
    title: "Business",
    description: "Для корпоративных клиентов",
    price: "2 379",
    discountPrice: "3 700",
    highlight: "Текущий тариф",
    benefits: [
      "Все пункты тарифа Pro",
      "Безлимитное количество запросов",
      "Приоритетная поддержка",
    ],
    icon: IconLaptop,
    headerColors: {
      bgColor: "#000000",
      textColor: "#FFFFFF",
      descriptionColor: "#FFFFFF",
    },
  },
];

const PricingSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  padding: 20px;
  width: 100%;
`;

const DiscountPrice = styled.span`
  font-size: 16px;
  text-decoration: line-through;
  color: #999;
  margin-left: 10px;
  text-align: left;
`;

const HighlightLabel = styled.span`
  background-color: #e3f7ff;
  color: #00b8d9;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 10px;
  margin-left: auto;
`;

const Installment = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 0px;
  margin-bottom: 20px;
  text-align: left;
  margin-left: 20px;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  font-size: 14px;
  color: #333;
  text-align: left;
  margin-left: 20px;

  li {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;

    &::before {
      content: "✔";
      color: #00b8d9;
    }
  }
`;

const PriceCard = styled.div`
  background-color: ${(props) => (props.isHighlighted ? "#FFFAE5" : "#fff")};
  border: ${(props) => (props.isHighlighted ? "2px solid #FFB400" : "none")};
  padding-bottom: 20px;
  width: 415px;
  Height: 540px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const BenefitsText = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-top: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${(props) => props.bgColor || "#00b8d9"};
  padding: 20px;
  border-radius: 5px 5px 0 0;
  color: ${(props) => props.textColor || "#fff"};
  font-weight: bold;
  gap: 5px;
  width: 100%;
  box-sizing: border-box;
  height: 120px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const HeaderTitle = styled.span`
  font-size: 30px;
  font-weight: bold;
  text-align: left;
`;

const HeaderDescription = styled.span`
  font-size: 14px;
  color: ${(props) => props.color || "#000"};
  text-align: left;
`;

const HeaderImage = styled.img`
  width: 80px;
  height: auto;
  margin-left: auto;
  margin-top: 10px;
`;

const CardText = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: #333;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 10px;
  margin-left: 20px;
`;

const Price = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin: 0;
  text-align: left;
  margin-top: 20px;
`;

const PriceButton = styled.button`
  background-color: ${(props) => (props.isPersonalAccount ? "#D2D2D2" : "#5970FF")}; /* Серый для личного кабинета, синий для остальных */
  color: ${(props) => (props.isPersonalAccount ? "#fff" : "#fff")}; /* Цвет текста */
  border: none;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  width: 85%;
  margin: 0 auto; /* Центрирует кнопку */
  display: block; /* Кнопка как блочный элемент */
  position: absolute; /* Фиксируем кнопку */
  bottom: 20px; /* Отступ от нижнего края */
  left: 50%; /* По центру */
  transform: translateX(-50%); /* Центрируем по горизонтали */

  &:hover {
    background-color: ${(props) => (props.isPersonalAccount ? "#949494" : "#4153c8")}; /* Цвет при наведении */
  }
`;

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // false для незарегистрированного пользователя
  const navigate = useNavigate(); // Хук для навигации

  const cardsData = [
    { icon: IconTime, text: "Высокая и оперативная скорость обработки заявки" },
    { icon: IconDatabase, text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос" },
    { icon: IconShield, text: "Защита конфиденциальных сведений не подлежащих разглашению по федеральному законодательству" },
  ];

  const handleRequestClick = () => {
    if (isLoggedIn) {
      navigate('/search'); // Переход на страницу /search
    } else {
      navigate('/register?isLogin=false'); // Переход на страницу регистрации
    }
  };

  return (
    <PageContainer>
      <MainContainer>
        <div>
          <TextBlock>Сервис по поиску публикаций о компании по его ИНН</TextBlock>
          <SubTextBlock>
            Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.
          </SubTextBlock>
          <RequestDataContainer>
            <RequestText onClick={handleRequestClick}>Запросить данные</RequestText> {/* Обработчик клика */}
          </RequestDataContainer>
        </div>
        <ImageBlock src={imageSrс} alt="Описание изображения" />
      </MainContainer>

      <AdvantagesSection>
        <div>
          <Title>Почему именно мы</Title>
          <Carousel cardsData={cardsData} />
        </div>
      </AdvantagesSection>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ImageBlock src={imageSrс2} alt="Описание изображения" />
      </div>

      <PricingSection>
        {pricingData.map((card, index) => {
          const isCurrentPlan = card.title === "Business" && isLoggedIn;

          return (
            <PriceCard key={index} isHighlighted={isCurrentPlan}>
              <Header
                bgColor={card.headerColors.bgColor}
                textColor={card.headerColors.textColor}
              >
                <HeaderText>
                  <HeaderTitle>{card.title}</HeaderTitle>
                  <HeaderDescription color={card.headerColors.descriptionColor}>
                    {card.description}
                  </HeaderDescription>
                </HeaderText>
                <HeaderImage src={card.icon} alt={card.title} />
              </Header>
              {isCurrentPlan && <HighlightLabel>Текущий тариф</HighlightLabel>}
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <PriceContainer>
                  <Price>{card.price} ₽</Price>
                  {card.discountPrice && <DiscountPrice>{card.discountPrice} ₽</DiscountPrice>}
                </PriceContainer>
              </div>
              <Installment>или 150 ₽/мес. при рассрочке на 24 мес.</Installment>
              <BenefitsText>В тариф входит:</BenefitsText>
              <BenefitsList>
                {card.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </BenefitsList>
              {isCurrentPlan ? (
                <PriceButton isPersonalAccount={true}>Перейти в личный кабинет</PriceButton>
              ) : (
                <PriceButton>Подробнее</PriceButton>
              )}
            </PriceCard>
          );
        })}
      </PricingSection>
    </PageContainer>
  );
};

export default MainPage;
