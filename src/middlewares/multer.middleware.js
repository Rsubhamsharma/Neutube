import multer from "multer";
import fs from "fs";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, "./public/temp")}, // Specify the destination folder for uploaded files    
        filename: function(req, file, cb) {
            cb(null,  file.originalname); // Append a unique suffix to the original filename
        }   

    }
)
export const upload = multer({ storage: storage })

