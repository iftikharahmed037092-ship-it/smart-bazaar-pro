/*==================================================
SMARTBAZAAR PRO
FIREBASE PRODUCT DATABASE
==================================================*/

import {
    getDatabase,
    ref,
    push,
    set,
    get,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    app
} from "./firebase-config.js";


/*==================================================
DATABASE
==================================================*/

const db = getDatabase(app);


/*==================================================
PRODUCTS REFERENCE
==================================================*/

const productsRef =
    ref(db, "products");


/*==================================================
ADD PRODUCT
==================================================*/

export async function addProduct(productData) {

    const newProductRef =
        push(productsRef);

    await set(
        newProductRef,
        productData
    );

    return newProductRef.key;

}


/*==================================================
GET PRODUCTS
==================================================*/

export async function getProducts() {

    const snapshot =
        await get(productsRef);

    if (!snapshot.exists()) {

        return null;

    }

    return snapshot.val();

}


/*==================================================
GET SINGLE PRODUCT
==================================================*/

export async function getProduct(productId) {

    if (!productId) {

        return null;

    }

    const productRef =
        ref(
            db,
            `products/${productId}`
        );

    const snapshot =
        await get(productRef);

    if (!snapshot.exists()) {

        return null;

    }

    return snapshot.val();

}


/*==================================================
UPDATE PRODUCT
==================================================*/

export async function updateProduct(
    productId,
    productData
) {

    if (!productId) {

        throw new Error(
            "Product ID is missing."
        );

    }

    const productRef =
        ref(
            db,
            `products/${productId}`
        );

    await update(
        productRef,
        productData
    );

}


/*==================================================
DELETE PRODUCT
==================================================*/

export async function deleteProduct(
    productId
) {

    if (!productId) {

        throw new Error(
            "Product ID is missing."
        );

    }

    const productRef =
        ref(
            db,
            `products/${productId}`
        );

    await remove(
        productRef
    );

}
