import { useContext } from 'react';
import NewCard from './components/Popup/NewCard/NewCard';
import EditProfile from './components/Popup/EditProfile/EditProfile';
import EditAvatar from './components/Popup/EditAvatar/EditAvatar';
import Card from './components/Card/Card';
import CurrentUserContext from '../../contexts/CurrentUserContext';

const Main = ({ cards, onCardLike, onCardDelete, onOpenPopup }) => {
  const userContext = useContext(CurrentUserContext);

  const { currentUser } = userContext;

  const newCardPopup = {
    title: 'Novo Local',
    children: <NewCard />,
  };
  const editProfile = {
    title: 'Editar perfil',
    children: <EditProfile />,
  };
  const editAvatar = {
    title: 'Editar avatar',
    children: <EditAvatar />,
  };

  return (
    <main className='content'>
      <section className='profile page__section'>
        <div className='profile__avatar'>
          <img className='profile__avatar-img' src={currentUser.avatar} alt='Avatar' />
          <button
            aria-label='Edit avatar'
            className='profile__avatar-edit'
            type='button'
            onClick={() => onOpenPopup(editAvatar)}
          />
        </div>
        <div className='profile__info'>
          <h1 className='profile__title'>{currentUser.name}</h1>
          <button
            aria-label='Edit profile'
            className='profile__edit-button'
            type='button'
            onClick={() => onOpenPopup(editProfile)}
          />

          <p className='profile__description'>{currentUser.about}</p>
        </div>
        <button
          aria-label='Add card'
          className='profile__add-button'
          type='button'
          onClick={() => onOpenPopup(newCardPopup)}
        />
      </section>
      <section className='cards page__section'>
        <ul className='cards__list'>
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              handleOpenPopup={onOpenPopup}
              handleCardLike={onCardLike}
              handleCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Main;
