import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../Screens/Login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/firebase';

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  signInWithEmailAndPassword: jest.fn(),
}));

test('email, jelszó és bejelentkezés ellenőrzése helyes inputokkal', async () => {
  const { getByLabelText } = render(<Login/>);

  const emailField = getByLabelText('Email');
  const passwordField = getByLabelText('Jelszó');
  expect(emailField.props.value).toBe('');
  expect(passwordField.props.value).toBe('');

  fireEvent.changeText(emailField, 'test@gmail.com');
  fireEvent.changeText(passwordField, 'password');
  expect(emailField.props.value).toBeTruthy();
  expect(passwordField.props.value).toBeTruthy();
  expect(emailField.props.value).toContain('@');
  expect(passwordField.props.value.length).toBeGreaterThanOrEqual(6);

  const loginButton = getByLabelText('Login');
  fireEvent.press(loginButton);

  await waitFor(() => {
    expect(jest.requireMock('firebase/auth').signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@gmail.com',
      'password'
    );
  });
});

test('email és jelszó ellenőrzése helytelen inputokkal', async () => {
  const { getByLabelText } = render(<Login/>);

  const emailField = getByLabelText('Email');
  const passwordField = getByLabelText('Jelszó');

  fireEvent.changeText(emailField, '');
  fireEvent.changeText(passwordField, '');
  expect(emailField.props.value).toBeFalsy();
  expect(passwordField.props.value).toBeFalsy();

});