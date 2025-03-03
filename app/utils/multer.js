const path = require('path')
const multer = require('multer')
const fs = require('fs')

function createPath(req){
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = date.getMonth().toString()
    const day = date.getDate().toString()
    const directory = path.join(__dirname,"..", "..", "public", "uploads", "files", year, month, day)
    req.body.fileUploadPath = path.join("uploads", "files", year, month, day)
    console.log(directory);
    fs.mkdirSync(directory ,{recursive : true})
    return directory
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file?.originalname){
            const filePath = createPath(req)
            return cb(null, filePath)
        }
        return cb(null, null)
    },
    filename : (req, file, cb) => {
        if(file?.originalname){
            const ext = path.extname(file.originalname)
            const fileName = String(new Date().getTime() + ext)
            req.body.filename = fileName
            return cb(null, fileName)
            
        }
        return cb(null, null)
    }
});
function imageFilter(req, file, cb){
    const ext = path.extname(file.originalname)
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if(allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)){
        return cb(null, true)
    }
    return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
};
function videoFilter(req, file, cb){
    const ext = path.extname(file.originalname)
    const allowedExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    const allowedMimeTypes = ["video/mp4", "video/x-msvideo", "video/x-matroska", "video/quicktime", "video/webm"];
    if(allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)){
        return cb(null, true)
    }
    return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
};
const uploadImage = multer({storage, fileFilter : imageFilter, limits : {fileSize : 5 * 1000 * 1000}})
const uploadVideo = multer({storage, fileFilter : videoFilter, limits : {fileSize : 300 * 1000 * 1000}})

module.exports = {
    uploadImage,
    uploadVideo
}