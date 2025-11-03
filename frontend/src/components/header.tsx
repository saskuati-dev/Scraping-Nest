"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"  // conforme shadcn docs :contentReference[oaicite:3]{index=3}

import { Button } from "@/components/ui/button"

interface User {
  name: string
  role: "admin" | "user" | string
  email: string
}

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    console.log(stored)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/signin")
  }

  return (
    <header className="w-full bg-white shadow-md ">
    
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">


        {/* Navegação menu */}
        <nav className="flex-1">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user ? (
                <>
                  <NavigationMenuItem>
                  </NavigationMenuItem>

                  {user.role[0] === "admin" && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href="/admin">Painel Admin</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </>
              ) : (
                <>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Conta / login-logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Olá, <b>{user.name}</b></span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                Entrar
              </Link>
              <Link href="/signup">
               Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
