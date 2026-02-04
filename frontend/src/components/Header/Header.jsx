import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.svg';
import { removeJwtFromLocalStorage } from '../../utils/token';
import api from '../../utils/api';

const Header = ({ isLoggedIn, setIsLoggedIn, userEmail, setAccessToken }) => {
  const location = useLocation()
  const isSignUpPage = location.pathname === '/signup'
  const isSignInPage = location.pathname === '/signin'
  const authLink = isSignUpPage
    ? { to: '/signin', text: 'Entrar' }
    : isSignInPage
      ? { to: '/signup', text: 'Faça o login' }
      : { to: '/signin', text: 'Faça o login' }

  async function handleLogout() {
    // setIsLoggedIn(false)
    // removeJwtFromLocalStorage()
    // navigate("/signin")

    await api.logout()
    setAccessToken(null)
    api.setAccessToken(null)
    setIsLoggedIn(false)
  }

  return (
    <header className='header page__section'>
      <img src={logo} alt='Around the U.S logo' className='logo header__logo' />

      <div className='header__actions'>
        {isLoggedIn && (
          <span className='header__user-email'>{userEmail}</span>
        )}

        {isLoggedIn ? (
          <button onClick={handleLogout} className='header__logout-button'>Sair</button>
        ) : (
          <Link to={authLink.to} className='header__link'>{authLink.text}</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
