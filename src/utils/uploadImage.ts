const cloudinary = require("cloudinary");
let streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export const uploadImage = async (image: string): Promise<string> => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      transformation: [
        { gravity: "face", height: 300, width: 200, crop: "crop" },
        { radius: "max" },
        { width: 150, crop: "scale" },
      ],
    });
    return result.secure_url;
  } catch (e) {
    return e;
  }
};

export const uploadFromBuffer = (buffer: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        transformation: [{ gravity: "face", crop: "crop" }],
      },
      (error: any, result: any) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
