import axios from 'axios';
import { auth } from './auth.service';

const { api } = require('../public');

async function get(url) {
  const { uid } = auth();
  try {
    const { data } = await axios.get(url, {
      params: {
        uid,
      },
    });

    return data;
  } catch (err) {
    throw err;
  }
}

export async function getUser() {
  return get(`${api}/getUser`);
}

export async function getTop() {
  return get(`${api}/getTop`);
}

export async function getRecs() {
  return get(`${api}/getRecs`);
}
