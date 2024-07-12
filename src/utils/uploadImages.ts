import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
        if (!image.type.startsWith('image/')) {
            return { ok: false, message: `Archivo no válido: ${image.name}` };
        }

        const buffer = await image.arrayBuffer();
        const resizedBuffer = await sharp(Buffer.from(buffer))
            .resize(900, 800, { fit: 'cover' })
            .toBuffer();

        const base64Image = resizedBuffer.toString('base64');
        const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`);

        if (uploadResponse.error) {
            return { ok: false, message: `Error al cargar la imagen: ${uploadResponse.error.message}` };
        }

        return { ok: true, url: uploadResponse.secure_url };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        const successfulUploads = uploadedImages.filter(result => result.ok).map(result => result.url);
        const errors = uploadedImages.filter(result => !result.ok).map(result => result.message);

        if (errors.length > 0) {
        return { ok: false, message: errors.join(', '), urls: successfulUploads };
        }

        return { ok: true, urls: successfulUploads };
    } catch (error) {
        console.error('Error inesperado al subir las imágenes:', error);
        return { ok: false, message: 'Error inesperado al subir las imágenes', error };
    }
};
