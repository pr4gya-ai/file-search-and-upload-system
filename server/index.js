import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import BinaryTree from './schemas/tree.schemas.js';
import upload from './services/upload.file.services.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const tree = new BinaryTree();
const uploadsDir = './uploads';

fs.readdir(uploadsDir, (err, files) => {
    if (err) {
        console.error("Error reading uploads folder:", err);
        return;
    }

    files.forEach(fileName => {
        const filePath = path.join(uploadsDir, fileName);
        const stats = fs.statSync(filePath);

        tree.insert(fileName, {
            path: filePath,
            size: stats.size,
            type: "unknown" 
        });
    });

    console.log("Existing files loaded into Binary Tree 🌳");
});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded.'
        });
    }

    tree.insert(file.originalname, {
        path: file.path,
        size: file.size,
        type: file.mimetype
    });

    res.json({
        success: true,
        message: 'File uploaded successfully.',
        file: {
            name: file.originalname,
            path: file.path,
            size: file.size,
            type: file.mimetype
        }
    });
});


app.get("/search", (req, res) => {
    const key = req.query.key;

    if (!key) {
        return res.status(400).json({
            success: false,
            message: "No filename provided."
        });
    }

    const result = tree.search(key);

    if (result) {
        return res.json({
            success: true,
            path: result.path,
            size: result.size,
            type: result.type
        });
    } else {
        return res.json({
            success: false,
            message: "File not found."
        });
    }
});

app.get("/show-tree", (req, res) => {
    res.json({
        success: true,
        data: tree.toJSON()
    });
});


app.listen(3001, () => {
    console.log('Server running on port 3001 🚀');
});
