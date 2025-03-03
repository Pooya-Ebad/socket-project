const { SupportSectionRouter } = require('./support/support.routes')

const router = require('express').Router()

router.use("/support", SupportSectionRouter)

module.exports = {
    AllRoutes : router
}