/*==================================================
SMARTBAZAAR PRO
PART 19.1
FIREBASE CONFIG
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

/*==============================
FIREBASE CONFIG
==============================*/

const firebaseConfig = {

    apiKey: "AIzaSyB1FirCmHEPqXHy3UP4m27bNsxDU7XyfYg",

    authDomain: "smart-bazaar-pro.firebaseapp.com",

    databaseURL: "https://smart-bazaar-pro-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "smart-bazaar-pro",

    storageBucket: "smart-bazaar-pro.firebasestorage.app",

    messagingSenderId: "842790302336",

    appId: "1:842790302336:web:c05a3477a2e018be2dec65"

};

/*==============================
INITIALIZE FIREBASE
==============================*/

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const auth = getAuth(app);

export { database, auth };

export default app;
