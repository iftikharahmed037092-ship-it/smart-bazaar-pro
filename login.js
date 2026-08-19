/*==================================================
SMARTBAZAAR PRO
LOGIN / SIGNUP / FORGOT PASSWORD
login.js
==================================================*/


/*==================================================
FIREBASE CONFIG
==================================================*/

import {
    auth,
    database
} from "./firebase-config.js";


/*==================================================
FIREBASE AUTH IMPORTS
==================================================*/

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/*==================================================
FIREBASE DATABASE IMPORTS
==================================================*/

import {
    ref,
    get,
    set,
    update
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const authPage =
    document.getElementById("auth-page");

const authTitle =
    document.getElementById("auth-title");

const authSubtitle =
    document.getElementById("auth-subtitle");

const authMessage =
    document.getElementById("auth-message");


/*==============================
FORMS
==============================*/

const loginForm =
    document.getElementById("login-form");

const signupForm =
    document.getElementById("signup-form");

const forgotPasswordForm =
    document.getElementById(
        "forgot-password-form"
    );


/*==============================
LOGIN
==============================*/

const loginEmail =
    document.getElementById("login-email");

const loginPassword =
    document.getElementById("login-password");

const loginButton =
    document.getElementById("login-button");

const rememberMe =
    document.getElementById("remember-me");

const googleLoginButton =
    document.getElementById(
        "google-login-button"
    );


/*==============================
SIGNUP
==============================*/

const signupName =
    document.getElementById("signup-name");

const signupUsername =
    document.getElementById(
        "signup-username"
    );

const signupEmail =
    document.getElementById(
        "signup-email"
    );

const signupPassword =
    document.getElementById(
        "signup-password"
    );

const signupConfirmPassword =
    document.getElementById(
        "signup-confirm-password"
    );

const acceptTerms =
    document.getElementById(
        "accept-terms"
    );

const signupButton =
    document.getElementById(
        "signup-button"
    );

const googleSignupButton =
    document.getElementById(
        "google-signup-button"
    );


/*==============================
FORGOT PASSWORD
==============================*/

const forgotEmail =
    document.getElementById(
        "forgot-email"
    );

const resetPasswordButton =
    document.getElementById(
        "reset-password-button"
    );


/*==============================
SWITCH BUTTONS
==============================*/

const showSignupButton =
    document.getElementById(
        "show-signup-button"
    );

const showLoginButton =
    document.getElementById(
        "show-login-button"
    );

const forgotPasswordLink =
    document.getElementById(
        "forgot-password-link"
    );

const backToLoginButton =
    document.getElementById(
        "back-to-login-button"
    );


/*==============================
BACK HOME
==============================*/

const authBackButton =
    document.getElementById(
        "auth-back-button"
    );


/*==============================
PASSWORD TOGGLES
==============================*/

const toggleLoginPassword =
    document.getElementById(
        "toggle-login-password"
    );

const toggleSignupPassword =
    document.getElementById(
        "toggle-signup-password"
    );

const toggleConfirmPassword =
    document.getElementById(
        "toggle-confirm-password"
    );


/*==============================
PASSWORD STRENGTH
==============================*/

const passwordStrengthBar =
    document.getElementById(
        "password-strength-bar"
    );

const passwordStrengthText =
    document.getElementById(
        "password-strength-text"
    );


/*==============================
VERIFICATION
==============================*/

const verificationPanel =
    document.getElementById(
        "verification-panel"
    );

const resendVerificationButton =
    document.getElementById(
        "resend-verification-button"
    );

const verificationLogoutButton =
    document.getElementById(
        "verification-logout-button"
    );


/*==================================================
CURRENT USER
==================================================*/

let currentUser = null;


/*==================================================
GOOGLE PROVIDER
==================================================*/

const googleProvider =
    new GoogleAuthProvider();


/*==================================================
HELPER — SHOW MESSAGE
==================================================*/

function showMessage(
    message,
    type = "error"
) {

    if (!authMessage) {
        return;
    }


    authMessage.textContent =
        message;


    authMessage.className =
        "auth-message";


    if (type) {

        authMessage.classList.add(
            type
        );

    }

}


/*==================================================
CLEAR MESSAGE
==================================================*/

function clearMessage() {

    if (!authMessage) {
        return;
    }


    authMessage.textContent =
        "";


    authMessage.className =
        "auth-message";

}


/*==================================================
SHOW FORM
==================================================*/

function showForm(
    form
) {

    const forms = [

        loginForm,

        signupForm,

        forgotPasswordForm

    ];


    forms.forEach(
        function(item) {

            if (!item) {
                return;
            }


            item.classList.remove(
                "active-form"
            );

        }
    );


    if (verificationPanel) {

        verificationPanel.classList.remove(
            "active-form"
        );

        verificationPanel.style.display =
            "none";

    }


    if (form) {

        form.classList.add(
            "active-form"
        );

        form.style.display =
            "";

    }

}


/*==================================================
LOGIN FORM
==================================================*/

function showLoginForm() {

    showForm(
        loginForm
    );


    if (authTitle) {

        authTitle.textContent =
            "Welcome Back";

    }


    if (authSubtitle) {

        authSubtitle.textContent =
            "Login to your SmartBazaar account";

    }


    clearMessage();

}


/*==================================================
SIGNUP FORM
==================================================*/

function showSignupForm() {

    showForm(
        signupForm
    );


    if (authTitle) {

        authTitle.textContent =
            "Create Account";

    }


    if (authSubtitle) {

        authSubtitle.textContent =
            "Create your SmartBazaar account";

    }


    clearMessage();

}


/*==================================================
FORGOT PASSWORD FORM
==================================================*/

function showForgotPasswordForm() {

    showForm(
        forgotPasswordForm
    );


    if (authTitle) {

        authTitle.textContent =
            "Forgot Password?";

    }


    if (authSubtitle) {

        authSubtitle.textContent =
            "Reset your SmartBazaar password";

    }


    clearMessage();

}


/*==================================================
PASSWORD SHOW / HIDE
==================================================*/

function setupPasswordToggle(
    button,
    input
) {

    if (!button || !input) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            const isPassword =
                input.type === "password";


            input.type =
                isPassword
                    ? "text"
                    : "password";


            const icon =
                button.querySelector("i");


            if (icon) {

                icon.className =
                    isPassword
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye";

            }


            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

}


/*==================================================
INITIALIZE PASSWORD TOGGLES
==================================================*/

setupPasswordToggle(
    toggleLoginPassword,
    loginPassword
);


setupPasswordToggle(
    toggleSignupPassword,
    signupPassword
);


setupPasswordToggle(
    toggleConfirmPassword,
    signupConfirmPassword
);


/*==================================================
EMAIL VALIDATION
==================================================*/

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


/*==================================================
USERNAME VALIDATION
==================================================*/

function isValidUsername(
    username
) {

    return /^[a-zA-Z0-9_.]{3,20}$/
        .test(
            username
        );

}


/*==================================================
PASSWORD STRENGTH
==================================================*/

function getPasswordStrength(
    password
) {

    let score = 0;


    if (
        password.length >= 8
    ) {

        score++;

    }


    if (
        /[a-z]/.test(password)
    ) {

        score++;

    }


    if (
        /[A-Z]/.test(password)
    ) {

        score++;

    }


    if (
        /[0-9]/.test(password)
    ) {

        score++;

    }


    if (
        /[^A-Za-z0-9]/.test(password)
    ) {

        score++;

    }


    return score;

}


/*==================================================
UPDATE PASSWORD STRENGTH UI
==================================================*/

function updatePasswordStrength() {

    if (
        !signupPassword ||
        !passwordStrengthBar ||
        !passwordStrengthText
    ) {

        return;

    }


    const password =
        signupPassword.value;


    if (!password) {

        passwordStrengthBar.style.width =
            "0%";


        passwordStrengthText.textContent =
            "Password strength";

        return;

    }


    const score =
        getPasswordStrength(
            password
        );


    const percentages = [

        0,

        20,

        40,

        60,

        80,

        100

    ];


    passwordStrengthBar.style.width =
        percentages[score] + "%";


    if (score <= 2) {

        passwordStrengthText.textContent =
            "Weak password";

    }
    else if (score === 3) {

        passwordStrengthText.textContent =
            "Medium password";

    }
    else if (score === 4) {

        passwordStrengthText.textContent =
            "Strong password";

    }
    else {

        passwordStrengthText.textContent =
            "Very strong password";

    }

}


if (signupPassword) {

    signupPassword.addEventListener(
        "input",
        updatePasswordStrength
    );

}


/*==================================================
BUTTON LOADING
==================================================*/

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.disabled =
            true;


        button.dataset.originalText =
            button.innerHTML;


        button.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                ${text}
            </span>

        `;

    }
    else {

        button.disabled =
            false;


        if (
            button.dataset.originalText
        ) {

            button.innerHTML =
                button.dataset.originalText;

        }

    }

}


/*==================================================
FIREBASE ERROR MESSAGE
==================================================*/

function firebaseErrorMessage(
    error
) {

    const code =
        error?.code || "";


    switch (code) {

        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/user-not-found":

            return "No account exists with this email.";


        case "auth/wrong-password":

            return "Incorrect password.";


        case "auth/invalid-credential":

            return "Incorrect email or password.";


        case "auth/email-already-in-use":

            return "An account already exists with this email.";


        case "auth/weak-password":

            return "Password is too weak. Use at least 8 characters.";


        case "auth/user-disabled":

            return "This account has been disabled.";


        case "auth/too-many-requests":

            return "Too many attempts. Please wait and try again.";


        case "auth/network-request-failed":

            return "Network error. Please check your internet connection.";


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/popup-blocked":

            return "Your browser blocked the Google sign-in window.";


        case "auth/operation-not-allowed":

            return "This login method is not enabled in Firebase.";


        default:

            return (
                error?.message ||
                "Something went wrong. Please try again."
            );

    }

}


/*==================================================
SAVE USER TO REALTIME DATABASE
==================================================*/

async function createUserRecord(
    user,
    name,
    username
) {

    if (!user) {
        return;
    }


    const userRef =
        ref(
            database,
            "users/" +
            user.uid
        );


    const snapshot =
        await get(
            userRef
        );


    if (snapshot.exists()) {

        return;

    }


    await set(
        userRef,
        {

            name:
                name ||
                user.displayName ||
                "SmartBazaar User",

            username:
                username ||
                "",

            email:
                user.email ||
                "",

            photoURL:
                user.photoURL ||
                "",

            createdAt:
                Date.now(),

            updatedAt:
                Date.now(),

            stats: {

                orders: 0,

                products: 0,

                projects: 0,

                downloads: 0

            },

            wallet: {

                balance: 0

            }

        }
    );

}


/*==================================================
UPDATE EXISTING GOOGLE USER
==================================================*/

async function updateGoogleUserRecord(
    user
) {

    if (!user) {
        return;
    }


    const userRef =
        ref(
            database,
            "users/" +
            user.uid
        );


    const snapshot =
        await get(
            userRef
        );


    if (!snapshot.exists()) {

        await createUserRecord(
            user,
            user.displayName ||
                "SmartBazaar User",
            ""
        );

        return;

    }


    const existing =
        snapshot.val();


    await update(
        userRef,
        {

            name:
                existing.name ||
                user.displayName ||
                "SmartBazaar User",

            email:
                user.email ||
                existing.email ||
                "",

            photoURL:
                user.photoURL ||
                existing.photoURL ||
                "",

            updatedAt:
                Date.now()

        }
    );

}


/*==================================================
LOGIN
==================================================*/

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            clearMessage();


            const email =
                loginEmail
                    ? loginEmail.value.trim()
                    : "";


            const password =
                loginPassword
                    ? loginPassword.value
                    : "";


            if (!email) {

                showMessage(
                    "Please enter your email."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password."
                );

                return;

            }


            try {

                setButtonLoading(
                    loginButton,
                    true,
                    "Logging in..."
                );


                /*==========================
                REMEMBER ME
                ==========================*/

                await setPersistence(
                    auth,
                    rememberMe &&
                    rememberMe.checked
                        ? browserLocalPersistence
                        : browserSessionPersistence
                );


                /*==========================
                FIREBASE LOGIN
                ==========================*/

                const result =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                currentUser =
                    result.user;


                /*==========================
                EMAIL VERIFICATION
                ==========================*/

                if (
                    !currentUser.emailVerified
                ) {

                    showVerificationPanel(
                        currentUser
                    );

                    return;

                }


                /*==========================
                SUCCESS
                ==========================*/

                showMessage(
                    "Login successful. Opening your account...",
                    "success"
                );


                window.location.href =
                    "account.html";

            }
            catch(error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showMessage(
                    firebaseErrorMessage(
                        error
                    ),
                    "error"
                );

            }
            finally {

                setButtonLoading(
                    loginButton,
                    false
                );

            }

        }
    );

}


/*==================================================
SIGNUP
==================================================*/

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            clearMessage();


            const name =
                signupName
                    ? signupName.value.trim()
                    : "";


            const username =
                signupUsername
                    ? signupUsername.value
                        .trim()
                        .toLowerCase()
                    : "";


            const email =
                signupEmail
                    ? signupEmail.value
                        .trim()
                        .toLowerCase()
                    : "";


            const password =
                signupPassword
                    ? signupPassword.value
                    : "";


            const confirmPassword =
                signupConfirmPassword
                    ? signupConfirmPassword.value
                    : "";


            /*==========================
            NAME
            ==========================*/

            if (!name) {

                showMessage(
                    "Please enter your full name."
                );

                return;

            }


            if (name.length < 2) {

                showMessage(
                    "Your name is too short."
                );

                return;

            }


            /*==========================
            USERNAME
            ==========================*/

            if (!username) {

                showMessage(
                    "Please choose a username."
                );

                return;

            }


            if (
                !isValidUsername(
                    username
                )
            ) {

                showMessage(
                    "Username must be 3–20 characters and use only letters, numbers, dots or underscores."
                );

                return;

            }


            /*==========================
            EMAIL
            ==========================*/

            if (!email) {

                showMessage(
                    "Please enter your email."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            /*==========================
            PASSWORD
            ==========================*/

            if (
                password.length < 8
            ) {

                showMessage(
                    "Password must contain at least 8 characters."
                );

                return;

            }


            if (
                getPasswordStrength(
                    password
                ) < 3
            ) {

                showMessage(
                    "Please create a stronger password."
                );

                return;

            }


            /*==========================
            CONFIRM
            ==========================*/

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match."
                );

                return;

            }


            /*==========================
            TERMS
            ==========================*/

            if (
                !acceptTerms ||
                !acceptTerms.checked
            ) {

                showMessage(
                    "Please accept the Terms & Conditions and Privacy Policy."
                );

                return;

            }


            try {

                setButtonLoading(
                    signupButton,
                    true,
                    "Creating account..."
                );


                /*==========================
                CREATE FIREBASE USER
                ==========================*/

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                currentUser =
                    result.user;


                /*==========================
                UPDATE AUTH PROFILE
                ==========================*/

                await updateProfile(
                    currentUser,
                    {

                        displayName:
                            name

                    }
                );


                /*==========================
                CREATE DATABASE RECORD
                ==========================*/

                await createUserRecord(
                    currentUser,
                    name,
                    username
                );


                /*==========================
                SEND VERIFICATION EMAIL
                ==========================*/

                await sendEmailVerification(
                    currentUser
                );


                /*==========================
                SHOW VERIFICATION
                ==========================*/

                showVerificationPanel(
                    currentUser
                );


                showMessage(
                    "Account created successfully. Please verify your email.",
                    "success"
                );

            }
            catch(error) {

                console.error(
                    "SIGNUP ERROR:",
                    error
                );


                showMessage(
                    firebaseErrorMessage(
                        error
                    ),
                    "error"
                );

            }
            finally {

                setButtonLoading(
                    signupButton,
                    false
                );

            }

        }
    );

}


/*==================================================
FORGOT PASSWORD
==================================================*/

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            clearMessage();


            const email =
                forgotEmail
                    ? forgotEmail.value.trim()
                    : "";


            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            try {

                setButtonLoading(
                    resetPasswordButton,
                    true,
                    "Sending..."
                );


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showMessage(
                    "Password reset email sent. Please check your inbox.",
                    "success"
                );


                if (forgotEmail) {

                    forgotEmail.value =
                        "";

                }

            }
            catch(error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                showMessage(
                    firebaseErrorMessage(
                        error
                    ),
                    "error"
                );

            }
            finally {

                setButtonLoading(
                    resetPasswordButton,
                    false
                );

            }

        }
    );

}


/*==================================================
GOOGLE LOGIN
==================================================*/

async function googleLogin() {

    clearMessage();


    try {

        setButtonLoading(
            googleLoginButton,
            true,
            "Connecting..."
        );


        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        currentUser =
            result.user;


        await updateGoogleUserRecord(
            currentUser
        );


        window.location.href =
            "account.html";

    }
    catch(error) {

        console.error(
            "GOOGLE LOGIN ERROR:",
            error
        );


        showMessage(
            firebaseErrorMessage(
                error
            )
        );

    }
    finally {

        setButtonLoading(
            googleLoginButton,
            false
        );

    }

}


/*==================================================
GOOGLE SIGNUP
==================================================*/

async function googleSignup() {

    clearMessage();


    try {

        setButtonLoading(
            googleSignupButton,
            true,
            "Connecting..."
        );


        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        currentUser =
            result.user;


        await updateGoogleUserRecord(
            currentUser
        );


        window.location.href =
            "account.html";

    }
    catch(error) {

        console.error(
            "GOOGLE SIGNUP ERROR:",
            error
        );


        showMessage(
            firebaseErrorMessage(
                error
            )
        );

    }
    finally {

        setButtonLoading(
            googleSignupButton,
            false
        );

    }

}


/*==================================================
GOOGLE BUTTON EVENTS
==================================================*/

if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        googleLogin
    );

}


if (googleSignupButton) {

    googleSignupButton.addEventListener(
        "click",
        googleSignup
    );

}


/*==================================================
SHOW VERIFICATION PANEL
==================================================*/

function showVerificationPanel(
    user
) {

    const forms = [

        loginForm,

        signupForm,

        forgotPasswordForm

    ];


    forms.forEach(
        function(form) {

            if (!form) {
                return;
            }


            form.classList.remove(
                "active-form"
            );


            form.style.display =
                "none";

        }
    );


    if (verificationPanel) {

        verificationPanel.style.display =
            "block";


        verificationPanel.classList.add(
            "active-form"
        );

    }


    if (authTitle) {

        authTitle.textContent =
            "Verify Your Email";

    }


    if (authSubtitle) {

        authSubtitle.textContent =
            user?.email ||
            "Check your email";

    }

}


/*==================================================
RESEND VERIFICATION
==================================================*/

if (resendVerificationButton) {

    resendVerificationButton.addEventListener(
        "click",
        async function() {

            if (!currentUser) {

                showMessage(
                    "Please login again."
                );

                return;

            }


            try {

                setButtonLoading(
                    resendVerificationButton,
                    true,
                    "Sending..."
                );


                await sendEmailVerification(
                    currentUser
                );


                showMessage(
                    "Verification email sent again.",
                    "success"
                );

            }
            catch(error) {

                console.error(
                    "VERIFICATION ERROR:",
                    error
                );


                showMessage(
                    firebaseErrorMessage(
                        error
                    )
                );

            }
            finally {

                setButtonLoading(
                    resendVerificationButton,
                    false
                );

            }

        }
    );

}


/*==================================================
VERIFICATION LOGOUT
==================================================*/

if (verificationLogoutButton) {

    verificationLogoutButton.addEventListener(
        "click",
        async function() {

            try {

                await signOut(
                    auth
                );


                currentUser =
                    null;


                showLoginForm();

            }
            catch(error) {

                console.error(
                    "VERIFICATION LOGOUT ERROR:",
                    error
                );

            }

        }
    );

}


/*==================================================
SHOW SIGNUP
==================================================*/

if (showSignupButton) {

    showSignupButton.addEventListener(
        "click",
        function() {

            showSignupForm();

        }
    );

}


/*==================================================
SHOW LOGIN
==================================================*/

if (showLoginButton) {

    showLoginButton.addEventListener(
        "click",
        function() {

            showLoginForm();

        }
    );

}


/*==================================================
FORGOT PASSWORD
==================================================*/

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        function() {

            if (
                loginEmail &&
                loginEmail.value.trim()
            ) {

                if (forgotEmail) {

                    forgotEmail.value =
                        loginEmail.value.trim();

                }

            }


            showForgotPasswordForm();

        }
    );

}


/*==================================================
BACK TO LOGIN
==================================================*/

if (backToLoginButton) {

    backToLoginButton.addEventListener(
        "click",
        function() {

            showLoginForm();

        }
    );

}


/*==================================================
BACK TO HOME
==================================================*/

if (authBackButton) {

    authBackButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );

}


/*==================================================
TERMS BUTTON
==================================================*/

const termsButton =
    document.getElementById(
        "terms-button"
    );


if (termsButton) {

    termsButton.addEventListener(
        "click",
        function() {

            alert(
                "Terms & Conditions page will be connected here."
            );

        }
    );

}


/*==================================================
PRIVACY BUTTON
==================================================*/

const privacyButton =
    document.getElementById(
        "privacy-button"
    );


if (privacyButton) {

    privacyButton.addEventListener(
        "click",
        function() {

            alert(
                "Privacy Policy page will be connected here."
            );

        }
    );

}


/*==================================================
AUTH STATE
==================================================*/

onAuthStateChanged(
    auth,
    async function(user) {

        if (user) {

            currentUser =
                user;


            console.log(
                "Authenticated user:",
                user.uid
            );


            /*
             * IMPORTANT:
             *
             * If user is already verified,
             * do not keep showing login page.
             */

            if (
                user.emailVerified
            ) {

                /*
                 * We only redirect when
                 * the user is actually on
                 * the authentication page.
                 */

                const currentPage =
                    window.location.pathname
                        .split("/")
                        .pop();


                if (
                    currentPage ===
                    "login.html"
                ) {

                    window.location.href =
                        "account.html";

                }

            }
            else {

                /*
                 * Google accounts normally
                 * do not require this panel.
                 *
                 * Email/password users do.
                 */

                if (
                    user.providerData &&
                    user.providerData.some(
                        provider =>
                            provider.providerId ===
                            "password"
                    )
                ) {

                    showVerificationPanel(
                        user
                    );

                }

            }

        }
        else {

            currentUser =
                null;


            /*
             * Stay on login page.
             *
             * Do not redirect repeatedly.
             */

            showLoginForm();

        }

    }
);


/*==================================================
INITIAL FORM
==================================================*/

showLoginForm();


/*==================================================
CONSOLE
==================================================*/

console.log(
    "SmartBazaar Pro authentication system loaded."
);
