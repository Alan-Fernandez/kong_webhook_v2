"use server";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
  query?: string;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
  query = '',
}: PaginationOptions) => {
  // Validaciones y saneamiento de parámetros
  page = isNaN(Number(page)) || page < 1 ? 1 : Math.floor(page);
  take = isNaN(Number(take)) || take < 1 ? 12 : Math.min(Math.floor(take), 100); // Límite máximo de 100 para evitar sobrecarga
  
  try {
    // Construcción del filtro dinámico
    const filters: any = { AND: [] };
    if (gender) filters.AND.push({ gender });
    if (query) filters.AND.push({ title: { contains: query, mode: 'insensitive' } });
    
    // Consulta de productos con paginación y filtros
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: filters,
    });

    // Consulta del total de productos para cálculo de páginas
    const totalCount = await prisma.product.count({
      where: filters,
    });
    
    const totalPages = Math.ceil(totalCount / take);

    // Validación de página existente
    if (page > totalPages && totalPages > 0) {
      throw new Error("La página solicitada excede el total de páginas disponibles.");
    }

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error general:", error.message);
      console.error("Detalle del error:", error); // Imprime el error completo
    } else {
      console.error("Error desconocido:", error);
    }
    throw new Error("Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.");
  }
};