const multer = require('multer');
const path = require('path');

// Define storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter for validation (allow only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Allowed MIME types
    const isValidType = allowedTypes.includes(file.mimetype); // Check MIME type

    if(isValidType) {
        return cb(null, true)
    } else {
        cb(new Error('Only images (JPG, JPEG, PNG) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
})

module.exports = upload;