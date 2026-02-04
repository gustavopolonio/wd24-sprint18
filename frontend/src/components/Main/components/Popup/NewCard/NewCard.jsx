import { useState, useContext } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

export default function NewCard() {
  const userContext = useContext(CurrentUserContext); // Get the current user object
  const { handleAddPlaceSubmit } = userContext;
  const [name, setName] = useState(''); // Add state variable for name
  const [link, setLink] = useState(''); // Add state variable for link

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    handleAddPlaceSubmit({ name, link }); // Update the user info
  };

  return (
    <form
      className='popup__form'
      name='card-form'
      id='new-card-form'
      noValidate
      onSubmit={handleSubmit}>
      <label className='popup__field'>
        <input
          className='popup__input popup__input_type_card-name'
          id='card-name'
          maxLength='30'
          minLength='1'
          name='card-name'
          placeholder='Title'
          required
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} // Update name when input changes
        />
        <span className='popup__error' id='card-name-error'></span>
      </label>
      <label className='popup__field'>
        <input
          className='popup__input popup__input_type_url'
          id='card-link'
          name='link'
          placeholder='Image link'
          required
          type='url'
          value={link}
          onChange={(event) => setLink(event.target.value)} // Update link when input changes
        />
        <span className='popup__error' id='card-link-error'></span>
      </label>

      <button className='button popup__button' type='submit'>
        Save
      </button>
    </form>
  );
}
