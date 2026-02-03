import multer from 'multer';

const storage = multer.diskStorage({     //Store uploaded files on disk
    destination: function (req, file, cb) {  //This decides where the file will be saved.
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;