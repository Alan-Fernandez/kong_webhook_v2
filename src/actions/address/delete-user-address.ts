'use server';

import prisma from '@/lib/prisma';



export const deleteUserAddress = async( userId: string ) => {

  try {

    const deleted = await prisma.userAddress.delete({
      where: { userId }
    });

    return { ok: true };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      ok: false,
      message: `No se pudo eliminar la dirección: ${errorMessage}`
    };
}
}