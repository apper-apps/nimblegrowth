import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApexCharts from "react-apexcharts"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { workflowService } from "@/services/api/workflowService"
import { testHistoryService } from "@/services/api/testHistoryService"
import { apiService } from "@/services/api/apiService"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({})
  const [workflows, setWorkflows] = useState([])
  const [testHistory, setTestHistory] = useState([])
  const [apis, setApis] = useState([])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [workflowData, testData, apiData, testStats] = await Promise.all([
        workflowService.getAll(),
        testHistoryService.getRecentTests(10),
        apiService.getTrendingAPIs(),
        testHistoryService.getTestStats()
      ])
      
      setWorkflows(workflowData)
      setTestHistory(testData)
      setApis(apiData)
      setStats(testStats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Chart configurations
  const successRateChartOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false }
    },
    colors: ["#00F593", "#FF3E3E"],
    labels: ["Successful", "Failed"],
    dataLabels: {
      enabled: true,
      style: { colors: ["#ffffff"] }
    },
    legend: {
      labels: { colors: "#ffffff" },
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold"
            }
          }
        }
      }
    },
    theme: { mode: "dark" }
  }

  const activityChartOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    colors: ["#00D9FF"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
      x: { show: false }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success"
      case "paused": return "warning"
      case "error": return "error"
      default: return "outline"
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">
            Growth Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor your API experiments and workflow performance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <Badge variant="success">+12%</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{workflows.length}</div>
          <div className="text-gray-400 text-sm">Active Workflows</div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" size={24} className="text-white" />
            </div>
            <Badge variant="success">+8%</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total || 0}</div>
          <div className="text-gray-400 text-sm">API Tests Run</div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-info rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
            <Badge variant={stats.successRate >= 90 ? "success" : "warning"}>
              {stats.successRate >= 90 ? "Excellent" : "Good"}
            </Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.successRate?.toFixed(1) || 0}%
          </div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>

        <div className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-error rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
            <Badge variant="outline">{stats.avgDuration < 500 ? "Fast" : "Slow"}</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.avgDuration || 0}ms
          </div>
          <div className="text-gray-400 text-sm">Avg Response</div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
            <ApperIcon name="PieChart" size={20} className="mr-2 text-primary" />
            API Test Results
          </h3>
          {stats.successful !== undefined && (
            <ApexCharts
              options={successRateChartOptions}
              series={[stats.successful, stats.failed]}
              type="donut"
              height={300}
            />
          )}
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2 text-secondary" />
            Activity Trend
          </h3>
          <ApexCharts
            options={activityChartOptions}
            series={[{
              name: "API Calls",
              data: [30, 45, 35, 50, 49, 60, 70, 85, 65, 75, 90, 80]
            }]}
            type="area"
            height={300}
          />
        </motion.div>
      </div>

      {/* Active Workflows & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-semibold flex items-center">
              <ApperIcon name="GitBranch" size={20} className="mr-2 text-primary" />
              Active Workflows
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" size={14} className="mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {workflows.slice(0, 5).map((workflow) => (
              <div key={workflow.Id} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-white mb-1">{workflow.name}</div>
                  <div className="text-xs text-gray-400">{workflow.nodes?.length || 0} nodes</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(workflow.status)} className="text-xs">
                    {workflow.status}
                  </Badge>
                  <div className="text-xs text-gray-400">
                    {workflow.successRate?.toFixed(0) || 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent API Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-semibold flex items-center">
              <ApperIcon name="History" size={20} className="mr-2 text-secondary" />
              Recent Tests
            </h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" size={14} className="mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {testHistory.slice(0, 5).map((test) => (
              <div key={test.Id} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-white mb-1">
                    {apis.find(a => a.Id.toString() === test.apiId)?.name || "Unknown API"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(test.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={test.status === "success" ? "success" : "error"} 
                    className="text-xs"
                  >
                    {test.statusCode}
                  </Badge>
                  <div className="text-xs text-gray-400">
                    {test.duration}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending APIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
          <ApperIcon name="TrendingUp" size={20} className="mr-2 text-warning" />
          Trending APIs This Week
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {apis.slice(0, 4).map((api) => (
            <div key={api.Id} className="bg-surface/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary" className="text-xs">
                  {api.category}
                </Badge>
                <div className="text-xs text-success font-medium">
                  {api.popularity}%
                </div>
              </div>
              <h4 className="font-medium text-sm text-white mb-1">{api.name}</h4>
              <p className="text-xs text-gray-400 line-clamp-2">
                {api.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold mb-2">Ready to scale your growth?</h3>
            <p className="text-gray-400">Explore new APIs, build workflows, and deploy proven recipes</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="primary" className="shadow-neon/50">
              <ApperIcon name="Search" size={16} className="mr-2" />
              Explore APIs
            </Button>
            <Button variant="outline">
              <ApperIcon name="BookOpen" size={16} className="mr-2" />
              Browse Recipes
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard