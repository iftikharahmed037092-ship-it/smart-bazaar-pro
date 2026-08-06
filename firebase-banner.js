/*==================================================
SMARTBAZAAR PRO
PART 19.2
FIREBASE BANNER FUNCTIONS
==================================================*/

import { database } from "./firebase-config.js";

import {
    ref,
    push,
    set,
    get,
    child,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

/*==============================
DATABASE PATH
==============================*/

const bannerRef = ref(database, "banners");

/*==============================
ADD BANNER
==============================*/

export async function addBanner(data){

    const newBanner = push(bannerRef);

    await set(newBanner, data);

}

/*==============================
GET ALL BANNERS
==============================*/

export async function getBanners(){

    const snapshot = await get(child(ref(database), "banners"));

    if(snapshot.exists()){

        return snapshot.val();

    }

    return {};

}

/*==============================
UPDATE BANNER
==============================*/

export async function updateBanner(id,data){

    await update(ref(database,"banners/"+id),data);

}

/*==============================
DELETE BANNER
==============================*/

export async function deleteBanner(id){

    await remove(ref(database,"banners/"+id));

}
