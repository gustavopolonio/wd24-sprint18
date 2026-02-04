import { useState, useContext } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

export default function EditProfile() {
  const userContext = useContext(CurrentUserContext); // Get the current user object
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser.name); // Add state variable for name
  const [description, setDescription] = useState(currentUser.about); // Add state variable for description

  const handleNameChange = (event) => {
    setName(event.target.value); // Update name when input changes
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update description when input changes
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    handleUpdateUser({ name, about: description }); // Update the user info
  };

  return (
    <form
      className='popup__form'
      name='profile-form'
      id='edit-profile-form'
      noValidate
      onSubmit={handleSubmit}>
      <label className='popup__label'>
        <input
          className='popup__input popup__input_type_name'
          id='owner-name'
          maxLength='40'
          minLength='2'
          name='userName'
          placeholder='Name'
          required
          type='text'
          value={name} // Bind name to input
          onChange={handleNameChange} // Add onChange handler
        />
        <span className='popup__error' id='owner-name-error'></span>
      </label>
      <label className='popup__label'>
        <input
          className='popup__input popup__input_type_description'
          id='owner-description'
          maxLength='200'
          minLength='2'
          name='userDescription'
          placeholder='About me'
          required
          type='text'
          value={description} // Bind description to input
          onChange={handleDescriptionChange} // Add onChange handler
        />
        <span className='popup__error' id='owner-description-error'></span>
      </label>
      <button className='button popup__button' type='submit'>
        Save
      </button>
    </form>
  );
}
