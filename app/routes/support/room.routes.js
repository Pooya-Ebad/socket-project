const roomsController = require("../../controller/support/rooms.controller");
const { uploadImage } = require("../../utils/multer");
const router = require("express").Router();
router.post('/add', uploadImage.single("image"), roomsController.addRoom)
router.get('/List', roomsController.getRoom)
module.exports = {
    RoomSectionRouter : router
}