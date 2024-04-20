import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanDetails from '../Screens/PlanDetails';
import { db, auth } from '../Services/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { act } from '@testing-library/react-native';

jest.mock('../Services/firebase', () => ({
  db: {
    collection: jest.fn(),
  },
  auth: {
    currentUser: {
      uid: 'testUid',
    },
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn().mockReturnValue({
    addDoc: jest.fn(),
  }),
  query: jest.fn().mockReturnValue({}),
  where: jest.fn().mockReturnValue({}),
  getDocs: jest.fn().mockResolvedValue({
    docs: [],
    empty: true,
  }),
}));

describe('PlanDetails', () => {
  it('user_plan kollekcióba mentés', async () => {
    const navigation = { navigate: jest.fn() };
    const route = { params: { } };

    const { getByLabelText } = render(<PlanDetails navigation={navigation} route={route} />);

    const saveButton = getByLabelText('handleSaveAdvanced');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(collection).nthCalledWith(2, expect.any(Object), 'user_plan');
  });
});