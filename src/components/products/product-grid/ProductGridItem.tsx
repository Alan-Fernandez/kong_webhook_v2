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

const getImageSrc = (image: string | undefined) => {
  if (!image) {
    return '/path/to/default/image.png';
  }
  return image.startsWith('https') ? image : `/products/${image}`;
};
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={ `/product/${ product.slug }` }>
    <div className="relative w-full h-0 pb-[100%]"> {/* Contenedor con tamaño fijo */}
      <Image
        src={getImageSrc(displayImage)}
        alt={product.title}
        layout="fill"
        objectFit="cover"
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