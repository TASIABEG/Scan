import React, { useState, useEffect, useRef } from "react";
import "./SearchResultsPage.css";
import searchImage from "../assets/Group 1171274267.png";
import leftArrow from "../assets/icons8-шеврон-вправо-90 1.png";
import rightArrow from "../assets/icons8-шеврон-вправо-90 2.png";
import image1 from "../assets/Снимок экрана 2022-09-24 в 20.20 1.png";
import image2 from "../assets/Снимок-экрана-2022-09-24-в-20.24-1.png";
import image3 from "../assets/0e89ed878a9aefa6822cbe2eedc207e1.jpg";
import Loader from "../components/Loader";
import api from "../api";

const SearchResultsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const carouselRef = useRef(null);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const countWords = (text) => {
    if (!text) return 0;
    const cleanText = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    return cleanText.trim().split(" ").filter(word => word).length;
  };

const formatDate = (dateString) => {
  if (!dateString) return "Дата не указана";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const documentIds = JSON.parse(sessionStorage.getItem('documentIds'));
      const histogramsData = JSON.parse(sessionStorage.getItem('histogramsData'));

      if (!documentIds || !histogramsData) {
        console.error('Данные поиска не найдены');
        setIsLoading(false);
        return;
      }

      // Обработка данных гистограмм
      const totalData = histogramsData.data.find(h => h.histogramType === "totalDocuments")?.data || [];
      const riskData = histogramsData.data.find(h => h.histogramType === "riskFactors")?.data || [];

      // Создаем объект для группировки по датам
      const dateStats = {};

      // Функция для преобразования даты из API в правильный формат
      const parseApiDate = (apiDate) => {
        const datePart = apiDate.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}.${month}.${year}`;
      };

      // Обрабатываем данные о количестве документов
      totalData.forEach(item => {
        const dateKey = parseApiDate(item.date);
        dateStats[dateKey] = {
          period: dateKey,
          total: item.value,
          risks: 0 // Инициализируем
        };
      });

      // Добавляем данные о рисках
      riskData.forEach(item => {
        const dateKey = formatDate(item.date);
        if (dateStats[dateKey]) {
          dateStats[dateKey].risks = item.value;
        }
      });

      // Преобразуем в массив и сортируем по дате
      const summary = Object.values(dateStats).sort((a, b) => {
        const dateA = a.period.split('.').reverse().join('-');
        const dateB = b.period.split('.').reverse().join('-');
        return new Date(dateA) - new Date(dateB);
      });

      setSummaryData(summary);


      // Получение документов батчами
      const batches = [];
      for (let i = 0; i < documentIds.length; i += 100) {
        batches.push(documentIds.slice(i, i + 100));
      }

      let allDocuments = [];
      for (const batch of batches) {
        const response = await api.getDocuments(batch);
        allDocuments = [...allDocuments, ...response.data];
      }

      const processedDocs = allDocuments
        .filter(doc => doc.ok)
        .map(doc => ({
          date: formatDate(doc.ok.issueDate),
          resource: doc.ok.source?.name || "Неизвестный источник",
          title: doc.ok.title?.text || "Без названия",
          attributes: {
            isTechNews: doc.ok.attributes?.isTechNews || false,
            isAnnouncement: doc.ok.attributes?.isAnnouncement || false,
            isDigest: doc.ok.attributes?.isDigest || false,
            wordCount: doc.ok.attributes?.wordCount || countWords(doc.ok.content?.markup),
            influence: doc.ok.attributes?.influence || 0
          },
          image: [image1, image2, image3][Math.floor(Math.random() * 3)],
          description: doc.ok.content?.markup || "",
          link: doc.ok.url || "#"
        }));

      if (processedDocs.length === 0) {
        console.warn('Документы не найдены');
      } else {
        console.log('Загружено документов:', processedDocs.length);
      }

      setDocuments(processedDocs);
    } catch (error) {
      console.error('Error loading data:', error);
      alert(`Ошибка загрузки результатов: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

  const handleScroll = (direction) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollAmount = 200;
      carousel.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const getCategory = (attributes) => {
    if (attributes.isTechNews) return "Технические новости";
    if (attributes.isAnnouncement) return "Анонсы и события";
    if (attributes.isDigest) return "Сводки новостей";
    return "Без категории";
  };

  return (
    <div className="search-results-page">
      <header className="search-header">
        <div className="search-header-text">
          <h1 className="search-title">Ищем. Скоро <br /> будут результаты</h1>
          <p className="search-subtitle">
            Поиск может занять некоторое время, <br /> просим сохранить терпение.
          </p>
        </div>
        <div className="search-header-image">
          <img
            src={searchImage}
            alt="Иллюстрация поиска"
            className="search-image"
          />
        </div>
      </header>

      <section className="summary-section">
        <h2>Общая сводка</h2>
        <p>Найдено {documents.length} вариантов</p>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="summary-carousel-container">
            <button
              className="carousel-button left"
              onClick={() => handleScroll("left")}
            >
              <img src={leftArrow} alt="Left" />
            </button>

            <div className="summary-carousel-wrapper" ref={carouselRef}>
              <div className="summary-table-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <td>Период</td>
                      {summaryData.map((item, index) => (
                        <td key={index}>{item.period}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Всего</td>
                      {summaryData.map((item, index) => (
                        <td key={index}>{item.total}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Риски</td>
                      {summaryData.map((item, index) => (
                        <td key={index}>{item.risks}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button
              className="carousel-button right"
              onClick={() => handleScroll("right")}
            >
              <img src={rightArrow} alt="Right" />
            </button>
          </div>
        )}
      </section>

      <section className="document-section">
        <h2>Список документов</h2>
        <div className="document-cards">
          {documents
            .slice(0, showAllDocuments ? documents.length : 2)
            .map((doc, index) => (
              <div key={index} className="document-card">
                <k>
                  <span style={{ marginRight: "20px" }}>{doc.date}</span>
                  <span>
                    <a href={doc.link} target="_blank" rel="noopener noreferrer">
                      {doc.resource}
                    </a>
                  </span>
                </k>
                <h3>{doc.title}</h3>
                <ca>{getCategory(doc.attributes)}</ca>
                {doc.image && (
                  <div className="document-image-wrapper">
                    <img src={doc.image} alt={doc.title} className="document-image" />
                  </div>
                )}
                <k
                  className="description-text"
                  dangerouslySetInnerHTML={{ __html: truncateText(doc.description, 600) }}
                />
                <button onClick={() => window.open(doc.link, "_blank")}>
                  Читать в источнике
                </button>
                <p className="word-count">{doc.attributes.wordCount} слова</p>
              </div>
            ))}
        </div>
        {documents.length > 2 && (
          <div className="load-more">
            <button onClick={() => setShowAllDocuments(!showAllDocuments)}>
              {showAllDocuments ? "Скрыть" : "Показать больше"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResultsPage;