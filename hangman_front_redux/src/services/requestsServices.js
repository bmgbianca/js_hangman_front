import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8080/',
  headers: {
    'Content-type': 'application/json',
  },
});

const getDatabaseWord = (level) => {
  if (level === 'expert') {
    return http.get('/single-player/hard');
  }
  return http.get(`/single-player/${level}`);
};

const postNewWord = (word) => {
  const newWord = {
    word: word,
  };
  return http.post('/play-with-a-friend', newWord);
};

const getFriendWord = (id) => {
  return http.get(`/play-with-a-friend/${id}`);
};

const postScore = (id, score) => {
  const newScore = {
    score: score,
  };
  return http.post(`/play-with-a-friend/score/${id}`, newScore);
};

const getScore = (id) => {
  return http.get(`/play-with-a-friend/score/${id}`);
};

export { getDatabaseWord, postNewWord, getFriendWord, postScore, getScore };
