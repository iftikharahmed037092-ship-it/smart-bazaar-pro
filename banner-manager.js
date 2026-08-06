/*==================================================
SMARTBAZAAR PRO
PART 20.1
BANNER MANAGER
STRUCTURE + VARIABLES + FIREBASE
==================================================*/

import {

    addBanner,
    getBanners,
    updateBanner,
    deleteBanner

} from "./firebase-banner.js";

/*==============================
ELEMENTS
==============================*/

const bannerForm = document.getElementById("bannerForm");

const bannerTitle = document.getElementById("bannerTitle");

const bannerSubtitle = document.getElementById("bannerSubtitle");

const bannerButton = document.getElementById("bannerButton");

const bannerImage = document.getElementById("bannerImage");

const bannerPreview = document.getElementById("bannerPreview");

const bannerList = document.getElementById("bannerList");

/*==============================
GLOBAL VARIABLES
==============================*/

let editMode = false;

let editBannerId = null;

let banners = {};
