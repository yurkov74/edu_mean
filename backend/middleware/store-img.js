const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
  
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('Invalid image mime type');
      if (isValid) error = null;
  
      callback(error, "backend/images");
    },
    filename: (request, file, callback) => {
      const fname = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
  
      callback(null, fname + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage: storage}).single('image');