const { SupportSectionRouter } = require('./support/support.routes')

const router = require('express').Router()

router.use("/", SupportSectionRouter)

module.exports = {
    AllRoutes : router
}