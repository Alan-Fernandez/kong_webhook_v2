export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import {  getPaginatedUsers } from "@/actions";
import { Pagination, Title } from "@/components";
import { redirect } from "next/navigation";
import { UsersTable } from './ui/UsersTable';
import { Suspense } from "react";

export default async function OrdersPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={ users } />
        <Suspense fallback={ <div>Loading...</div> } >
          <Pagination totalPages={ 1 } />
        </Suspense>
      </div>
    </>
  );
}
