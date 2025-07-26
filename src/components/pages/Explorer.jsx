import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import FilterTabs from "@/components/molecules/FilterTabs"
import APICard from "@/components/molecules/APICard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { apiService } from "@/services/api/apiService"

import { useUserMode } from "@/contexts/UserModeContext"

const Explorer = () => {
  const [apis, setApis] = useState([])
  const [filteredApis, setFilteredApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const navigate = useNavigate()
  const { isMarketer } = useUserMode()

  const categories = [
    { label: "All", value: "all" },
    { label: "Social", value: "Social" },
    { label: "Analytics", value: "Analytics" },
    { label: "Content", value: "Content" },
    { label: "E-commerce", value: "E-commerce" },
    { label: "Data", value: "Data" },
    { label: "Utility", value: "Utility" }
  ]

  const loadApis = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiService.getAll()
      setApis(data)
      setFilteredApis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    try {
      setLoading(true)
      const results = await apiService.searchAPIs(query, activeCategory)
      setFilteredApis(results)
    } catch (err) {
      toast.error("Search failed")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = async (category) => {
    setActiveCategory(category)
    try {
      setLoading(true)
      const results = await apiService.searchAPIs(searchQuery, category)
      setFilteredApis(results)
    } catch (err) {
      toast.error("Filter failed")
    } finally {
      setLoading(false)
    }
  }

  const handleTestAPI = (api) => {
    navigate("/tester", { state: { selectedApi: api } })
    toast.success(`Opening ${api.name} in API Tester`)
  }

  const handleViewDocs = (api) => {
    toast.info(`Opening documentation for ${api.name}`)
    // In a real app, this would open the API documentation
  }

  useEffect(() => {
    loadApis()
  }, [])

  if (loading) return <Loading type="card" />
  if (error) return <Error message={error} onRetry={loadApis} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
<h1 className="text-4xl font-display font-bold gradient-text mb-4">
          {isMarketer ? "Growth Tools Library" : "API Explorer"}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {isMarketer 
            ? "Discover 200+ marketing tools and growth APIs. Build campaigns, track performance, and automate your marketing without code."
            : "Discover 200+ high-impact APIs for growth hacking, marketing automation, and creative workflows. Test endpoints, build integrations, and scale your growth experiments."
          }
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
<SearchBar
            placeholder={isMarketer ? "Search marketing tools, social media, analytics..." : "Search APIs by name, category, or use case..."}
            onSearch={handleSearch}
            className="flex-1 max-w-md"
          />
          <FilterTabs
            options={categories}
            activeFilter={activeCategory}
            onFilterChange={handleCategoryChange}
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{apis.length}</div>
          <div className="text-sm text-gray-400">Total APIs</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">6</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {apis.filter(api => api.popularity >= 80).length}
          </div>
          <div className="text-sm text-gray-400">Trending</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">24/7</div>
          <div className="text-sm text-gray-400">Testing</div>
        </div>
      </motion.div>

      {/* API Grid */}
      {filteredApis.length === 0 ? (
        <Empty
          title="No APIs found"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredApis.map((api, index) => (
            <motion.div
              key={api.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <APICard
                api={api}
                onTest={handleTestAPI}
                onViewDocs={handleViewDocs}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold mb-2">Ready to build?</h3>
            <p className="text-gray-400">Start creating automated workflows with your favorite APIs</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/workflows")}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:shadow-neon transition-all duration-200 flex items-center space-x-2"
            >
              <ApperIcon name="GitBranch" size={18} />
              <span>Build Workflow</span>
            </button>
            <button
              onClick={() => navigate("/recipes")}
              className="bg-surface text-white px-6 py-3 rounded-lg font-medium hover:bg-surface/80 transition-all duration-200 flex items-center space-x-2 border border-white/20"
            >
              <ApperIcon name="BookOpen" size={18} />
              <span>Browse Recipes</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Explorer