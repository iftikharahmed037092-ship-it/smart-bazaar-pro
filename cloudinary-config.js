/*==================================================
SMARTBAZAAR PRO
PART 19.2
CLOUDINARY CONFIG
IMAGES + VIDEOS
==================================================*/

const cloudName =
    "jlrjn7lu";

const uploadPreset =
    "smartbazaar_uploads";


/*==================================================
UPLOAD MEDIA
==================================================*/

export async function uploadMedia(file, resourceType = "image") {

    if (!file) {

        throw new Error(
            "Please select a file."
        );

    }


    if (
        resourceType !== "image" &&
        resourceType !== "video"
    ) {

        throw new Error(
            "Invalid Cloudinary resource type."
        );

    }


    if (resourceType === "image") {

        if (
            !file.type ||
            !file.type.startsWith("image/")
        ) {

            throw new Error(
                "Please select a valid image."
            );

        }


        if (file.size > 10 * 1024 * 1024) {

            throw new Error(
                "Image must be smaller than 10MB."
            );

        }

    }


    if (resourceType === "video") {

        if (
            !file.type ||
            !file.type.startsWith("video/")
        ) {

            throw new Error(
                "Please select a valid video."
            );

        }


        if (file.size > 100 * 1024 * 1024) {

            throw new Error(
                "Video must be smaller than 100MB."
            );

        }

    }


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


    const uploadURL =
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;


    const response =
        await fetch(
            uploadURL,
            {
                method: "POST",
                body: formData
            }
        );


    let data = {};

    try {

        data =
            await response.json();

    }
    catch (error) {

        throw new Error(
            "Cloudinary response could not be read."
        );

    }


    if (!response.ok) {

        throw new Error(
            data?.error?.message ||
            "Cloudinary upload failed."
        );

    }


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return a URL."
        );

    }


    return data.secure_url;

}


/*==================================================
UPLOAD IMAGE
==================================================*/

export async function uploadImage(file) {

    return await uploadMedia(
        file,
        "image"
    );

}


/*==================================================
UPLOAD VIDEO
==================================================*/

export async function uploadVideo(file) {

    return await uploadMedia(
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
