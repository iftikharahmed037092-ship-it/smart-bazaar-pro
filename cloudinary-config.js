/*==================================================
SMARTBAZAAR PRO
PART 19.2
CLOUDINARY CONFIG
IMAGE + VIDEO UPLOAD
==================================================*/


/*==================================================
CLOUDINARY CONFIGURATION
==================================================*/

const cloudName =
    "jlrjn7lu";

const uploadPreset =
    "smartbazaar_uploads";


/*==================================================
UPLOAD MEDIA
==================================================*/

export async function uploadMedia(
    file,
    resourceType = "image"
) {

    if (!file) {

        throw new Error(
            "Please select a file."
        );

    }


    /*==============================
    RESOURCE TYPE
    ==============================*/

    if (
        resourceType !== "image" &&
        resourceType !== "video"
    ) {

        throw new Error(
            "Invalid media type."
        );

    }


    /*==============================
    FILE VALIDATION
    ==============================*/

    if (!file.type) {

        throw new Error(
            "File type could not be detected."
        );

    }


    if (
        resourceType === "image" &&
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "Please select a valid image file."
        );

    }


    if (
        resourceType === "video" &&
        !file.type.startsWith("video/")
    ) {

        throw new Error(
            "Please select a valid video file."
        );

    }


    /*==============================
    FILE SIZE
    ==============================*/

    const maxImageSize =
        10 * 1024 * 1024;

    const maxVideoSize =
        100 * 1024 * 1024;


    if (
        resourceType === "image" &&
        file.size > maxImageSize
    ) {

        throw new Error(
            "Image must be smaller than 10MB."
        );

    }


    if (
        resourceType === "video" &&
        file.size > maxVideoSize
    ) {

        throw new Error(
            "Video must be smaller than 100MB."
        );

    }


    /*==============================
    FORM DATA
    ==============================*/

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        uploadPreset
    );


    /*==============================
    CLOUDINARY URL
    ==============================*/

    const uploadURL =
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;


    /*==============================
    UPLOAD
    ==============================*/

    const response =
        await fetch(
            uploadURL,
            {
                method: "POST",
                body: formData
            }
        );


    /*==============================
    RESPONSE
    ==============================*/

    let data = {};


    try {

        data =
            await response.json();

    }

    catch (error) {

        throw new Error(
            "Cloudinary server response could not be read."
        );

    }


    /*==============================
    ERROR
    ==============================*/

    if (!response.ok) {

        throw new Error(
            data?.error?.message ||
            "Cloudinary upload failed."
        );

    }


    /*==============================
    URL
    ==============================*/

    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return a media URL."
        );

    }


    return data.secure_url;

}


/*==================================================
UPLOAD IMAGE
==================================================*/

export async function uploadImage(
    file
) {

    return uploadMedia(
        file,
        "image"
    );

}


/*==================================================
UPLOAD VIDEO
==================================================*/

export async function uploadVideo(
    file
) {

    return uploadMedia(
        file,
        "video"
    );

}


/*==================================================
EXPORT CONFIG
==================================================*/

export {
    cloudName,
    uploadPreset
};
