'use client';


import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@/interfaces';
import { useState } from 'react';

interface Props {
  product: Product;
}


export const ProductGridItem = ( { product }: Props ) => {

  const [ displayImage, setDisplayImage ] = useState( product.images[ 0 ] );

  console.log(`displayImage: `,displayImage);

const getImageSrc = (image: string | undefined) => {
  if (!image) {
    // Retorna una imagen predeterminada o maneja el caso de imagen indefinida
    return '/path/to/default/image.png'; // Asegúrate de reemplazar esto con una ruta válida a una imagen predeterminada
  }
  return image.startsWith('http') ? image : `/products/${image}`;
};
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={ `/product/${ product.slug }` }>
    <div className="relative w-full h-[500px]"> {/* Contenedor con tamaño fijo */}
      <Image
        src={getImageSrc(displayImage)}
        alt={product.title}
        layout="fill"
        objectFit="contain"
        className="rounded"
        onMouseEnter={() => setDisplayImage(product.images[1])}
        onMouseLeave={() => setDisplayImage(product.images[0])}
      />
    </div>
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-blue-600"
          href={ `/product/${ product.slug }` }>
          { product.title }
        </Link>
        <span className="font-bold">${ product.price }</span>
      </div>

    </div>
  );
};