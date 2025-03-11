const { SupportController } = require("../../controller/support/support.controller");
const { checkLogin, checkAccessLogin } = require("../../middleware/login.auth");
const { NamespaceSectionRouter } = require("./namespace.routes");
const { RoomSectionRouter } = require("./room.routes");

const router = require("express").Router();
router.get('/', checkLogin, SupportController.renderChatRoom)
router.get('/login', checkAccessLogin, SupportController.loginForm)
router.post('/login', checkAccessLogin, SupportController.login)
router.use('/room', RoomSectionRouter)
router.use('/namespace', NamespaceSectionRouter)
module.exports = {
    SupportSectionRouter : router
}   