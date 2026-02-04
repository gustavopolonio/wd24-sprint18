import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    onRegister({ email, password });
  };

  return (
    <form
      className='form'
      name='card-form'
      id='register-form'
      // noValidate
      onSubmit={handleSubmit}>
      <h2 className='form__title'>Inscrever-se</h2>

      <label className='form__field'>
        <input
          className='form__input'
          id='user-email'
          name='user-email'
          placeholder='E-mail'
          required
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <span className='form__error' id='user-email-error'></span>
      </label>
      <label className='form__field'>
        <input
          className='form__input'
          id='user-password'
          name='user-password'
          placeholder='Senha'
          required
          type='text'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <span className='form__error' id='user-password-error'></span>
      </label>

      <button className='button form__button' type='submit'>
        Inscrever-se
      </button>

      <p className='form__text'>
        Já é um membro?
        {" "}
        <Link to="/signin" className='form__link'>
          Faça o login aqui!
        </Link>
      </p>
    </form>
  );
};

export default Register;
