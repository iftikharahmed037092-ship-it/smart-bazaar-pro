/*==================================================
SMARTBAZAAR PRO
PART 19.2
CLOUDINARY CONFIG
==================================================*/


const cloudName = "YOUR_CLOUD_NAME";

const uploadPreset = "YOUR_UPLOAD_PRESET";


/*==============================
UPLOAD IMAGE FUNCTION
==============================*/

export async function uploadImage(file){

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        uploadPreset
    );


    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method:"POST",
            body:formData
        }
    );


    const data = await response.json();


    return data.secure_url;

}
