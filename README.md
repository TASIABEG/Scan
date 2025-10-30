# React Проект для компании Скан

Сервис для поиска публикаций о компании по ИНН с комплексным анализом данных и генерацией PDF-отчётов.  

---

---

## Описание проекта
React-приложение, которое позволяет пользователям:
- Искать публикации о компаниях по ИНН.
- Просматривать тарифы и оформлять подписку.
- Получать PDF-отчёты по найденной информации.
- Управлять своим аккаунтом через личный кабинет.

---

## Технологии
- React 18
- React Router v6
- Styled Components
- Axios
- Context API (AuthContext)
- Jest & React Testing Library (тесты)
- CSS/SCSS для кастомных стилей
- HTML5 & CSS3

---

## Установка
1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/yourusername/company-search.git
Перейти в папку проекта:


cd company-search
Установить зависимости:

npm install
или
yarn install
Запуск проекта
Для локальной разработки:

npm start
Откроется http://localhost:3000.

Для сборки production версии:

npm run build
Для запуска тестов:

npm test
Структура проекта

## API
Все запросы выполняются через Axios:

/api/v1/account/login — вход пользователя.

/api/v1/account/info — получение информации о пользователе.

/api/v1/objectsearch/histograms — построение гистограмм.

/api/v1/objectsearch — поиск объектов по запросу.

/api/v1/documents — получение документов по ID.
