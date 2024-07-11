"use server";

import prisma from '@/lib/prisma';

export const getStockBySlug = async (slug: string): Promise<number> => {
  // Validación básica del slug
  if (typeof slug !== 'string' || slug.trim() === '') {
    console.error("Slug inválido");
    throw new Error("Slug inválido");
  }

  try {
    // Consulta del stock del producto por su slug
    const stock = await prisma.product.findFirst({
      where: { slug },
      select: { inStock: true }
    });

    // Devolver el stock encontrado o 0 si no existe
    return stock?.inStock ?? 0;
  } catch (error) {
    // Manejo detallado de errores
    if (error instanceof Error) {
      console.error("Error al obtener el stock del producto:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    // Devolver 0 en caso de error
    return 0;
  }
};
