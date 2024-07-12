import { z } from 'zod';
import { Gender } from '@prisma/client';

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(255),
    slug: z.string().min(3, { message: 'El slug debe tener al menos 3 caracteres' }).max(255),
    description: z.string().nonempty({ message: 'La descripción no puede estar vacía' }),
    price: z.coerce.number().min(0, { message: 'El precio debe ser un número positivo' }).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0, { message: 'El stock debe ser un número positivo' }).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid({ message: 'El ID de la categoría debe ser un UUID válido' }),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string().nonempty({ message: 'Las etiquetas no pueden estar vacías' }),
    gender: z.nativeEnum(Gender),
});

export const validateProductData = (data: Record<string, any>) => {
    const productParsed = productSchema.safeParse(data);
    if (!productParsed.success) {
        return { ok: false, message: productParsed.error.errors.map(e => e.message).join(', ') };
    }
    return { ok: true, data: productParsed.data };
};
