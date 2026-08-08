/*==================================================
SMARTBAZAAR PRO
PART 19.1
FIREBASE CONFIG
==================================================*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

/*==============================
FIREBASE CONFIG
==============================*/

const firebaseConfig = {

    apiKey: "AIzaSyB1FirCmHEPqXHy3UP4m27bNsxDU7XyfYg",

    authDomain: "smart-bazaar-pro.firebaseapp.com",

    projectId: "smart-bazaar-pro",

    storageBucket: "smart-bazaar-pro.firebasestorage.app",

    messagingSenderId: "842790302336",

    appId: "1:842790302336:web:c05a3477a2e018be2dec65"

};

/*==============================
INITIALIZE FIREBASE
==============================*/

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

/*==============================
EXPORT
==============================*/

export { app, db, auth };
