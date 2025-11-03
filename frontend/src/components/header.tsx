"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../components/themetoggle" // Import do toggle

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
    <header className="w-full bg-white dark:bg-gray-900 shadow-md dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Navegação */}
        <nav className="flex-1">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user && user.role[0] === "admin" && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/admin">Painel Admin</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Conta / login-logout + toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle /> {/* Botão de alternância de tema */}

          {user ? (
            <>
              <span className="text-sm">Olá, <b>{user.name}</b></span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">Entrar</Link>
              <Link href="/signup">Criar Conta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
