"use client"

import { useRouter } from "next/navigation"
import { API_URL } from './lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function Home() {
  const router = useRouter()

  const goToSignIn = () =>{
    router.push("/signin")
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center">Bem-vindo!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este é um projeto de Scraping utilizando Nest.js e Next.js.
          </p>
          <Button onClick={goToSignIn} className="mt-4 w-full">Entrar</Button>
          <div className="flex justify-end mt-2">
            <Link href="/signup" className="text-sm text-blue-500 hover:underline">
              Criar Conta
            </Link>
          </div>
         
        </CardContent>
      </Card>
    </main>
  )

}
