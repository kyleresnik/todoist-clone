import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyDqNlNtLXyjSRa7rGDQ3M_BIzl2xi2Cm1Y",
  authDomain: "todoist-clone-b8b2f.firebaseapp.com",
  databaseURL: "https://todoist-clone-b8b2f.firebaseio.com",
  projectId: "todoist-clone-b8b2f",
  storageBucket: "todoist-clone-b8b2f.appspot.com",
  messagingSenderId: "972324866599",
  appId: "1:972324866599:web:68865655a97c1f7763dc02"
});

export { firebaseConfig as firebase };