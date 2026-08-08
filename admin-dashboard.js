/*==================================================
SMARTBAZAAR PRO
PART 20.0.2
ADMIN DASHBOARD JAVASCRIPT
==================================================*/


import { auth }
from "./firebase-config.js";


import {

    onAuthStateChanged,
    signOut

}
from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";



/*==============================
ELEMENTS
==============================*/

const logoutBtn =
document.querySelector(
".admin-header button"
);



const menuLinks =
document.querySelectorAll(
".admin-menu a"
);



/*==============================
ADMIN AUTH CHECK
==============================*/


onAuthStateChanged(
auth,
(user)=>{


    if(user){


        console.log(
            "Admin Login:",
            user.email
        );


    }
    else{


        console.log(
            "No Admin Login"
        );


        // بعد میں Login Page لگائیں گے
        // window.location.href="admin-login.html";


    }


});



/*==============================
LOGOUT SYSTEM
==============================*/


if(logoutBtn){


logoutBtn.addEventListener(
"click",
async()=>{


    await signOut(auth);


    window.location.href =
    "admin-login.html";


});


}




/*==============================
ACTIVE MENU
==============================*/


menuLinks.forEach(
link=>{


    link.addEventListener(
    "click",
    ()=>{


        menuLinks.forEach(
        item=>{

            item.classList.remove(
                "active"
            );

        });


        link.classList.add(
            "active"
        );


    });


});
