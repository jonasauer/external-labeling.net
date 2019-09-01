const multer = require('multer');

const disk_storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const file_filter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: disk_storage,
    limits: {
        fileSize: 1024*1024*6 //6MB max file size
    },
    fileFilter: file_filter
});

module.exports = upload;