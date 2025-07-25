import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import FilterTabs from "@/components/molecules/FilterTabs"
import CodeSnippet from "@/components/molecules/CodeSnippet"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { recipeService } from "@/services/api/recipeService"

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [deployingRecipe, setDeployingRecipe] = useState(null)

  const filters = [
    { label: "All", value: "all" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" }
  ]

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await recipeService.getAll()
      setRecipes(data)
      setFilteredRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    try {
      const results = await recipeService.searchRecipes(query)
      let filtered = results
      
      if (activeFilter !== "all") {
        filtered = filtered.filter(recipe => recipe.difficulty === activeFilter)
      }
      
      setFilteredRecipes(filtered)
    } catch (err) {
      toast.error("Search failed")
    }
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    let filtered = [...recipes]
    
    if (filter !== "all") {
      filtered = filtered.filter(recipe => recipe.difficulty === filter)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    setFilteredRecipes(filtered)
  }

  const handleDeploy = async (recipe) => {
    try {
      setDeployingRecipe(recipe.Id)
      const result = await recipeService.deployRecipe(recipe.Id)
      toast.success(result.message)
      loadRecipes() // Refresh to show updated usage count
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeployingRecipe(null)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "success"
      case "Intermediate": return "warning"
      case "Advanced": return "error"
      default: return "outline"
    }
  }

  const getROIColor = (roi) => {
    const percentage = parseInt(roi.split("-")[1] || "0")
    if (percentage >= 70) return "success"
    if (percentage >= 40) return "warning"
    return "error"
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  if (loading) return <Loading type="card" />
  if (error) return <Error message={error} onRetry={loadRecipes} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-display font-bold gradient-text mb-4">
          Growth Hack Recipes
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Pre-built automation recipes for rapid growth experimentation. 
          One-click deployment of proven growth strategies.
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
            placeholder="Search recipes by name, tags, or use case..."
            onSearch={handleSearch}
            className="flex-1 max-w-md"
          />
          <FilterTabs
            options={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </motion.div>

      {/* Popular Recipes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold flex items-center">
            <ApperIcon name="TrendingUp" size={20} className="mr-2 text-primary" />
            Most Popular This Week
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.slice(0, 3).map((recipe) => (
            <div key={recipe.Id} className="bg-surface/30 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-sm">{recipe.title}</h3>
              <div className="flex items-center justify-between text-xs">
                <Badge variant={getDifficultyColor(recipe.difficulty)}>
                  {recipe.difficulty}
                </Badge>
                <span className="text-gray-400">{recipe.uses} uses</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <Empty
          title="No recipes found"
          description="Try adjusting your search or filter criteria"
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold mb-2 text-white">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={getDifficultyColor(recipe.difficulty)}>
                  {recipe.difficulty}
                </Badge>
                <Badge variant={getROIColor(recipe.estimatedROI)}>
                  {recipe.estimatedROI} ROI
                </Badge>
                <Badge variant="outline">
                  {recipe.requiredAPIs.length} APIs
                </Badge>
              </div>

              {/* Required APIs */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Required APIs:</div>
                <div className="flex flex-wrap gap-1">
                  {recipe.requiredAPIs.map((api, idx) => (
                    <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {api}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-surface/50 text-gray-400 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-secondary">{recipe.uses}</div>
                  <div className="text-xs text-gray-400">Times Used</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-success">{recipe.estimatedROI}</div>
                  <div className="text-xs text-gray-400">Est. ROI</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDeploy(recipe)}
                  disabled={deployingRecipe === recipe.Id}
                  className="flex-1"
                >
                  {deployingRecipe === recipe.Id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-1"
                      >
                        <ApperIcon name="Loader2" size={14} />
                      </motion.div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Rocket" size={14} className="mr-1" />
                      Deploy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <ApperIcon name="Eye" size={14} className="mr-1" />
                  View
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">{selectedRecipe.title}</h3>
                <p className="text-gray-400">{selectedRecipe.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRecipe(null)}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h4 className="text-lg font-display font-semibold mb-3">Implementation Steps</h4>
              <ol className="space-y-2">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code Example */}
            {selectedRecipe.codeSnippet && (
              <div className="mb-6">
                <CodeSnippet
                  code={selectedRecipe.codeSnippet}
                  title={`${selectedRecipe.title} - Implementation`}
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => {
                  handleDeploy(selectedRecipe)
                  setSelectedRecipe(null)
                }}
                disabled={deployingRecipe === selectedRecipe.Id}
                className="flex-1"
              >
                <ApperIcon name="Rocket" size={16} className="mr-2" />
                Deploy Recipe
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedRecipe(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Recipes