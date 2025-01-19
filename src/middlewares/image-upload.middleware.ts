import multer from 'multer';
import path from 'path';
import fs from 'fs';

class UploadMiddleWare {
    private uploadDir: string;

    constructor() {
        // Create uploads directory in the project directory
        this.uploadDir = path.join(process.cwd(), 'uploads');
        this.ensureUploadDirectoryExists();
    }

    private ensureUploadDirectoryExists(): void {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    private storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, this.uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    private fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG are allowed'));
        }
    };

    // Method for multiple files upload
    public uploadMultiple = multer({
        storage: this.storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB per file
            files: 5 // Maximum number of files allowed
        },
        fileFilter: this.fileFilter
    }).array('files', 5); // 'files' is the field name, 5 is the maximum number of files
}

export default new UploadMiddleWare();
