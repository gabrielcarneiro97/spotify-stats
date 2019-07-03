import axios from 'axios';
import { auth } from './auth.service';

const { api } = require('../public');

export async function getUser() {
  const { uid } = auth();
  const { data } = await axios.get(`${api}/getUser`, {
    params: {
      uid,
    },
  });

  return data;
}

export async function getTop() {
  const { uid } = auth();
  const { data } = await axios.get(`${api}/getTop`, {
    params: {
      uid,
    },
  });

  return data;
}
