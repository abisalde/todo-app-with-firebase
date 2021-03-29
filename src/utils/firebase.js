import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyA4rI97at1E7D0Mpiu9x23waLR3Xg9vxQM',
    authDomain: 'todo-app-list-63681.firebaseapp.com',
    projectId: 'todo-app-list-63681',
    storageBucket: 'todo-app-list-63681.appspot.com',
    messagingSenderId: '261285445987',
    appId: '1:261285445987:web:119c7b999e160d4c6d9356',
    measurementId: 'G-CFGV6VSLY5',
});

const database = firebaseApp.firestore();

export default database;
