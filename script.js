const CLOUD_NAME = "tmdzy5c0"; // آپ کا Cloud Name
const UPLOAD_PRESET = "sbp_unsigned"; // جو ہم نے بنایا

document.getElementById('uploadImage').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if(!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Preview دکھائیں
  document.getElementById('preview').src = URL.createObjectURL(file);
  document.getElementById('preview').style.display = 'block';

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log("تصویر کا لنک:", data.secure_url);

    document.getElementById('imageUrl').innerHTML =
      `لنک کاپی کریں: <a href="${data.secure_url}" target="_blank">${data.secure_url}</a>`;

  } catch(error) {
    alert("اپلوڈ میں مسئلہ: " + error);
  }
});
