import React from 'react';
import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => <>{children}</>,
  create: jest.fn(),
}));

jest.mock('react-native-paper', () => ({
  IconButton: 'IconButton',
  TextInput: 'TextInput',
  select: jest.fn(),
}));