import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { workflowService } from "@/services/api/workflowService"
import { testHistoryService } from "@/services/api/testHistoryService"
import { apiService } from "@/services/api/apiService"
import { recipeService } from "@/services/api/recipeService"

const MarketingDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [topRecipes, setTopRecipes] = useState([])
  const [growthMetrics, setGrowthMetrics] = useState({})

  const loadMarketingData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [workflowData, testStats, popularRecipes, trendingAPIs] = await Promise.all([
        workflowService.getAll(),
        testHistoryService.getTestStats(),
        recipeService.getPopular(),
        apiService.getTrendingAPIs()
      ])
      
      // Transform technical data into marketing metrics
      setCampaigns(workflowData.map(workflow => ({
        ...workflow,
        conversionRate: (workflow.successRate || 0) * 0.8, // Simulate conversion rate
        roi: Math.floor(Math.random() * 300) + 150, // Simulate ROI %
        leads: Math.floor(Math.random() * 1000) + 200,
        revenue: Math.floor(Math.random() * 50000) + 10000
      })))
      
      setTopRecipes(popularRecipes)
      setStats(testStats)
      
      setGrowthMetrics({
        totalCampaigns: workflowData.length,
        activeCampaigns: workflowData.filter(w => w.status === 'active').length,
        avgROI: 245,
        totalLeads: 12847,
        monthlyGrowth: 32.5
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getCampaignStatusColor = (status) => {
    switch (status) {
      case "active": return { color: "success", label: "Live" }
      case "paused": return { color: "warning", label: "Paused" }
      case "error": return { color: "error", label: "Needs Attention" }
      default: return { color: "outline", label: "Draft" }
    }
  }

  useEffect(() => {
    loadMarketingData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadMarketingData} />

  return (
    <div className="space-y-8">
      {/* Marketing Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-display font-bold gradient-text mb-4">
          Growth Command Center
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Your all-in-one marketing automation hub. Launch campaigns, track performance, 
          and scale your growth experiments with proven strategies.
        </p>
      </motion.div>

      {/* Key Growth Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <div className="glass-card rounded-xl p-6 text-center hover:shadow-neon/20 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="TrendingUp" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{growthMetrics.totalCampaigns}</div>
          <div className="text-sm text-gray-400">Active Campaigns</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center hover:shadow-neon/20 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-success to-info rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Target" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-success mb-1">{growthMetrics.totalLeads.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Leads Generated</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center hover:shadow-neon/20 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-warning to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="DollarSign" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-warning mb-1">{growthMetrics.avgROI}%</div>
          <div className="text-sm text-gray-400">Average ROI</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center hover:shadow-neon/20 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Users" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">+{growthMetrics.monthlyGrowth}%</div>
          <div className="text-sm text-gray-400">Monthly Growth</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center hover:shadow-neon/20 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-error rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-accent mb-1">{growthMetrics.activeCampaigns}</div>
          <div className="text-sm text-gray-400">Live Now</div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Launch Your Next Growth Experiment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate("/recipes")}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-primary to-secondary hover:shadow-neon"
          >
            <ApperIcon name="Rocket" size={24} />
            <div className="text-sm font-medium">Deploy Growth Recipe</div>
            <div className="text-xs opacity-80">Pre-built automation</div>
          </Button>
          
          <Button
            onClick={() => navigate("/workflows")}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <ApperIcon name="GitBranch" size={24} />
            <div className="text-sm font-medium">Create Campaign</div>
            <div className="text-xs opacity-80">Custom workflow</div>
          </Button>
          
          <Button
            onClick={() => navigate("/explorer")}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <ApperIcon name="Search" size={24} />
            <div className="text-sm font-medium">Find Growth Tools</div>
            <div className="text-xs opacity-80">Discover APIs</div>
          </Button>
        </div>
      </motion.div>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-semibold flex items-center">
              <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />
              Active Campaigns
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Plus" size={14} className="mr-1" />
              New Campaign
            </Button>
          </div>
          
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((campaign) => {
              const statusInfo = getCampaignStatusColor(campaign.status)
              return (
                <div key={campaign.Id} className="p-4 bg-surface/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <Badge variant={statusInfo.color} className="text-xs">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-success font-medium">{campaign.conversionRate.toFixed(1)}%</div>
                      <div className="text-gray-400 text-xs">Conversion</div>
                    </div>
                    <div>
                      <div className="text-warning font-medium">{campaign.roi}%</div>
                      <div className="text-gray-400 text-xs">ROI</div>
                    </div>
                    <div>
                      <div className="text-info font-medium">{campaign.leads}</div>
                      <div className="text-gray-400 text-xs">Leads</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-semibold flex items-center">
              <ApperIcon name="BookOpen" size={20} className="mr-2 text-secondary" />
              Top Growth Recipes
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" size={14} className="mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {topRecipes.map((recipe, index) => (
              <div key={recipe.Id} className="p-4 bg-surface/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{recipe.title}</h4>
                  <Badge variant="success" className="text-xs">
                    {recipe.estimatedROI}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{recipe.uses} marketers using this</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/recipes")}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Deploy →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/20"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold mb-2">Marketing Pro Tips</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Start with email capture recipes - they have the highest ROI (200%+ average)</li>
              <li>• Combine social media APIs with analytics for better audience insights</li>
              <li>• A/B test your automation flows - small changes can boost conversions by 50%</li>
              <li>• Use weather data to trigger location-based campaigns for 3x engagement</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MarketingDashboard