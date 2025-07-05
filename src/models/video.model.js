import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

 const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // cloudinary url 
        required: true

    },
    thumbnail: {
        type: String, // cloudinary url 
        required: true

    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    duration : {
        type: String,
        required: true
    },
    title: {
        type: Number,
        required: true
    },
     Views: {
        type: Number,
        required: true,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owenr:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema)