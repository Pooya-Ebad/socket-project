const { ConversationModel } = require("../../models/converstation");
const { StatusCodes } = require("http-status-codes")
const Controller = require("../controller");
const path = require("path");
const createHttpError = require("http-errors");

class RoomController extends Controller{
    async addRoom(req,res,next){
        try {
            const { name, description, filename, fileUploadPath, namespace } = req.body
            await this.findByNAme(name)
            const image = path.join(fileUploadPath, filename).replace(/\\/g, "/")
            const room = {
                name,
                description,
                image
            }
            const conversation = await ConversationModel.updateOne({endpoint : namespace}, {
                $push : { rooms : room }
            })
            if(conversation.modifiedCount === 0)
                throw createHttpError.NotFound("صفحه مورد نظر یافت نشد")
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
    async getRoom(req,res,next){
        try {
            const rooms = await ConversationModel.find({}, {rooms : 1})
            return res.status(StatusCodes.OK).json({
                statusCode : StatusCodes.OK,
                data : rooms
            })
        } catch (error) {
            next(error)
        }
    }
    async findByNAme(name){
            if(await ConversationModel.findOne({"rooms.name" : name})){
                throw createHttpError.BadRequest("این نام قبلا انتخاب شده است")
            }
        }
}
module.exports = new RoomController()