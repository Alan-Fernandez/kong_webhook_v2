"use server";

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ChangeUserRoleResponse {
  ok: boolean;
  message?: string;
}

export const changeUserRole = async (userId: string, role: string): Promise<ChangeUserRoleResponse> => {
  // Autenticación del usuario
  const session = await auth();

  // Verificación del rol del usuario autenticado
  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado como admin',
    };
  }

  try {
    // Determinación del nuevo rol
    const newRole = role === 'admin' ? 'admin' : 'user';

    // Actualización del rol del usuario en la base de datos
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    // Revalidación de la ruta de administración de usuarios
    revalidatePath('/admin/users');

    return {
      ok: true,
      message: `El rol del usuario ${user.name ?? ''} ha sido actualizado a ${newRole}`,
    };
  } catch (error) {
    // Manejo detallado de errores
    if (error instanceof Error) {
      console.error("Error al actualizar el rol del usuario:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    return {
      ok: false,
      message: 'No se pudo actualizar el rol, revisar logs',
    };
  }
};
