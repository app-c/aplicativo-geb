import axios from 'axios';

const dev = 'http://192.168.235.160:3333';
const production = 'http://147.182.129.147';

const base = 'http://192.168.235.160:3333';

export const api = axios.create({
   baseURL: production,
});
