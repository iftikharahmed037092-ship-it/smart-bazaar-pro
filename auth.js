/*==================================================
SMARTBAZAAR PRO
LOGIN SYSTEM JAVASCRIPT
LOGIN + SIGN UP + FORGOT PASSWORD
==================================================*/


/*==================================================
FIREBASE AUTH
==================================================*/

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    updateProfile
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
    auth
}
from "./firebase-config.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const forgotForm =
    document.getElementById("forgotForm");


const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");


const signupName =
    document.getElementById("signupName");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const signupConfirmPassword =
    document.getElementById("signupConfirmPassword");


const forgotEmail =
    document.getElementById("forgotEmail");


const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");

const forgotMessage =
    document.getElementById("forgotMessage");


/*==================================================
HELPER
==================================================*/

function showMessage(
    element,
    message,
    type = "error"
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "auth-message " + type;
}


/*==================================================
FIREBASE ERROR MESSAGE
==================================================*/

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/user-not-found":

            return "No account was found with this email.";


        case "auth/wrong-password":

            return "Incorrect password.";


        case "auth/invalid-credential":

            return "Incorrect email or password.";


        case "auth/email-already-in-use":

            return "This email is already registered.";


        case "auth/weak-password":

            return "Password must be at least 6 characters.";


        case "auth/network-request-failed":

            return "Network error. Please check your internet connection.";


        case "auth/too-many-requests":

            return "Too many attempts. Please try again later.";


        case "auth/user-disabled":

            return "This account has been disabled.";


        default:

            console.error(
                "Firebase Auth Error:",
                error
            );

            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }

}


/*==================================================
EMAIL VALIDATION
==================================================*/

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/*==================================================
LOGIN
==================================================*/

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                loginEmail
                    ? loginEmail.value.trim()
                    : "";


            const password =
                loginPassword
                    ? loginPassword.value
                    : "";


            /*==============================
            VALIDATION
            ==============================*/

            if (!email) {

                showMessage(
                    loginMessage,
                    "Please enter your email."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    loginMessage,
                    "Please enter a valid email address."
                );

                return;

            }


            if (!password) {

                showMessage(
                    loginMessage,
                    "Please enter your password."
                );

                return;

            }


            try {

                showMessage(
                    loginMessage,
                    "Logging in...",
                    "loading"
                );


                /*==============================
                FIREBASE LOGIN
                ==============================*/

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Login successful:",
                    user.uid
                );


                showMessage(
                    loginMessage,
                    "Login successful. Opening your account...",
                    "success"
                );


                /*==============================
                OPEN ACCOUNT PAGE
                ==============================*/

                setTimeout(
                    function() {

                        window.location.href =
                            "account.html";

                    },
                    700
                );

            }


            catch(error) {

                showMessage(
                    loginMessage,
                    getFirebaseErrorMessage(error),
                    "error"
                );

            }

        }
    );

}


/*==================================================
SIGN UP
==================================================*/

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                signupName
                    ? signupName.value.trim()
                    : "";


            const email =
                signupEmail
                    ? signupEmail.value.trim()
                    : "";


            const password =
                signupPassword
                    ? signupPassword.value
                    : "";


            const confirmPassword =
                signupConfirmPassword
                    ? signupConfirmPassword.value
                    : "";


            /*==============================
            NAME
            ==============================*/

            if (!name) {

                showMessage(
                    signupMessage,
                    "Please enter your name."
                );

                return;

            }


            /*==============================
            EMAIL
            ==============================*/

            if (!email) {

                showMessage(
                    signupMessage,
                    "Please enter your email."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    signupMessage,
                    "Please enter a valid email address."
                );

                return;

            }


            /*==============================
            PASSWORD
            ==============================*/

            if (!password) {

                showMessage(
                    signupMessage,
                    "Please enter a password."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    signupMessage,
                    "Password must be at least 6 characters."
                );

                return;

            }


            /*==============================
            CONFIRM PASSWORD
            ==============================*/

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    signupMessage,
                    "Passwords do not match."
                );

                return;

            }


            try {

                showMessage(
                    signupMessage,
                    "Creating your account...",
                    "loading"
                );


                /*==============================
                CREATE FIREBASE ACCOUNT
                ==============================*/

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                /*==============================
                SAVE DISPLAY NAME
                ==============================*/

                await updateProfile(
                    user,
                    {
                        displayName:
                            name
                    }
                );


                console.log(
                    "Account created:",
                    user.uid
                );


                showMessage(
                    signupMessage,
                    "Account created successfully!",
                    "success"
                );


                /*==============================
                OPEN ACCOUNT
                ==============================*/

                setTimeout(
                    function() {

                        window.location.href =
                            "account.html";

                    },
                    800
                );

            }


            catch(error) {

                showMessage(
                    signupMessage,
                    getFirebaseErrorMessage(error),
                    "error"
                );

            }

        }
    );

}


/*==================================================
FORGOT PASSWORD
==================================================*/

if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                forgotEmail
                    ? forgotEmail.value.trim()
                    : "";


            /*==============================
            EMAIL REQUIRED
            ==============================*/

            if (!email) {

                showMessage(
                    forgotMessage,
                    "Please enter your email."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    forgotMessage,
                    "Please enter a valid email address."
                );

                return;

            }


            try {

                showMessage(
                    forgotMessage,
                    "Sending password reset email...",
                    "loading"
                );


                /*==============================
                SEND RESET EMAIL
                ==============================*/

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showMessage(
                    forgotMessage,
                    "Password reset email sent. Please check your inbox.",
                    "success"
                );

            }


            catch(error) {

                showMessage(
                    forgotMessage,
                    getFirebaseErrorMessage(error),
                    "error"
                );

            }

        }
    );

}


/*==================================================
LOGOUT
==================================================*/

const logoutButton =
    document.getElementById(
        "logout-button"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            try {

                await signOut(auth);


                window.location.href =
                    "login.html";

            }


            catch(error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/*==================================================
AUTH STATE
==================================================*/

onAuthStateChanged(
    auth,
    function(user) {

        if (user) {

            console.log(
                "Current user:",
                user.email
            );


            console.log(
                "User ID:",
                user.uid
            );

        }

        else {

            console.log(
                "No user is currently logged in."
            );

        }

    }
);
