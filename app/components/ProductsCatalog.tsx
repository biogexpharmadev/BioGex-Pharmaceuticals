"use client"

import { useState, useEffect } from "react"
import { Package, Search, Filter, Loader2, Download, FileText } from "lucide-react"

interface Product {
  [key: string]: string
}

export default function ProductsCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortField, setSortField] = useState("product")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      console.log('Fetched products data:', data)
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const searchFields = [
      product.product,
      product.description,
      product.product_name,
      product.manufacturer,
      product.category
    ].filter(Boolean).join(' ').toLowerCase()
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === "all" || 
      (product.category && product.category.toLowerCase() === filterCategory.toLowerCase())
    
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToCSV = () => {
    const headers = ["Product", "Pack Size", "Price (KSh)"]
    const csvData = [
      headers.join(","),
      ...sortedProducts.map(product => [
        product.product || product.description || "",
        product.description || "",
        product.priceksh || product.price || ""
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "biogex-products.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#2e7d32]">Product Catalog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive range of pharmaceutical products with detailed specifications and pricing.
          </p>
        </div>

        {/* Search, Filter, and Export Controls */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
          <div className="text-sm text-gray-500">
            <FileText className="w-4 h-4 inline mr-1" />
            Excel-like table view
          </div>
        </div>

        {/* Excel-like Table */}
        {sortedProducts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("product")}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {sortField === "product" && (
                          <span className="text-green-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("description")}
                    >
                      <div className="flex items-center gap-2">
                        Pack Size
                        {sortField === "description" && (
                          <span className="text-green-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProducts.map((product, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.product || product.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {product.description || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 