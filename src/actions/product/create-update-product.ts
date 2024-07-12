'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Product, Size } from '@prisma/client';
import { validateProductData } from '@/utils/validateProductData';
import { uploadImages } from '@/utils/uploadImages';

export const createUpdateProduct = async (formData: FormData) => {
  // Convertir formData a un objeto
  const data = Object.fromEntries(formData);
  // Validar los datos del producto
  console.log('data: ',data);
  const validation = validateProductData(data);

  // Verificar si la validación fue exitosa
  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  // Obtener datos del producto validados
  const product = validation.data;

  // Verificar si los datos del producto son válidos
  if (!product) {
    return { ok: false, message: 'Datos del producto no válidos' };
  }

  // Normalizar el slug del producto
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

  // Desestructurar id y resto de los datos del producto
  const { id, ...rest } = product;

  try {
    // Iniciar transacción con Prisma
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      // Formatear y separar las etiquetas
      const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

      // Actualizar el producto si existe un id, de lo contrario crear uno nuevo
      if (id) {
        product = await prisma.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }

      // Subir y asociar imágenes si existen
      if (formData.getAll('images')) {
        const imageUploadResult = await uploadImages(formData.getAll('images') as File[]);
        if (!imageUploadResult.ok) {
          throw new Error(imageUploadResult.message);
        }

        if (imageUploadResult.urls) {
          const imageUrls = imageUploadResult.urls.filter((url): url is string => url !== undefined);
          await prisma.productImage.createMany({
            data: imageUrls.map(url => ({
              url,
              productId: product.id,
            })),
          });
        }
      }

      // Retornar el producto
      return { product };
    });

    // Revalidar las rutas correspondientes
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    // Retornar éxito y producto creado/actualizado
    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    // Manejo de errores y logging
    console.error('Error al crear/actualizar el producto:', error);
    return {
      ok: false,
      message: 'Error inesperado al crear/actualizar el producto, revisar logs',
    };
  }
};
