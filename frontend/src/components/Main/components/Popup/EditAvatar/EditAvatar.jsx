import { useState, useContext } from 'react';
import CurrentUserContext from '../../../../../contexts/CurrentUserContext';

const EditAvatar = () => {
  const userContext = useContext(CurrentUserContext); // Get the current user object
  const { currentUser, handleUpdateAvatar } = userContext;

  const [avatar, setAvatar] = useState(currentUser.avatar); // Add state variable for avatar

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    handleUpdateAvatar({ avatar }); // Update the user info
  };

  return (
    <form
      className='popup__form'
      name='avatar-form'
      id='edit-avatar-form'
      noValidate
      onSubmit={handleSubmit}>
      <label className='popup__field'>
        <input
          type='url'
          name='avatar'
          id='owner-avatar'
          className='popup__input popup__input_type_url'
          placeholder='Image link'
          value={avatar}
          onChange={(event) => setAvatar(event.target.value)} // Update avatar when input changes
          required
        />
        <span className='popup__error' id='owner-avatar-error'></span>
      </label>
      <button type='submit' className='button popup__button'>
        Salvar
      </button>
    </form>
  );
};

export default EditAvatar;
