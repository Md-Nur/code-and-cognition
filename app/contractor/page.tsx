import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import ContractorClient from "./ContractorClient";

export default async function ContractorPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles: Role[] = [Role.CONTRACTOR, Role.FOUNDER];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/login");
  }

  return <ContractorClient />;
}
