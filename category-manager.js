/*==================================================
SMARTBAZAAR PRO
PART 21.2
CATEGORY MANAGER JAVASCRIPT
==================================================*/


/*==================================================
FIREBASE CATEGORY FUNCTIONS
==================================================*/

import {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "./firebase-category.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const categoryForm =
    document.getElementById("categoryForm");


const categoryName =
    document.getElementById("categoryName");


const categoryIcon =
    document.getElementById("categoryIcon");


const categoryColor =
    document.getElementById("categoryColor");


const categoryColorText =
    document.getElementById("categoryColorText");


const categoryStatus =
    document.getElementById("categoryStatus");


const saveCategoryBtn =
    document.getElementById("saveCategoryBtn");


const categoryMessage =
    document.getElementById("categoryMessage");


const categoryList =
    document.getElementById("categoryList");


/*==================================================
EDITING CATEGORY
==================================================*/

let editingCategoryId = null;


/*==================================================
CHECK REQUIRED ELEMENTS
==================================================*/

if (!categoryForm) {

    console.error(
        "ERROR: #categoryForm not found."
    );

}


if (!categoryList) {

    console.error(
        "ERROR: #categoryList not found."
    );

}


/*==================================================
SHOW MESSAGE
==================================================*/

function showMessage(
    message,
    type = ""
) {

    if (!categoryMessage) {

        return;

    }


    categoryMessage.textContent =
        message;


    categoryMessage.className =
        "category-message";


    if (type) {

        categoryMessage.classList.add(
            type
        );

    }

}


/*==================================================
COLOR VALIDATION
==================================================*/

function isValidColor(
    color
) {

    return /^#[0-9A-Fa-f]{6}$/.test(
        color
    );

}


/*==================================================
SYNC COLOR PICKER
==================================================*/

if (categoryColor) {

    categoryColor.addEventListener(
        "input",
        function() {

            if (categoryColorText) {

                categoryColorText.value =
                    this.value
                    .toUpperCase();

            }

        }
    );

}


/*==================================================
SYNC COLOR TEXT
==================================================*/

if (categoryColorText) {

    categoryColorText.addEventListener(
        "input",
        function() {

            let value =
                this.value.trim();


            if (
                value &&
                !value.startsWith("#")
            ) {

                value =
                    "#" + value;

            }


            if (
                isValidColor(value)
            ) {

                categoryColor.value =
                    value;

            }

        }
    );

}


/*==================================================
GET FORM DATA
==================================================*/

function getFormData() {

    const name =
        categoryName
            ? categoryName.value.trim()
            : "";


    let icon =
        categoryIcon
            ? categoryIcon.value.trim()
            : "";


    let color =
        categoryColorText
            ? categoryColorText.value.trim()
            : "";


    const status =
        categoryStatus
            ? categoryStatus.value
            : "active";


    if (
        color &&
        !color.startsWith("#")
    ) {

        color =
            "#" + color;

    }


    if (!icon) {

        icon =
            "fa-solid fa-tag";

    }


    return {

        name,
        icon,
        color,
        status

    };

}


/*==================================================
RESET FORM
==================================================*/

function resetCategoryForm() {

    editingCategoryId =
        null;


    if (categoryForm) {

        categoryForm.reset();

    }


    if (categoryColor) {

        categoryColor.value =
            "#e8f5e9";

    }


    if (categoryColorText) {

        categoryColorText.value =
            "#e8f5e9";

    }


    if (categoryStatus) {

        categoryStatus.value =
            "active";

    }


    if (categoryIcon) {

        categoryIcon.value =
            "";

    }


    if (saveCategoryBtn) {

        saveCategoryBtn.innerHTML = `

            <i class="fa-solid fa-plus"></i>

            Add Category

        `;

    }

}


/*==================================================
START EDIT MODE
==================================================*/

function startEditCategory(
    id,
    category
) {

    editingCategoryId =
        id;


    if (categoryName) {

        categoryName.value =
            category.name || "";

    }


    if (categoryIcon) {

        categoryIcon.value =
            category.icon || "";

    }


    if (categoryColor) {

        categoryColor.value =
            category.color ||
            "#e8f5e9";

    }


    if (categoryColorText) {

        categoryColorText.value =
            category.color ||
            "#e8f5e9";

    }


    if (categoryStatus) {

        categoryStatus.value =
            category.status ||
            "active";

    }


    if (saveCategoryBtn) {

        saveCategoryBtn.innerHTML = `

            <i class="fa-solid fa-pen"></i>

            Update Category

        `;

    }


    showMessage(
        "Editing category. Update the information and save.",
        "success"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/*==================================================
CATEGORY FORM SUBMIT
==================================================*/

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data =
                getFormData();


            /*==============================
            NAME REQUIRED
            ==============================*/

            if (!data.name) {

                showMessage(
                    "Please enter category name.",
                    "error"
                );

                return;

            }


            /*==============================
            COLOR REQUIRED
            ==============================*/

            if (
                !data.color ||
                !isValidColor(
                    data.color
                )
            ) {

                showMessage(
                    "Please enter a valid color such as #e8f5e9.",
                    "error"
                );

                return;

            }


            try {

                /*==========================
                DISABLE BUTTON
                ==========================*/

                if (saveCategoryBtn) {

                    saveCategoryBtn.disabled =
                        true;


                    saveCategoryBtn.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Saving...

                    `;

                }


                /*==========================
                UPDATE
                ==========================*/

                if (editingCategoryId) {

                    await updateCategory(

                        editingCategoryId,

                        {

                            name:
                                data.name,

                            icon:
                                data.icon,

                            color:
                                data.color,

                            status:
                                data.status

                        }

                    );


                    showMessage(
                        "Category updated successfully.",
                        "success"
                    );

                }


                /*==========================
                ADD
                ==========================*/

                else {

                    const categoryId =
                        await addCategory(

                            {

                                name:
                                    data.name,

                                icon:
                                    data.icon,

                                color:
                                    data.color,

                                link:
                                    "#",

                                status:
                                    data.status

                            }

                        );


                    console.log(
                        "New category ID:",
                        categoryId
                    );


                    showMessage(
                        "Category added successfully.",
                        "success"
                    );

                }


                /*==========================
                RESET
                ==========================*/

                resetCategoryForm();


                /*==========================
                RELOAD LIST
                ==========================*/

                await loadCategories();

            }


            catch(error) {

                console.error(
                    "CATEGORY ERROR:",
                    error
                );


                showMessage(

                    error.message ||
                    "Could not save category.",

                    "error"

                );

            }


            finally {

                if (saveCategoryBtn) {

                    saveCategoryBtn.disabled =
                        false;

                }

            }

        }
    );

}


/*==================================================
LOAD CATEGORIES
==================================================*/

async function loadCategories() {

    if (!categoryList) {

        return;

    }


    categoryList.innerHTML = `

        <p class="empty-message">

            Loading categories...

        </p>

    `;


    try {

        const categories =
            await getCategories();


        categoryList.innerHTML =
            "";


        /*==============================
        NO CATEGORIES
        ==============================*/

        if (
            !categories ||
            Object.keys(categories).length === 0
        ) {

            categoryList.innerHTML = `

                <p class="empty-message">

                    No categories added yet.

                </p>

            `;

            return;

        }


        /*==============================
        CREATE CATEGORY ITEMS
        ==============================*/

        Object.entries(
            categories
        )
        .forEach(
            function([
                id,
                category
            ]) {

                createCategoryItem(
                    id,
                    category
                );

            }
        );

    }


    catch(error) {

        console.error(
            "LOAD CATEGORIES ERROR:",
            error
        );


        categoryList.innerHTML = `

            <p class="empty-message">

                Unable to load categories.

            </p>

        `;

    }

}


/*==================================================
CREATE CATEGORY ITEM
==================================================*/

function createCategoryItem(
    id,
    category
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "category-manager-item";


    const color =
        isValidColor(
            category.color || ""
        )
            ? category.color
            : "#e8f5e9";


    const icon =
        category.icon ||
        "fa-solid fa-tag";


    const status =
        category.status ||
        "active";


    item.innerHTML = `

        <div
            class="category-item-preview"
            style="background:${escapeAttribute(color)}">

            <i
                class="${escapeAttribute(icon)}">
            </i>

        </div>


        <div class="category-item-info">

            <h3>

                ${escapeHTML(
                    category.name ||
                    "Untitled Category"
                )}

            </h3>


            <p>

                <i
                    class="${escapeAttribute(icon)}">
                </i>

                ${escapeHTML(icon)}

            </p>


            <span
                class="category-status ${status === "active" ? "active" : "inactive"}">

                ${status === "active"
                    ? "Active"
                    : "Inactive"}

            </span>

        </div>


        <div class="category-item-color">

            <span
                class="color-preview"
                style="background:${escapeAttribute(color)}">
            </span>


            <small>

                ${escapeHTML(color)}

            </small>

        </div>


        <div class="category-item-actions">

            <button
                type="button"
                class="category-edit-btn"
                data-id="${escapeAttribute(id)}">

                <i class="fa-solid fa-pen"></i>

                Edit

            </button>


            <button
                type="button"
                class="category-delete-btn"
                data-id="${escapeAttribute(id)}">

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

        </div>

    `;


    categoryList.appendChild(
        item
    );


    /*==============================
    EDIT
    ==============================*/

    const editButton =
        item.querySelector(
            ".category-edit-btn"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            function() {

                startEditCategory(
                    id,
                    category
                );

            }
        );

    }


    /*==============================
    DELETE
    ==============================*/

    const deleteButton =
        item.querySelector(
            ".category-delete-btn"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            async function() {

                const confirmed =
                    confirm(

                        `Delete "${category.name || "this category"}"?`

                    );


                if (!confirmed) {

                    return;

                }


                try {

                    deleteButton.disabled =
                        true;


                    deleteButton.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Deleting...

                    `;


                    await deleteCategory(
                        id
                    );


                    showMessage(
                        "Category deleted successfully.",
                        "success"
                    );


                    await loadCategories();

                }


                catch(error) {

                    console.error(
                        "DELETE CATEGORY ERROR:",
                        error
                    );


                    showMessage(

                        error.message ||
                        "Could not delete category.",

                        "error"

                    );


                    deleteButton.disabled =
                        false;


                    deleteButton.innerHTML = `

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    `;

                }

            }
        );

    }

}


/*==================================================
ESCAPE HTML
==================================================*/

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*==================================================
ESCAPE ATTRIBUTE
==================================================*/

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/*==================================================
INITIAL LOAD
==================================================*/

loadCategories();
