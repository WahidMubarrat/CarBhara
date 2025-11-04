import cloudinary from 'cloudinary';

const cloudinaryV2 = cloudinary.v2;

// Function to configure Cloudinary (called after env is loaded)
export const configureCloudinary = () => {
    cloudinaryV2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });

    console.log('🔧 Cloudinary Configured:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? '***SET***' : 'NOT SET',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET'
    });
};

// Upload image to cloudinary from data URI
export const uploadImage = async (dataURI, folder = 'profile-pictures') => {
    try {
        const result = await cloudinaryV2.uploader.upload(dataURI, {
            folder: folder,
            use_filename: true,
            unique_filename: true,
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to cloudinary:', error);
        throw new Error('Error uploading image');
    }
};