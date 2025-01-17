const {v2} = require('cloudinary');

export async function upload(url : string) {
    const { CLOUD_NAME , API_KEY, API_SECRET} = process.env 
    v2.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET 
    });

    try{
     const uploadResult = await v2.uploader
       .upload(  `${url}`, 
         {
             resource_type: 'auto',
            // folder: 'upload'
         }
        )
    return  uploadResult.url;
    }catch(error){
    
        throw new Error('Cloudinary upload failed');
    }
}


