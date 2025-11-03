"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"

type Item = {
  id: number
  position: string
  location: string
  company: string
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

/* Componente reutilizável para Scraping */
function ScrapeDialog({ siteName, siteUrl }: { siteName: string; siteUrl: string }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleScrape = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("http://localhost:3001/api/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken") || '""')}`,
        },
        body: JSON.stringify({ site: siteUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erro ao fazer scrape.")
      }

      setSuccess(true)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("Erro desconhecido.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Scrap {siteName}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Isso iniciará o processo de scraping do site {siteName}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleScrape} disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">✅ Scrape iniciado com sucesso!</p>}
      </DialogContent>
    </Dialog>
  )
}

export default function Admin() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState({ position: "", company: "", location: "" })

  // 🔍 Campos de busca
  const [query, setQuery] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const fetchItems = async (pageNum: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: "10",
      })
      if (searchQuery) params.append("query", searchQuery)

      const res = await fetch(`http://localhost:3001/api/v1/items?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken") || '""')}`,
        },
      })
      if (!res.ok) throw new Error("Erro ao carregar itens")
      const data: ApiResponse = await res.json()
      setItems(data.data)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError("Falha ao carregar vagas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(page, query)
  }, [page, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(searchValue.trim())
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente deletar esta vaga?")) return
    try {
      const res = await fetch(`http://localhost:3001/api/v1/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken") || '""')}`,
        },
      })
      if (!res.ok) throw new Error("Erro ao deletar item")
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      alert("Erro ao deletar.")
    }
  }

  const openEditDialog = (item: Item) => {
    setEditingItem(item)
    setForm({
      position: item.position,
      company: item.company,
      location: item.location,
    })
  }

  const handleEditSave = async () => {
    if (!editingItem) return
    try {
      const res = await fetch(`http://localhost:3001/api/v1/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken") || '""')}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao atualizar item")
      setEditingItem(null)
      fetchItems(page, query)
    } catch {
      alert("Erro ao atualizar item.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-col items-center flex-1 gap-6 p-8">
        <Card className="w-[350px] p-4 flex flex-col gap-4">
          <ScrapeDialog siteName="WeWorkRemotely" siteUrl="weworkremotely.com" />
          <ScrapeDialog siteName="RemoteOK" siteUrl="remoteok.com" />
        </Card>

        <h2 className="text-2xl font-bold mt-8">Gerenciar Vagas</h2>

        {/* 🔍 Campo de busca */}
        <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2 items-center mt-2">
          <Input
            type="text"
            placeholder="Buscar vagas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button type="submit">Buscar</Button>
        </form>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <div className="w-full max-w-4xl">
            {items.length === 0 ? (
              <p className="text-gray-500">Nenhum item encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4 flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle>{item.position}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-1">🏢 {item.company}</p>
                      <p className="text-sm text-gray-600 mb-2">📍 {item.location}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" onClick={() => openEditDialog(item)}>
                          Editar
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                          Deletar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paginação */}
        <div className="flex items-center gap-3 mt-6">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ← Anterior
          </Button>
          <span>Página {page} de {totalPages}</span>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Próxima →
          </Button>
        </div>
      </main>

      {/* Dialog de Edição */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar vaga</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              placeholder="Cargo"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
            <Input
              placeholder="Empresa"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <Input
              placeholder="Localização"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
