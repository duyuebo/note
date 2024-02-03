const BASE_URL = `${import.meta.env.VITE_APP_API_URL}`;

const SYSTEM_VERSION = `${import.meta.env.VITE_APP_VERSION}`;
const SYSTEM_COMPANY = `${import.meta.env.VITE_APP_COMPANY}`;

//图片上传地址
const IMG_UPLOAD_ADDRESS = BASE_URL + "/file/img/upload";

const CKEDITOR5_IMG_UPLOAD_ADDRESS = BASE_URL + "/file/ckeditor5/img/upload";

//模板下载地址
const TEMPLATE_UPLOAD_ADDRESS = BASE_URL + "/secure/download/template";

export {
  IMG_UPLOAD_ADDRESS,
  CKEDITOR5_IMG_UPLOAD_ADDRESS,
  TEMPLATE_UPLOAD_ADDRESS,
  SYSTEM_VERSION,
  SYSTEM_COMPANY,
};
