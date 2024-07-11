"use server";

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// Configuración de Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

interface DeleteProductImageResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export const deleteProductImage = async (imageId: number, imageUrl: string): Promise<DeleteProductImageResponse> => {
  // Validación del URL de la imagen
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pueden borrar imágenes de FS',
    };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    // Eliminación de la imagen en Cloudinary
    await cloudinary.uploader.destroy(imageName);

    // Eliminación de la imagen en la base de datos
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Revalidación de los paths relevantes
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);

    return {
      ok: true,
      message: 'Imagen eliminada correctamente',
    };
  } catch (error) {
    // Manejo detallado de errores
    if (error instanceof Error) {
      console.error("Error al eliminar la imagen:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    return {
      ok: false,
      message: 'No se pudo eliminar la imagen',
    };
  }
};
