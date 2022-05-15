const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './clients-images/')
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now() + file.originalname)
        //console.log(file.originalname.split("-"))
        cb(null, `${req.params.id}.${file.originalname.split(".")[1]}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('La extensión no es correcta'), false);
    }
}

module.exports = upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});