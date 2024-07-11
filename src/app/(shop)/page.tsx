export const revalidate = 60; // 60 segundos


import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Suspense } from 'react';



interface Props {
  searchParams: {
    query?: string;
    page?: string; 
  }
}


export default async function Home({ searchParams }: Props) {

  const query = searchParams?.query || '';
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, query });


  if ( products.length === 0 ) {
    redirect('/');
  }


  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid 
        products={ products }
      />

      <Suspense fallback={ <div>Loading...</div> } >
        <Pagination totalPages={ totalPages } />
      </Suspense>
      
    </>
  );
}
