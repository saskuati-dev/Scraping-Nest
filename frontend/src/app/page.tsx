"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "../components/header"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type Item = {
  id: number
  position: string
  location: string
  company: string
  post_date: string
  post_link: string
  source: string
}

type ApiResponse = {
  data: Item[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function Home() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState("") // termo de busca
  const [searchValue, setSearchValue] = useState("") // controla o input

  const goToSignIn = () => router.push("/signin")

  const fetchItems = async (pageNumber: number, searchQuery?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        pageSize: "10",
      })
      if (searchQuery) params.append("query", searchQuery)

      // ✅ Leitura segura do token
      let token = ""
      try {
        const stored = localStorage.getItem("accessToken")
        // Tenta fazer parse se estiver em JSON (ex: foi salvo com JSON.stringify)
        token = stored ? JSON.parse(stored) : ""
      } catch {
        // Se não for JSON, usa direto
        token = localStorage.getItem("accessToken") || ""
      }
      const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      // ⚠️ Lê a resposta apenas uma vez
      const data: ApiResponse | { message?: string } = await res.json()

      if (!res.ok) {
        throw new Error((data as any).message || "Erro ao carregar itens.")
      }

      console.log("Resposta da API:", data)

      const typedData = data as ApiResponse
      setItems(typedData.data)
      setPage(typedData.page)
      setTotalPages(typedData.totalPages)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("Erro desconhecido.")
    } finally {
      setLoading(false)
    }
  }

  // Atualiza a lista ao mudar página ou query
  useEffect(() => {
    fetchItems(page, query)
  }, [page, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(searchValue.trim())
  }

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start p-6 gap-6">
        <h1 className="text-3xl font-bold mb-4">Lista de Vagas</h1>

        {/* 🔍 Campo de busca */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-md gap-2 items-center"
        >
          <Input
            type="text"
            placeholder="Buscar vagas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button type="submit">Buscar</Button>
        </form>

        {loading && <p className="text-gray-500">Carregando vagas...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
              {items.length === 0 ? (
                <p className="text-gray-500">Nenhuma vaga encontrada.</p>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {item.position}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{item.company}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-1">
                        📍 {item.location || "Local não informado"}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(item.post_date).toLocaleDateString("pt-BR")}
                      </p>
                      <a
                        href={item.post_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Ver vaga ↗
                      </a>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                onClick={prevPage}
                disabled={page === 1}
                variant="outline"
              >
                ← Anterior
              </Button>

              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>

              <Button
                onClick={nextPage}
                disabled={page === totalPages}
                variant="outline"
              >
                Próxima →
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
