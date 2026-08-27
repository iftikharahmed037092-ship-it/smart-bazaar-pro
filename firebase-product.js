/*==================================================
SMARTBAZAAR PRO
FIREBASE PRODUCT DATABASE
FEATURE: PRODUCT DATABASE
==================================================*/


/*==================================================
FIREBASE REALTIME DATABASE
==================================================*/

import {

    getDatabase,
    ref,
    push,
    set,
    get,
    remove,
    update

} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
FIREBASE CONFIG
==================================================*/

import {
    app
} from "./firebase-config.js";


/*==================================================
DATABASE
==================================================*/

const db =
    getDatabase(
        app
    );


/*==================================================
PRODUCTS REFERENCE
==================================================*/

const productsRef =
    ref(
        db,
        "products"
    );


/*==================================================
ADD PRODUCT
==================================================*/

export async function addProduct(
    productData
) {

    if (!productData) {

        throw new Error(
            "Product data is missing."
        );

    }


    const newProductRef =
        push(
            productsRef
        );


    const data = {

        ...productData,

        createdAt:
            productData.createdAt ||
            Date.now()

    };


    await set(
        newProductRef,
        data
    );


    return newProductRef.key;

}


/*==================================================
GET PRODUCTS
==================================================*/

export async function getProducts() {

    const snapshot =
        await get(
            productsRef
        );


    if (
        !snapshot.exists()
    ) {

        return {};

    }


    const data =
        snapshot.val();


    return Object.entries(
        data
    ).map(
        ([id, product]) => ({

            id,

            ...product

        })
    );

}


/*==================================================
GET SINGLE PRODUCT
==================================================*/

export async function getProduct(
    productId
) {

    if (!productId) {

        return null;

    }


    const productRef =
        ref(
            db,
            `products/${productId}`
        );


    const snapshot =
        await get(
            productRef
        );


    if (
        !snapshot.exists()
    ) {

        return null;

    }


    return {

        id: productId,

        ...snapshot.val()

    };

}


/*==================================================
GET PUBLISHED PRODUCTS
==================================================*/

export async function getPublishedProducts() {

    const products =
        await getProducts();


    if (
        !products ||
        !products.length
    ) {

        return [];

    }


    return products.filter(
        product => {

            const status =
                String(
                    product.status ||
                    ""
                )
                .toLowerCase()
                .trim();


            const published =
                product.published === true;


            const visible =
                product.productVisible !== false;


            return (
                (
                    status ===
                    "published"
                )
                ||
                published
            )
            &&
            visible;

        }
    );

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


    if (!productData) {

        throw new Error(
            "Product data is missing."
        );

    }


    const productRef =
        ref(
            db,
            `products/${productId}`
        );


    await update(
        productRef,
        {

            ...productData,

            updatedAt:
                Date.now()

        }
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


/*==================================================
DUPLICATE PRODUCT
==================================================*/

export async function duplicateProduct(
    productId
) {

    const product =
        await getProduct(
            productId
        );


    if (!product) {

        throw new Error(
            "Product not found."
        );

    }


    const {
        id,
        ...copy
    } = product;


    copy.productName =
        `${copy.productName || "Product"} Copy`;


    copy.status =
        "draft";


    copy.published =
        false;


    copy.createdAt =
        Date.now();


    copy.updatedAt =
        Date.now();


    const newProductRef =
        push(
            productsRef
        );


    await set(
        newProductRef,
        copy
    );


    return newProductRef.key;

}
