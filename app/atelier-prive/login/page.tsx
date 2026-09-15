import Image from "next/image";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/AdminLogin";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/atelier-prive");

  return (
    <main className="adminLoginPage">
      <div className="adminLoginCard">
        <Image src="/images/logo-lb17.webp" width={76} height={76} alt="Croissant.cl" priority />
        <p className="eyebrow">ATELIER PRIVÉ</p>
        <h1>Administración</h1>
        <p className="adminLoginIntro">Acceso privado de Croissant.cl. Contraseña y segundo factor son obligatorios.</p>
        <AdminLogin />
      </div>
    </main>
  );
}
