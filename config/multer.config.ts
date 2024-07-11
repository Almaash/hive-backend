import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
    destination:'/upload'
})

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    
    const filetypes = /jpeg|jpg|png|gif|pdf|csv|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Only images (JPEG, JPG, PNG, GIF) and documents(PDF, CSV, xlsx) are allowed!'));
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});
