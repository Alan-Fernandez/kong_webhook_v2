"use server";

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";


const validateAddress = (address: Address) => {
  if (!address || typeof address !== 'object') {
    throw new Error('La dirección no es válida.');
  }

  const requiredFields: (keyof Address)[] = ['address', 'country', 'city', 'firstName', 'lastName', 'phone', 'postalCode'];
  for (const field of requiredFields) {
    if (!address[field]) { // Aquí TypeScript ya sabe que [`field`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5Cdescargas%5C%5Ckong_webhook_v2%5C%5Csrc%5C%5Cactions%5C%5Caddress%5C%5Cset-user-address.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2Fdescargas%2Fkong_webhook_v2%2Fsrc%2Factions%2Faddress%2Fset-user-address.ts%22%2C%22path%22%3A%22%2FD%3A%2Fdescargas%2Fkong_webhook_v2%2Fsrc%2Factions%2Faddress%2Fset-user-address.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A79%2C%22character%22%3A7%7D%5D "src/actions/address/set-user-address.ts") es una clave de [`Address`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fd%3A%2Fdescargas%2Fkong_webhook_v2%2Fsrc%2Finterfaces%2Faddress.interface.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A0%2C%22character%22%3A0%7D%5D "src/interfaces/address.interface.ts")
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }
};

export const setUserAddress = async (address: Address, userId: string) => {
  try {

    if (!userId || typeof userId !== 'string') {
      throw new Error('El ID de usuario no es válido.');
    }
    validateAddress(address);

    const newAddress = await createOrReplaceAddress( address, userId );

    return {
      ok: true,
      address: newAddress,
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Error en setUserAddress: ${errorMessage}`, { address, userId });
    return {
      ok: false,
      message: `No se pudo grabar la dirección: ${errorMessage}`,
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })
    return updatedAddress;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo grabar la dirección: ${errorMessage}`);
  }
};


