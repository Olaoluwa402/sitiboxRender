import asyncHandler from "express-async-handler";
import cloudinary from 'cloudinary';
//@desc    upload chat files
// @route   POST /api/chatupload
// @access  Private
 

const chatUploads = asyncHandler(async (req, res) => {

    const chatData = req.body;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // const isImage = chatData.chatFile.search('application');
    // console.log(isImage)
    let fileType;
    if (chatData.chatFile.search('application') === 5) {
        fileType = 'raw';
    } else if (chatData.chatFile.search('image') === 5) {
        fileType = 'image';
    } else {
        fileType = 'video';
    }

    
    try {

        if (chatData) {
            const uploadedResponse = await cloudinary.v2.uploader.upload(chatData.chatFile, 
            	{ 
            		resource_type: `${fileType}`, 
            		folder: 'liorwellchat', 
            		width: 250, 
                    height: 250, 
                    crop: "scale",
                    quality:"auto"
            	}); 
            
            if (uploadedResponse) {
                res.status(201).json({
                    secureUrl: uploadedResponse.secure_url,
                    publicId: uploadedResponse.public_id,
                });
            }
        } else {
            console.log('Something went wrong');
            res.status(500);
            throw new Error('No file selected');
        }

    } catch (error) {
        console.log('err', error);
        res.status(500);
        throw new Error('Something went wrong');
    }

});

export {
    chatUploads
};