const { SupportController } = require("../../controller/support/support.controller");
const { NamespaceSectionRouter } = require("./namespace.routes");
const { RoomSectionRouter } = require("./room.routes");

const router = require("express").Router();
router.get('/', SupportController.renderChatRoom)
router.use('/room', RoomSectionRouter)
router.use('/namespace', NamespaceSectionRouter)
module.exports = {
    SupportSectionRouter : router
}   