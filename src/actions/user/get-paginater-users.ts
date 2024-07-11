'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface GetPaginatedUsersResponse {
  ok: boolean;
  message?: string;
  users?: any[];
}

export const getPaginatedUsers = async (): Promise<GetPaginatedUsersResponse> => {
  try {
    // Autenticación del usuario
    const session = await auth();

    // Verificación del rol del usuario autenticado
    if (session?.user.role !== 'admin') {
      return {
        ok: false,
        message: 'Debe de ser un usuario administrador',
      };
    }

    // Obtención de usuarios paginados
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'desc',
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    // Manejo detallado de errores
    if (error instanceof Error) {
      console.error("Error al obtener usuarios paginados:", error.message);
      return {
        ok: false,
        message: `Error al obtener usuarios: ${error.message}`,
      };
    } else {
      console.error("Error desconocido:", error);
      return {
        ok: false,
        message: 'Error desconocido al obtener usuarios',
      };
    }
  }
};
