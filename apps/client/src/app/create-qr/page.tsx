import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata = { title: "My lists · GiftQR" };

export default async function MyListsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const { id, name, email, avatar, type } = session.user;
  return <Dashboard user={{ id, name, email, avatar, type }} />;
}
