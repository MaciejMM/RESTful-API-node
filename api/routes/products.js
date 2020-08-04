const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductControllers = require("../controllers/products");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    // reject file 
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false);
    }

}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', ProductControllers.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductControllers.create_new_product);

router.get('/:productId', ProductControllers.get_single_product);

router.patch('/:productId', checkAuth, ProductControllers.update_product);

router.delete('/:productId', checkAuth,ProductControllers.delete_product);



module.exports = router;