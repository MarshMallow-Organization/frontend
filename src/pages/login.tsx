import { useState, type FormEvent } from 'react';
import ellipse4 from '../assets/login/ellipse-4.svg';
import ellipse5 from '../assets/login/ellipse-5.svg';
import ellipse6 from '../assets/login/ellipse-6.svg';
import ellipse7 from '../assets/login/ellipse-7.svg';
import './login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-card__form-pane">
          <div className="login-card__blobs" aria-hidden="true">
            <img src={ellipse4} className="blob blob--1" alt="" />
            <img src={ellipse5} className="blob blob--2" alt="" />
            <img src={ellipse6} className="blob blob--3" alt="" />
            <img src={ellipse7} className="blob blob--4" alt="" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-form__title">로그인</h1>

            <label className="login-field">
              <span className="login-field__label">이름</span>
              <input
                className="login-field__input"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="login-field">
              <span className="login-field__label">비밀번호</span>
              <input
                className="login-field__input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="login-submit">
              로그인
            </button>

            <div className="login-links">
              <a href="#">비밀번호 찾기</a>
              <span aria-hidden="true">|</span>
              <a href="#">아이디 찾기</a>
              <span aria-hidden="true">|</span>
              <a href="#">회원가입</a>
            </div>
          </form>
        </div>

        <div className="login-card__brand-pane">
          <span className="login-brand__site-name">web site name</span>
          <p className="login-brand__wordmark">Marsh Mallow</p>
        </div>
      </div>
    </div>
  );
}
