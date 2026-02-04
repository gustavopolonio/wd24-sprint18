import { useContext } from 'react';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';
import ImagePopup from '../Popup/ImagePopup/ImagePopup';

export default function Card(props) {
  const { name, link, likes } = props.card;
  const { handleOpenPopup, handleCardLike, handleCardDelete } = props;

  const userContext = useContext(CurrentUserContext);

  const { currentUser } = userContext;

  const imageComponent = {
    children: <ImagePopup card={props.card} />,
  };

  // // Checking if the current user is the owner of the current card
  // const isOwn = props.card.owner._id === currentUser._id;

  // // Creating a variable which you'll then set in `className` for the delete button
  // const cardDeleteButtonClassName = `card__delete-button ${
  //   isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'
  // }`;

  // // Check if the card was liked by the current user
  // const isLiked = props.card.likes.some((user) => user._id === currentUser._id);

  // // Create a variable which you then set in `className` for the like button
  // const cardLikeButtonClassName = `card__like-button ${
  //   isLiked ? 'card__like-button_is-active' : ''
  // }`;

  return (
    <li className='card'>
      <img
        className='card__image'
        src={link}
        alt=''
        onClick={() => handleOpenPopup(imageComponent)}
      />
      <button
        aria-label='Delete card'
        // className={cardDeleteButtonClassName}
        type='button'
        onClick={() => {
          handleCardDelete(props.card);
        }}
      />
      <div className='card__description'>
        <h2 className='card__title'>{name}</h2>
        <button
          aria-label='Like card'
          type='button'
          // className={cardLikeButtonClassName}
          onClick={() => handleCardLike(props.card)}
        />
        <span className='card__like-count'>0</span>
      </div>
    </li>
  );
}
