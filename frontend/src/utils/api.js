import { getJwtInLocalStorage } from "./token";

class Api {
  constructor({ baseUrl, headers }) {
    // Standard implementation implies an options object
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _fetchWithRefresh(url, options) {
    const response = await fetch(url, options)

    if (response.status !== 401) {
      return response
    }

    const refreshReponse = await this.refresh()
    this.setAccessToken(refreshReponse.token)

    options.headers = this._getHeaders()
    return fetch(url, options)
  }

  _handleServerResponse(res) {
    if (res.status === 204) {
      return null
    }
  
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  _getHeaders() {
    // const token = getJwtInLocalStorage()
    let authHeaders = {}

    if (this._accessToken) {
      authHeaders = {
        Authorization: `Bearer ${this._accessToken}`
      }
    }

    return {
      ...this._headers,
      ...authHeaders
    }
  }

  setAccessToken(token) {
    this._accessToken = token
  }

  getAppInfo() {
    return Promise.all([this.getCardList(), this.getUserInfo()]);
  }

  getCardList() {
    return this._fetchWithRefresh(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
      credentials: 'include'
    }).then(this._handleServerResponse);
  }

  addCard({ name, link }) {
    return this._fetchWithRefresh(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  removeCard(cardID) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then(this._handleServerResponse);
  }

  getUserInfo() {
    return this._fetchWithRefresh(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
      credentials: 'include'
    }).then(this._handleServerResponse);
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  setUserAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }

  changeLikeCardStatus(cardID, like) {
    // Standard implementation: 2 different methods for liking and disliking
    return fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: like ? 'PUT' : 'DELETE',
      headers: this._getHeaders(),
    }).then(this._handleServerResponse);
  }

  register({ email, password }) {
    return fetch(`${this._baseUrl}/auth/register`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._handleServerResponse);
  }

  authorize({ email, password }) {
    return fetch(`${this._baseUrl}/auth/login`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._handleServerResponse);
  }

  logout() {
    return this._fetchWithRefresh(`${this._baseUrl}/auth/logout`, {
      method: 'POST',
      headers: this._getHeaders(),
      credentials: 'include',
    }).then(this._handleServerResponse);
  }

  refresh() {
    return fetch(`${this._baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
    }).then(this._handleServerResponse);
  }
}

const api = new Api({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
