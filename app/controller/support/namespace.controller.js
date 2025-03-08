const { ConversationModel } = require("../../models/conversation");
const { StatusCodes } = require("http-status-codes")
const Controller = require("../controller");
const createHttpError = require("http-errors");

class NamespaceController extends Controller{
    async addNamespace(req,res,next){
        try {
            const { title, endpoint } = req.body
            await this.findByEndPoint(endpoint)
            const conversation = await ConversationModel.create({
                title,
                endpoint
            })
            return res.status(StatusCodes.CREATED).json({
                statusCode : StatusCodes.CREATED,
                data : {
                    message : "صفحه جدید با موفقیت ساخته شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getNamespace(req,res,next){
        try {
            const namespaces = await ConversationModel.find({}, {rooms : 0})
            return res.status(StatusCodes.OK).json({
                statusCode : StatusCodes.OK,
                data : namespaces
            })
        } catch (error) {
            next(error)
        }
    }
    async findByEndPoint(endpoint){
        if(await ConversationModel.findOne({endpoint})){
            throw createHttpError.BadRequest("این نام قبلا انتخاب شده است")
        }
    }
}
module.exports = new NamespaceController()