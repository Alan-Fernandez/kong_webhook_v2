"use server";

import prisma from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
  // Validación básica del slug
  if (typeof slug !== 'string' || slug.trim() === '') {
    console.error("Slug inválido");
    throw new Error("Slug inválido");
  }

  try {
    // Consulta del producto por su slug con inclusión de imágenes
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: true
      },
      where: {
        slug: slug,
      }
    });

    // Verificar si el producto no existe
    if (!product) {
      return null;
    }

    // Devolver el producto con sus imágenes en un formato adecuado
    return {
      ...product,
      images: product.ProductImage.map(image => image.url)
    };
  } catch (error) {
    // Manejo detallado de errores
    if (error instanceof Error) {
      console.error("Error al obtener producto por slug:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    // Lanzar un error con un mensaje específico
    throw new Error('Error al obtener producto por slug');
  }
};
