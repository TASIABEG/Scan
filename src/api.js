import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://gateway.scan-interfax.ru',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const isTokenValid = () => {
  const token = localStorage.getItem('accessToken');
  const expireDate = localStorage.getItem('tokenExpire');

  if (!token || !expireDate) return false;

  return new Date() < new Date(expireDate);
};

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  const expireDate = localStorage.getItem('tokenExpire');

  if (token && expireDate) {
    if (new Date() > new Date(expireDate)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpire');
      window.location.href = '/login';
      return Promise.reject('Token expired');
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpire');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  login: (credentials) => instance.post('/api/v1/account/login', credentials),
  getAccountInfo: () => instance.get('/api/v1/account/info'),
  getHistograms: (data) => instance.post('/api/v1/objectsearch/histograms', {
    ...data,
    intervalType: "day",
    histogramTypes: ["totalDocuments", "riskFactors"]
  }),
  searchObjects: (query) => instance.post('/api/v1/objectsearch', {
    ...query,
    sortType: 1, // sourceInfluence
    sortDirectionType: 1 // descending
  }),
  getDocuments: (ids) => instance.post('/api/v1/documents', { ids })
};

const mapTone = (tone) => {
  const mapping = {
    'positive': 1,
    'negative': 2,
    'neutral': 3,
    'any': 0
  };
  return mapping[tone] || 0;
};