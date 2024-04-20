import { Alert } from 'react-native';

export function AlertWindow (title, message) {
    Alert.alert(title, message, [
        {
            text: 'OK',
        }
    ]);
};