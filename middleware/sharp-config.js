const sharp = require('sharp');
const path = require ('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    const name = originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_');
    const ref = `${timestamp}-${name}.webp`;
    const dirPath = path.join(__dirname, '..', 'images');
    const filepath = path.join(dirPath, ref);

    fs.access(dirPath, (error) => {
        if(error)
            fs.mkdirSync(dirPath);
    })
    
    try {
        await sharp(buffer)
            .webp({quality : 20})
            .toFile(filepath);
        req.file.filename = ref;
        next();
    } catch (error){
        res.status(400).json({error});
    }
};