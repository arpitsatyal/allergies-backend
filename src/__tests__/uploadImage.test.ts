import { uploadImage } from '../utils/uploadImage';

describe('uploadImage', () => {
  it('uploads an image to Cloudinary and returns its secure URL', async () => {
    const image = new Blob(['foo'], { type: 'image/jpeg' });
    
    jest.mock('cloudinary.v2.uploader', () => ({
      upload: jest.fn(() => Promise.resolve({ secure_url: 'https://example.com/image.jpg' }))
    }));
    
    const result = await uploadImage(image);
    
    expect(result).toEqual('https://example.com/image.jpg');
  });
});
