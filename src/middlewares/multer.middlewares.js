
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  // destination of file
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  }
});


const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Optional: 20MB max size
  }
});

export default upload;
