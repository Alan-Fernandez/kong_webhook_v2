import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";


import { auth } from '@/auth.config';
import { getCountries } from "@/actions/country/get-countries";
import { getUserAddress } from "@/actions/address/get-user-address";

export default async function AddressPage() {
  
  const countries = await getCountries();

  const session = await auth();

  if ( !session?.user ) {
    return (
      <h3 className="text-5xl">500 -  No hay sesión de usuario</h3>
    )
  }

  const userAddressResult = await getUserAddress(session.user.id);

  // Asegúrate de que userAddressResult es del tipo correcto antes de pasarlo
  let userAddress;
  if (userAddressResult && 'id' in userAddressResult) {
    // Esto asume que si userAddressResult tiene una propiedad 'id', entonces es del tipo Address
    userAddress = userAddressResult;
  } else {
    // Si no, userAddress permanece como undefined
    userAddress = undefined;
  }

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}