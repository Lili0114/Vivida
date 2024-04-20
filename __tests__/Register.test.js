import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../Screens/Register';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/firebase';

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  createUserWithEmailAndPassword: jest.fn(),
}));

test('email, jelszó és regisztráció ellenőrzése helyes inputokkal', async () => {
  const {getByLabelText} = render(<Register />);

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
  
  const regButton = getByLabelText('Register');
  fireEvent.press(regButton);

  await waitFor(() => {
    expect(jest.requireMock('firebase/auth').createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@gmail.com',
      'password'
    );
  });

});

test('email, jelszó ellenőrzése helytelen inputokkal', async () => {
  const {getByLabelText} = render(<Register />);

  const emailField = getByLabelText('Email');
  const passwordField = getByLabelText('Jelszó');

  fireEvent.changeText(emailField, '');
  fireEvent.changeText(passwordField, '');
  expect(emailField.props.value).toBeFalsy();
  expect(passwordField.props.value).toBeFalsy();

});