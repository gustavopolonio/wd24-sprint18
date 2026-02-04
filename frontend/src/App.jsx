import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Popup from './components/Main/components/Popup/Popup';
import InfoTooltip from './components/Main/components/Popup/InfoTooltip/InfoTooltip';
import api from './utils/api';
import CurrentUserContext from './contexts/CurrentUserContext';
import Login from './components/Login/Login';
import { getJwtInLocalStorage, setJwtInLocalStorage } from './utils/token'
import Register from './components/Register/Register';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import tooltipCheck from './images/tooltip-check.png';
import tooltipError from './images/tooltip-error.png';
import Loader from './components/Main/components/Loader';

function App() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [userEmail, setUserEmail] = useState('')
  const [popup, setPopup] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [accessToken, setAccessToken]  = useState(null)

  const registerSuccessPopup = {
    children: (
      <InfoTooltip
        imageSrc={tooltipCheck}
        message='Vitória! Você agora está registrado.'
      />
    ),
  };

  const loginErrorPopup = {
    children: (
      <InfoTooltip
        imageSrc={tooltipError}
        message='Ops, algo deu errado! Por favor, tente novamente.'
      />
    ),
  };

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .setUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const handleUpdateAvatar = (data) => {
    (async () => {
      await api
        .setUserAvatar(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  async function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard)),
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(card) {
    // Send a request to the API and getting the updated card data
    await api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((currentCard) => currentCard._id !== card._id));
      })
      .catch((error) => console.error(error));
  }

  const handleAddPlaceSubmit = (data) => {
    (async () => {
      await api
        .addCard(data)
        .then((newCard) => {
          setCards([newCard, ...cards]);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  async function loadAppData() {
    try {
      // const [cardsData, userData] = await Promise.all([
      //   api.getCardList(),
      //   api.getUserInfo(),
      // ]);

      const cardsData = await api.getCardList()

      setCards(cardsData);
      // setCurrentUser(userData);
    } catch (err) {
      console.error(err);
      throw err
    }
  }

  const handleLogin = async (data) => {
    try {
      const res = await api.authorize(data);
      // setJwtInLocalStorage(res.token);
      setAccessToken(res.token)
      api.setAccessToken(res.token)
      setIsLoggedIn(true);

      const info = await api.getUserInfo();
      setUserEmail(info.email);
      await loadAppData();
    } catch (error) {
      console.error(error);
      handleOpenPopup(loginErrorPopup);
    }
  };

  const handleRegister = async (data) => {
    try {
      await api.register(data);
      handleOpenPopup(registerSuccessPopup);
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // const jwt = getJwtInLocalStorage()

    // if (!jwt) {
    //   setIsAuthLoading(false)
    //   return
    // }

    (async () => {
      try {
        const data = await api.getUserInfo();
        setIsLoggedIn(true);
        setUserEmail(data.data.email);
        await loadAppData();
      } catch (error) {
        setIsAuthLoading(false)
        console.log(error);
      } finally {
        setIsAuthLoading(false)
      }
    })();
  }, [])

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar, handleAddPlaceSubmit }}>

      <div className='page__content'>
        <Header userEmail={userEmail} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setAccessToken={setAccessToken} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isAuthLoading={isAuthLoading}>
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onOpenPopup={handleOpenPopup}
                />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signin"
            element={
              <PublicRoute isLoggedIn={isLoggedIn} isAuthLoading={isAuthLoading}>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute isLoggedIn={isLoggedIn} isAuthLoading={isAuthLoading}>
                <Register onRegister={handleRegister} />
              </PublicRoute>
            }
          />

          <Route
            path="/test"
            element={
              <span style={{ color: 'red' }}>Rota pública!!!</span>
            }
          />

          <Route
            path="*"
            element={
              isAuthLoading ? (
                <Loader />
              ) : isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>

        {popup && (
          <Popup onClose={handleClosePopup} title={popup.title}>
            {popup.children}
          </Popup>
        )}
      
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
