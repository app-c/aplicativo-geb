import axios from 'axios';
import soketio from 'socket.io-client';

const dev = 'http://192.168.149.34:3333';
const production = 'https://server.app-com.digital';

const base = 'http://192.168.235.160:3333';

export const api = axios.create({
   baseURL: production,
});

export const socket = soketio(production);
