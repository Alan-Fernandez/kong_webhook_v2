import { auth } from "@/auth.config";
import { Title } from "@/components";
import Link from "next/link";
import UserSettingsForm from "@/components/auth/user-settings-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    // redirect('/auth/login?returnTo=/perfil');
    redirect("/");
  }

  	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
				<div className="mx-auto grid w-full max-w-6xl gap-2">
					<h1 className="text-3xl font-semibold">Settings</h1>
				</div>
				<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
						<Link href="#" className="font-semibold text-primary">
							Geral
						</Link>
						<Link href="#">Support</Link>
						<Link href="#">Advanced</Link>
					</nav>
					<div className="grid gap-6">
						<UserSettingsForm user={session?.user} />
					</div>
				</div>
			</main>
		</div>
	);

}










// return (
//   <div>
//     <Title title="Perfil" />

//     <pre>{JSON.stringify(session.user, null, 2)}</pre>

//     <h3 className="text-3xl mb-10">{ session.user.role  }</h3>
//   </div>
// );