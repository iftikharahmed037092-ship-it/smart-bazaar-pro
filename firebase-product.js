/*==================================================
SMARTBAZAAR PRO
FIRESTORE PRODUCT DATABASE
PART 19.4
==================================================*/

import {

    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy

} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


import {
    db
} from "./firebase-config.js";


/*==================================================
PRODUCTS COLLECTION
==================================================*/

const productsCollection =
    collection(
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


    const document =
        await addDoc(
            productsCollection,
            productData
        );


    return document.id;

}


/*==================================================
GET ALL PRODUCTS
==================================================*/

export async function getProducts() {

    const snapshot =
        await getDocs(
            productsCollection
        );


    if (snapshot.empty) {

        return null;

    }


    const products = {};


    snapshot.forEach(
        document => {

            products[document.id] = {

                id:
                    document.id,

                ...document.data()

            };

        }
    );


    return products;

}


/*==================================================
GET PRODUCTS ARRAY
==================================================*/

export async function getProductsArray() {

    const snapshot =
        await getDocs(
            productsCollection
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

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


    const productReference =
        doc(
            db,
            "products",
            productId
        );


    const snapshot =
        await getDoc(
            productReference
        );


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

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


    const productReference =
        doc(
            db,
            "products",
            productId
        );


    await updateDoc(
        productReference,
        productData
    );


    return true;

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


    const productReference =
        doc(
            db,
            "products",
            productId
        );


    await deleteDoc(
        productReference
    );


    return true;

}


/*==================================================
GET PUBLISHED PRODUCTS
==================================================*/

export async function getPublishedProducts() {

    const snapshot =
        await getDocs(
            productsCollection
        );


    if (snapshot.empty) {

        return [];

    }


    const products =
        snapshot.docs
            .map(
                document => ({

                    id:
                        document.id,

                    ...document.data()

                })
            )
            .filter(
                product =>
                    String(
                        product.status || ""
                    ).toLowerCase()
                    ===
                    "published"
            );


    return products;

}


/*==================================================
EXPORT
==================================================*/

export {
    productsCollection
};
