const namespaceController = require("../../controller/support/namespace.controller"); 
const router = require("express").Router();
router.post('/add', namespaceController.addNamespace)
router.get('/List', namespaceController.getNamespace)
module.exports = {
    NamespaceSectionRouter : router
}