'use server';

import prisma from '@/lib/prisma';



export const getUserAddress = async( userId: string ) => {
  try {

    const address = await prisma.userAddress.findUnique({
      where: { userId }
    });

    if ( !address ) return null;

    const {  countryId, address2, ...rest } = address;

    return {
      ...rest,
      country: countryId,
      address2: address2 ? address2 : '',
    };


  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { 
        ok: false, 
        message: `Error al obtener la dirección: ${errorMessage}` 
      };
  }
}




