class Auth {
    constructor(url) {
        this._url = url;
    };

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
      };

    login(password, email) {
        return fetch(`${this._url}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({password, email})
        })
        .then((res) => this._checkResponse(res))
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            return data.token;
          }
        })
    };

    register(password, email) {
        return fetch(`${this._url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password, email})
        })
        .then((res) => this._checkResponse(res))
    };

    getContent = (token) => { 
      return fetch(`${this._url}/users/me`, { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'application/json', 
          "Authorization": `Bearer ${token}` 
        }, 
      }) 
      .then((res) => this._checkResponse(res)) 
        .then(data => { 
          return data; 
        }) 
    } 
};

const auth = new Auth('https://api.mesto-react.nomoredomains.monster');

export default auth;