import axios from 'axios';

const dev = 'http://192.168.8.7:3333';
const production = 'http://147.182.129.147';

const base = 'http://192.168.45.172:3333';

export const api = axios.create({
   baseURL: production,
});
