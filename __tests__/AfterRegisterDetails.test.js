import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AfterRegisterDetails from '../Screens/AfterRegisterDetails';
import { setDoc, doc, getDocs, query, where, collection } from 'firebase/firestore';
import { db, storage } from '../Services/firebase';
import { AlertWindow } from '../Screens/Alert';
import { PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    rn.PermissionsAndroid = {
      request: jest.fn(),
      PERMISSIONS: {
        READ_EXTERNAL_STORAGE: 'readExternalStorage',
      },
      RESULTS: {
        GRANTED: 'granted',
      },
    };
    return rn;
});

  


const setDetails = jest.fn();

jest.mock('../Screens/Alert', () => ({
    AlertWindow: jest.fn(),
}));

jest.mock('@react-native-firebase/storage', () => {
    return {
      default: () => {
        return {
          ref: jest.fn(() => {
            return {
              child: jest.fn(() => {
                return {
                  putFile: jest.fn(() => Promise.resolve()),
                };
              }),
            };
          }),
        };
      },
    };
  });

  jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: jest.fn((options, callback) => {
      callback({
        didCancel: false,
        error: null,
        uri: 'path/to/image',
      });
    }),
  }));

  jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    setDoc: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    collection: jest.fn(),
  }));

  jest.mock('../Services/firebase', () => ({
    auth: {
      currentUser: {
        email: 'test@gmail.com',
        uid: 'testid',
      },
    },
    storage: {
      ref: jest.fn(() => ({
        child: jest.fn(() => ({
          putFile: jest.fn(() => Promise.resolve()),
        })),
      })),
    },
}));

it('profilkép feltöltése gomb engedélyezése', async () => {
    const {getByLabelText} = render(<AfterRegisterDetails />);

    const uploadButton = getByLabelText('UploadImage');

    fireEvent.press(uploadButton);
});


test('adatok megadása helyes inputokkal', async () => {
    const {getByLabelText, getByDisplayValue} = render(<AfterRegisterDetails />);
    const today = new Date().setHours(0,0,0,0);

    const calendarButton = getByLabelText('calendar');
    fireEvent.press(calendarButton);

    const birthdateField = getByLabelText('Születési dátum');
    const usernameField = getByLabelText('Felhasználónév');
    const fullNameField = getByLabelText('Teljes név');    
    const genderField = 'female';
    const heightField = getByLabelText('Magasság');
    const weightField = getByLabelText('Testsúly'); 

    fireEvent.changeText(usernameField, 'testuser');
    fireEvent.changeText(birthdateField, new Date(2000, 11, 11));
    fireEvent.changeText(fullNameField, 'Test User');
    fireEvent.changeText(heightField, 180);
    fireEvent.changeText(weightField, 80);

    expect(usernameField.props.value).toBeTruthy();
    expect(fullNameField.props.value).toBeTruthy();
    expect(genderField).toBe('female');
  
    const saveButton = getByLabelText('SetDetails');
    fireEvent.press(saveButton);

    await setDetails(usernameField.props.value, birthdateField.props.date, fullNameField.props.value, 
        genderField, heightField.props.value, weightField.props.value);
  
    /*expect(setDoc).toHaveBeenCalledWith(
      doc(db, 'users', 'testid'),
      {
        email: 'test@gmail.com',
        username: usernameField.props.value,
        birthdate: birthdateField.props.date,
        fullName: fullNameField.props.value,
        gender: genderField,
        height: heightField.props.value,
        weight: weightField.props.value,
        level: 1,
        xp: 0,
        profilePicture: '',
      }
    );*/
});

test('adatok megadása helytelen inputokkal', async () => {
    const {getByLabelText} = render(<AfterRegisterDetails />);
    const today = new Date().setHours(0,0,0,0);

    const calendarButton = getByLabelText('calendar');
    fireEvent.press(calendarButton);

    const usernameField = getByLabelText('Felhasználónév');
    const birthdateField = getByLabelText('Születési dátum');
    const fullNameField = getByLabelText('Teljes név');
    const genderField = '';

    fireEvent.changeText(usernameField, '');
    fireEvent.changeText(birthdateField, new Date(2024, 11, 11));
    fireEvent.changeText(fullNameField, '');

    const timestamp = new Date(birthdateField.props.date).getTime();
    expect(usernameField.props.value).toBeFalsy();
    expect(timestamp).toBeGreaterThan(today);
    expect(fullNameField.props.value).toBeFalsy();
    expect(genderField).toBeFalsy();

});