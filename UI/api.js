// Our API backend's URL
const API = 'https://us-central1-ubiquitouspi-ddcb0.cloudfunctions.net';


const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

export const get = async (uri) => await fetch(`${API}/${uri}`, {
  method: 'GET',
  headers,
});

export const put = async (uri, body) => await fetch(`${API}/${uri}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers,
});
