import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GroupImage from '../assets/searchpage/Group 1171274244.png';
import DocumentIcon from '../assets/searchpage/Document.png';
import FoldersIcon from '../assets/searchpage/Folders.png';
import api from '../api';

// Стилизация компонентов
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-family: 'Ferry', sans-serif;
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
  letter-spacing: 0.03em;
  color: #000000;
  margin-bottom: 5px;
`;

const SubTitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 30px;
`;

const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  position: relative;
`;

const GroupImageStyled = styled.img`
  width: 350px;
  position: absolute;
  top: 180px;
  right: -150px;
`;

const DocumentImage = styled.img`
  margin-right: 200px;
`;

const FoldersImage = styled.img``;

const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
  width: 70%;  // Уменьшаем ширину формы
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  gap: 30px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
`;

const DateWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
`;

const DateLabel = styled(Label)`
  color: #aaaaaa;  // Серый цвет только для меток "Дата начала" и "Дата окончания"
`;

const Input = styled.input`
  padding: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;  // Чекбоксы в один столбик
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const SubmitButton = styled.button`
  padding: 12px 40px;  // Увеличенная ширина кнопки
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 44%;  // Расширяем кнопку
  margin-top: 20px;
  align-self: flex-start;
  position: absolute;
  bottom: 18px;  // Кнопка в левом нижнем углу
  left: 475px;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: red;
`;

const RequiredFields = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #aaaaaa;
  margin-top: 10px;
`;

const SearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    inn: '',
    tone: 'any',
    docCount: '10',
    startDate: '',
    endDate: '',
    checkboxes: {
      fullCoverage: false,
      businessContext: false,
      mainRole: false,
      riskFactors: false,
      techNews: true,
      announcements: true,
      summaries: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const mapTone = (tone) => {
    const mapping = {
      'positive': 1,
      'negative': 2,
      'neutral': 3,
      'any': 0
    };
    return mapping[tone] || 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Сбрасываем ошибку при изменении данных
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      checkboxes: { ...prev.checkboxes, [name]: checked },
    }));
  };

  const validateForm = () => {
    const { inn, docCount, startDate, endDate } = formData;

    if (!inn || !/^\d{10,12}$/.test(inn)) {
      setError('Введите корректный ИНН (10 или 12 цифр)');
      return false;
    }

    if (!docCount || Number(docCount) < 1 || Number(docCount) > 1000) {
      setError('Количество документов должно быть от 1 до 1000');
      return false;
    }

    if (!startDate || !endDate) {
      setError('Укажите обе даты');
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Дата начала должна быть раньше даты окончания');
      return false;
    }

    return true;
  };

  const isFormValid = () => {
    const { inn, docCount, startDate, endDate } = formData;
    const isValidInn = /^\d{10}$/.test(inn);
    const isValidDocCount = Number(docCount) >= 1 && Number(docCount) <= 1000;
    const isValidDates = new Date(startDate) <= new Date(endDate);
    return isValidInn && isValidDocCount && startDate && endDate && isValidDates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestBody = {
        issueDateInterval: {
          startDate: `${formData.startDate}T00:00:00+03:00`,
          endDate: `${formData.endDate}T23:59:59+03:00`
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [{
              type: "company",
              sparkId: null,
              entityId: null,
              inn: formData.inn,
              maxFullness: formData.checkboxes.fullCoverage,
              inBusinessNews: formData.checkboxes.businessContext || null
            }],
            onlyMainRole: formData.checkboxes.mainRole,
            tonality: mapTone(formData.tone),
            onlyWithRiskFactors: formData.checkboxes.riskFactors,
            riskFactors: {  // Добавлено обязательное поле
                and: [],
                or: [],
                not: []
            },
            themes: {  // Добавлено обязательное поле
                and: [],
                or: [],
                not: []
            }
          },
            themesFilter: {  // Добавлено обязательное поле
                and: [],
                or: [],
                not: []
            }
          },
        attributeFilters: {
          excludeTechNews: !formData.checkboxes.techNews,
          excludeAnnouncements: !formData.checkboxes.announcements,
          excludeDigests: !formData.checkboxes.summaries
        },
        limit: parseInt(formData.docCount),
        similarMode: "duplicates", // Добавляем параметр из спецификации
        sortType: "sourceInfluence",
        sortDirectionType: "desc",
        intervalType: "day",  // Добавлено для гистограмм
        histogramTypes: ["totalDocuments", "riskFactors"]  // Добавлено для гистограмм
        };

      // Запрашиваем гистограммы
      const histogramsResponse = await api.getHistograms(requestBody);

      // Отправляем запрос на поиск
      const searchResponse = await api.searchObjects(requestBody);
      const documentIds = searchResponse.data.items.map(item => item.encodedId);

      // Сохраняем данные для использования на странице результатов
      sessionStorage.setItem('searchParams', JSON.stringify(requestBody));
      sessionStorage.setItem('documentIds', JSON.stringify(documentIds));
      sessionStorage.setItem('histogramsData', JSON.stringify(histogramsResponse.data));

      // Перенаправляем на страницу результатов
      navigate('/search-results');
    } catch (error) {
      console.error('Search error:', error);
      console.error('Response data:', error.response?.data);
      alert(`Ошибка при выполнении поиска: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <TitleWrapper>
        <Title>Найдите необходимые
        <br />
        данные в пару кликов.</Title>
        <SubTitle>Задайте параметры поиска. <br />Чем больше заполните, тем точнее поиск</SubTitle>
      </TitleWrapper>
      <ImagesWrapper>
        <DocumentImage src={DocumentIcon} alt="Документы" />
        <FoldersImage src={FoldersIcon} alt="Папки" />
        <GroupImageStyled src={GroupImage} alt="Группа" />
      </ImagesWrapper>
      <FormWrapper onSubmit={handleSubmit}>
      <LeftColumn>
        <Label>ИНН Компании*</Label>
        <Input
          type="number"
          name="inn"
          value={formData.inn}
          onChange={handleInputChange}
        />

        <Label>Тональность*</Label>
        <Select
          name="tone"
          value={formData.tone}
          onChange={handleInputChange}
        >
          <option value="positive">Положительная</option>
          <option value="negative">Отрицательная</option>
          <option value="neutral">Нейтральная</option>
        </Select>

        <Label>Количество документов в выдаче*</Label>
        <Input
          type="number"
          name="docCount"
          value={formData.docCount}
          onChange={handleInputChange}
        />

        <Label>Диапазон поиска</Label>  {/* Добавляем заголовок "Диапазон поиска" */}
        <DateWrapper>
          <div>
            <DateLabel>Дата начала*</DateLabel>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <DateLabel>Дата окончания*</DateLabel>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
        </DateWrapper>
      </LeftColumn>

        <RightColumn>
          <CheckboxWrapper>
            <label>
              <Checkbox
                type="checkbox"
                name="fullCoverage"
                checked={formData.checkboxes.fullCoverage}
                onChange={handleCheckboxChange}
              />
              Признак максимальной полноты
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="businessContext"
                checked={formData.checkboxes.businessContext}
                onChange={handleCheckboxChange}
              />
              Упоминания в бизнес-контексте
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="mainRole"
                checked={formData.checkboxes.mainRole}
                onChange={handleCheckboxChange}
              />
              Главная роль в публикации
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="riskFactors"
                checked={formData.checkboxes.riskFactors}
                onChange={handleCheckboxChange}
              />
              Публикации только с риск-факторами
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="techNews"
                checked={formData.checkboxes.techNews}
                onChange={handleCheckboxChange}
              />
              Включать технические новости рынков
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="announcements"
                checked={formData.checkboxes.announcements}
                onChange={handleCheckboxChange}
              />
              Включать анонсы и календари
            </label>
            <label>
              <Checkbox
                type="checkbox"
                name="summaries"
                checked={formData.checkboxes.summaries}
                onChange={handleCheckboxChange}
              />
              Включать сводки новостей
            </label>
          </CheckboxWrapper>
          <SubmitButton type="submit">Поиск</SubmitButton>
        </RightColumn>
      </FormWrapper>
      <RequiredFields>* Обязательные к заполнению поля</RequiredFields>
    </PageContainer>
  );
};

export default SearchForm;
