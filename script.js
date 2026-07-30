const CLOUD_NAME = "tmdzy5c0"; // آپ کا Cloud Name
const UPLOAD_PRESET = "sbp_unsigned"; // Cloudinary میں یہ نام سے Preset بنائیں

const uploadInput = document.getElementById('uploadImage');
const preview = document.getElementById('preview');
const loading = document.getElementById('loading');
const imageUrl = document.getElementById('imageUrl');

uploadInput.addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if(!file) return;

  // 1. Preview دکھائیں
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
  loading.style.display = 'block';
  imageUrl.innerHTML = "";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    // 2. Cloudinary پر بھیجیں
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    loading.style.display = 'none';

    if(data.secure_url) {
      console.log("تصویر کا لنک:", data.secure_url);
      imageUrl.innerHTML = `✅ اپلوڈ ہو گیا! <br> <a href="${data.secure_url}" target="_blank">لنک کاپی کریں</a>`;
      alert("تصویر کامیابی سے اپلوڈ ہو گئی!");
    } else {
      throw new Error(data.error.message);
    }

  } catch(error) {
    loading.style.display = 'none';
    alert("اپلوڈ میں مسئلہ: " + error.message);
    console.error(error);
  }
});
