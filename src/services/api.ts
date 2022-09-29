import axios from 'axios';

const prov = 'http://192.168.8.7:3333';

const base = 'http://192.168.45.172:3333';

export const api = axios.create({
   baseURL: prov,
});
