export const revalidate = 60; // 60 segundos


import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import { Pagination, ProductGrid, Title } from '@/components';

import { Gender } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';



interface Props {
  params: {
    gender: string;
  },
  searchParams: {
    query?: string;
    page?: string; 
  }
}


export default async function GenderByPage({ params, searchParams }: Props) {

  const { gender } = params;
  const query = searchParams?.query || '';
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page,
    query,
    gender: gender as Gender,
  });


  const labels: Record<string, string>  = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos'
  }

  // if ( id === 'kids' ) {
  //   notFound();
  // }

  if (products.length === 0) {
    return (
      <>
        <Title
          title={`No se encontraron artículos ${labels[gender]}`}
          subtitle="Intenta con una búsqueda diferente"
          className="mb-2"
        />
        <div>No se encontraron productos que coincidan con tu búsqueda {labels[gender]}.</div>
      </>
    );
  }
  


  return (
    <>
      <Title
        title={`Artículos de ${ labels[gender] }`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid 
        products={ products }
      />
      <Suspense fallback={ <div>Loading...</div> } >
        <Pagination totalPages={ totalPages }  />
      </Suspense>
      
    </>
  );
}