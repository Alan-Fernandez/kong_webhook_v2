"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  try {
    // Validación básica de entrada
    validateOrderInput(productIds, address);

    // Obtener la información de los productos
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((p) => p.productId),
        },
      },
    });

    // Calcular los montos
    const { subTotal, tax, total, itemsInOrder } = calculateTotals(productIds, products);

    // Crear la transacción de base de datos
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProducts = await updateProductStock(tx, products, productIds);

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find((product) => product.id === p.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección de la orden
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    console.error(`Error en placeOrder: ${error.message}`, { productIds, address, userId });
    return {
      ok: false,
      message: error?.message || 'Error desconocido',
    };
  }
};

const validateOrderInput = (productIds: ProductToOrder[], address: Address) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('La lista de productos es inválida o está vacía.');
  }
  productIds.forEach((item) => {
    if (!item.productId || typeof item.productId !== 'string' || item.quantity <= 0) {
      throw new Error(`El producto con ID ${item.productId} tiene datos inválidos.`);
    }
  });

  if (!address || typeof address !== 'object') {
    throw new Error('La dirección no es válida.');
  }

  const requiredFields: (keyof Address)[] = ['country', 'city', 'firstName', 'lastName', 'phone', 'postalCode'];
  for (const field of requiredFields) {
    if (!address[field]) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }
};

const calculateTotals = (productIds: ProductToOrder[], products: any[]) => {
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
  
  const totals = productIds.reduce((totals, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) throw new Error(`${item.productId} no existe - 500`);

    const subTotal = product.price * item.quantity;

    totals.subTotal += subTotal;
    totals.tax += subTotal * 0.15;
    totals.total += subTotal * 1.15;

    return totals;
  }, { subTotal: 0, tax: 0, total: 0 });

  return { ...totals, itemsInOrder };
};

const updateProductStock = async (tx: any, products: any[], productIds: ProductToOrder[]) => {
  const updatedProductsPromises = products.map((product) => {
    const productQuantity = productIds
      .filter((p) => p.productId === product.id)
      .reduce((acc, item) => item.quantity + acc, 0);

    if (productQuantity === 0) {
      throw new Error(`${product.id} no tiene cantidad definida`);
    }

    return tx.product.update({
      where: { id: product.id },
      data: {
        inStock: {
          decrement: productQuantity,
        },
      },
    });
  });

  const updatedProducts = await Promise.all(updatedProductsPromises);

  updatedProducts.forEach((product) => {
    if (product.inStock < 0) {
      throw new Error(`${product.title} no tiene inventario suficiente`);
    }
  });

  return updatedProducts;
};
