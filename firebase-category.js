/*==================================================
SMARTBAZAAR PRO
PART 21.1
FIREBASE CATEGORY FUNCTIONS
==================================================*/

import {
    database
} from "./firebase-config.js";


import {
    ref,
    push,
    set,
    get,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
CATEGORY DATABASE PATH
==================================================*/

const CATEGORY_PATH =
    "categories";


/*==================================================
ADD CATEGORY
==================================================*/

async function addCategory(categoryData) {

    if (!categoryData) {

        throw new Error(
            "Category data is missing."
        );

    }


    const categoriesRef =
        ref(
            database,
            CATEGORY_PATH
        );


    const newCategoryRef =
        push(
            categoriesRef
        );


    const categoryId =
        newCategoryRef.key;


    const data = {

        name:
            categoryData.name ||
            "",

        icon:
            categoryData.icon ||
            "fa-solid fa-tag",

        color:
            categoryData.color ||
            "#2e7d32",

        link:
            categoryData.link ||
            "#",

        status:
            categoryData.status ||
            "active",

        createdAt:
            categoryData.createdAt ||
            Date.now()

    };


    await set(
        newCategoryRef,
        data
    );


    console.log(
        "Category added:",
        categoryId
    );


    return categoryId;

}


/*==================================================
GET ALL CATEGORIES
==================================================*/

async function getCategories() {

    const categoriesRef =
        ref(
            database,
            CATEGORY_PATH
        );


    const snapshot =
        await get(
            categoriesRef
        );


    if (!snapshot.exists()) {

        return {};

    }


    return snapshot.val();

}


/*==================================================
GET SINGLE CATEGORY
==================================================*/

async function getCategory(
    categoryId
) {

    if (!categoryId) {

        throw new Error(
            "Category ID is missing."
        );

    }


    const categoryRef =
        ref(
            database,
            `${CATEGORY_PATH}/${categoryId}`
        );


    const snapshot =
        await get(
            categoryRef
        );


    if (!snapshot.exists()) {

        return null;

    }


    return snapshot.val();

}


/*==================================================
UPDATE CATEGORY
==================================================*/

async function updateCategory(
    categoryId,
    categoryData
) {

    if (!categoryId) {

        throw new Error(
            "Category ID is missing."
        );

    }


    if (!categoryData) {

        throw new Error(
            "Category data is missing."
        );

    }


    const categoryRef =
        ref(
            database,
            `${CATEGORY_PATH}/${categoryId}`
        );


    const data = {

        name:
            categoryData.name ||
            "",

        icon:
            categoryData.icon ||
            "fa-solid fa-tag",

        color:
            categoryData.color ||
            "#2e7d32",

        link:
            categoryData.link ||
            "#",

        status:
            categoryData.status ||
            "active"

    };


    await update(
        categoryRef,
        data
    );


    console.log(
        "Category updated:",
        categoryId
    );


    return true;

}


/*==================================================
DELETE CATEGORY
==================================================*/

async function deleteCategory(
    categoryId
) {

    if (!categoryId) {

        throw new Error(
            "Category ID is missing."
        );

    }


    const categoryRef =
        ref(
            database,
            `${CATEGORY_PATH}/${categoryId}`
        );


    await remove(
        categoryRef
    );


    console.log(
        "Category deleted:",
        categoryId
    );


    return true;

}


/*==================================================
EXPORT
==================================================*/

export {

    addCategory,

    getCategories,

    getCategory,

    updateCategory,

    deleteCategory

};
