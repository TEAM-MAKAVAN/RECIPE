
import multer from 'multer';

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Specify the destination directory for uploaded files
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname); // Set the filename of the uploaded file
    }
});


export const uploadImage = multer({ storage: storage });



    
    //this is tested before making reciperoutes
// import multer from 'multer';

// const storage = multer.diskStorage({
    
//     destination: function (req, file, cb) {
//         cb(null, './public/temp'); // Specify the destination directory for uploaded files
//     },

//     filename: function (req, file, cb) {
//         cb(null, file.originalname); // Set the filename of the uploaded file
//     }
// });


// export const uploadImage = multer({ storage: storage });


