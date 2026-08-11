/*==================================================
SMARTBAZAAR PRO
PART 19.2
FIREBASE BANNER FUNCTIONS
==================================================*/


/*==============================
FIREBASE DATABASE
==============================*/

import {
    database
} from "./firebase-config.js";


/*==============================
FIREBASE REALTIME DATABASE
==============================*/

import {
    ref,
    push,
    set,
    get,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==============================
DATABASE PATH
==============================*/

const bannerRef =
    ref(database, "banners");


/*==================================================
ADD BANNER
==================================================*/

export async function addBanner(data){

    const newBanner =
        push(bannerRef);

    await set(
        newBanner,
        data
    );

    return newBanner.key;

}


/*==================================================
GET ALL BANNERS
==================================================*/

export async function getBanners(){

    const snapshot =
        await get(bannerRef);


    if(snapshot.exists()){

        return snapshot.val();

    }


    return {};

}


/*==================================================
GET SINGLE BANNER
==================================================*/

export async function getBanner(id){

    const banner =
        ref(
            database,
            "banners/" + id
        );


    const snapshot =
        await get(banner);


    if(snapshot.exists()){

        return snapshot.val();

    }


    return null;

}


/*==================================================
UPDATE BANNER
==================================================*/

export async function updateBanner(
    id,
    data
){

    const banner =
        ref(
            database,
            "banners/" + id
        );


    await update(
        banner,
        data
    );

}


/*==================================================
DELETE BANNER
==================================================*/

export async function deleteBanner(id){

    const banner =
        ref(
            database,
            "banners/" + id
        );


    await remove(
        banner
    );

}
