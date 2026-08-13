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
COLOR INPUT SYNC
==================================================*/

if (categoryColor && categoryColorText) {


    categoryColor.addEventListener(
        "input",
        function() {

            categoryColorText.value =
                this.value;

        }
    );


    categoryColorText.addEventListener(
        "input",
        function() {

            let value =
                this.value.trim();


            if (
                /^#[0-9A-Fa-f]{6}$/.test(
                    value
                )
            ) {

                categoryColor.value =
                    value;

            }

        }
    );

}


/*==================================================
GET CATEGORY COLOR
==================================================*/

function getSelectedColor() {

    if (
        categoryColorText &&
        /^#[0-9A-Fa-f]{6}$/.test(
            categoryColorText.value.trim()
        )
    ) {

        return categoryColorText.value.trim();

    }


    if (categoryColor) {

        return categoryColor.value;

    }


    return "#e8f5e9";

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


    if (saveCategoryBtn) {

        saveCategoryBtn.innerHTML = `

            <i class="fa-solid fa-plus"></i>

            Add Category

        `;

    }

}


/*==================================================
SAVE / UPDATE CATEGORY
==================================================*/

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /*==============================
            GET VALUES
            ==============================*/

            const name =
                categoryName
                    ? categoryName.value.trim()
                    : "";


            const iconInput =
                categoryIcon
                    ? categoryIcon.value.trim()
                    : "";


            const color =
                getSelectedColor();


            const status =
                categoryStatus
                    ? categoryStatus.value
                    : "active";


            /*==============================
            NAME REQUIRED
            ==============================*/

            if (!name) {

                showMessage(
                    "Please enter category name.",
                    "error"
                );

                return;

            }


            /*==============================
            ICON
            ==============================*/

            const icon =
                iconInput ||
                "fa-solid fa-tag";


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
                FIREBASE DATA
                ==========================*/

                const categoryData = {

                    name:
                        name,

                    icon:
                        icon,

                    color:
                        color,

                    link:
                        "#",

                    status:
                        status,

                    createdAt:
                        Date.now()

                };


                /*==========================
                UPDATE
                ==========================*/

                if (editingCategoryId) {

                    await updateCategory(
                        editingCategoryId,
                        categoryData
                    );


                    showMessage(
                        "Category updated successfully!",
                        "success"
                    );

                }


                /*==========================
                ADD
                ==========================*/

                else {

                    const categoryId =
                        await addCategory(
                            categoryData
                        );


                    console.log(
                        "New Category ID:",
                        categoryId
                    );


                    showMessage(
                        "Category added successfully!",
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
                    "CATEGORY SAVE ERROR:",
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


                    if (editingCategoryId) {

                        saveCategoryBtn.innerHTML = `

                            <i class="fa-solid fa-plus"></i>

                            Add Category

                        `;

                    }

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
        ).forEach(
            function([
                id,
                category
            ]) {


                if (!category) {

                    return;

                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "category-manager-item";


                const categoryNameText =
                    escapeHTML(
                        category.name ||
                        "Untitled Category"
                    );


                const categoryIconClass =
                    escapeAttribute(
                        category.icon ||
                        "fa-solid fa-tag"
                    );


                const categoryColorValue =
                    escapeAttribute(
                        category.color ||
                        "#e8f5e9"
                    );


                const categoryStatusText =
                    category.status === "active"
                        ? "Active"
                        : "Inactive";


                const statusClass =
                    category.status === "active"
                        ? "active"
                        : "inactive";


                item.innerHTML = `

                    <div
                        class="category-manager-preview"
                        style="background:${categoryColorValue};">

                        <div class="category-preview-icon">

                            <i class="${categoryIconClass}"></i>

                        </div>

                        <span>
                            ${categoryNameText}
                        </span>

                    </div>


                    <div class="category-manager-info">

                        <h3>
                            ${categoryNameText}
                        </h3>


                        <p>

                            <i class="${categoryIconClass}"></i>

                            ${escapeHTML(
                                category.icon ||
                                "fa-solid fa-tag"
                            )}

                        </p>


                        <span
                            class="category-status ${statusClass}">

                            ${categoryStatusText}

                        </span>


                    </div>


                    <div class="category-manager-actions">

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

            }
        );


        /*==============================
        EDIT BUTTONS
        ==============================*/

        categoryList
            .querySelectorAll(
                ".category-edit-btn"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function() {

                            const id =
                                this.dataset.id;


                            if (!id) {

                                return;

                            }


                            editCategory(
                                id,
                                categories[id]
                            );

                        }
                    );

                }
            );


        /*==============================
        DELETE BUTTONS
        ==============================*/

        categoryList
            .querySelectorAll(
                ".category-delete-btn"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        async function() {

                            const id =
                                this.dataset.id;


                            if (!id) {

                                return;

                            }


                            const confirmed =
                                confirm(
                                    "Are you sure you want to delete this category?"
                                );


                            if (!confirmed) {

                                return;

                            }


                            try {

                                this.disabled =
                                    true;


                                this.innerHTML = `

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
                                    "CATEGORY DELETE ERROR:",
                                    error
                                );


                                showMessage(
                                    error.message ||
                                    "Could not delete category.",
                                    "error"
                                );


                                this.disabled =
                                    false;

                            }

                        }
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
EDIT CATEGORY
==================================================*/

function editCategory(
    id,
    category
) {

    if (!category) {

        return;

    }


    editingCategoryId =
        id;


    if (categoryName) {

        categoryName.value =
            category.name ||
            "";

    }


    if (categoryIcon) {

        categoryIcon.value =
            category.icon ||
            "";

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
        "Editing category...",
        "success"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

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
