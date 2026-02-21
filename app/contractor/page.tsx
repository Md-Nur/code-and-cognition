import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import ContractorClient from "./ContractorClient";

export default async function ContractorPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (![Role.CONTRACTOR, Role.FOUNDER].includes(session.user.role)) {
    redirect("/login");
  }

  return <ContractorClient />;
}
