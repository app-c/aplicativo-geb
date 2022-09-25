import axios from 'axios';

const base = 'http://192.168.45.172:3333';

export const api = axios.create({
   baseURL: base,
});
