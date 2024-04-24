import Toast from 'react-native-toast-message';

let toastQueue = [];

export function showToast(type, firstText, secondText, time, notificationsEnabled) {
    if (!notificationsEnabled) {
        return;
    }

    toastQueue.push({ type, firstText, secondText, time });

    if (toastQueue.length === 1) {
        displayToast();
    }
}

const displayToast = () => {

    if (toastQueue.length === 0) {
        return;
    }

    const { type, firstText, secondText, time } = toastQueue[0];

    Toast.show({
        type: type,
        text1: firstText,
        text2: secondText,
        visibilityTime: time,
        onShow: () => {},
        onHide: () => {
            toastQueue.shift();
            displayToast();
        },
    });
    
};