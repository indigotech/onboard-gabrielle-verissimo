import axios from 'axios';

export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
export const endpoint = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => {
    return true;
  },
});
