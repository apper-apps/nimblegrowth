import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { workflowService } from "@/services/api/workflowService"
import { apiService } from "@/services/api/apiService"

const Workflows = () => {
  const [workflows, setWorkflows] = useState([])
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [runningWorkflow, setRunningWorkflow] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [workflowData, apiData] = await Promise.all([
        workflowService.getAll(),
        apiService.getAll()
      ])
      setWorkflows(workflowData)
      setApis(apiData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getApiById = (apiId) => {
    return apis.find(api => api.Id === parseInt(apiId))
  }

  const handleRunWorkflow = async (workflow) => {
    try {
      setRunningWorkflow(workflow.Id)
      const result = await workflowService.runWorkflow(workflow.Id)
      toast.success(`Workflow "${workflow.name}" executed successfully!`)
      loadData() // Refresh to show updated stats
    } catch (err) {
      toast.error(`Workflow failed: ${err.message}`)
    } finally {
      setRunningWorkflow(null)
    }
  }

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      toast.error("Please enter a workflow name")
      return
    }

    try {
      const newWorkflow = await workflowService.create({
        name: newWorkflowName,
        description: "New workflow created with visual builder",
        nodes: [],
        connections: []
      })
      setWorkflows([...workflows, newWorkflow])
      setNewWorkflowName("")
      setShowBuilder(false)
      toast.success("New workflow created!")
    } catch (err) {
      toast.error("Failed to create workflow")
    }
  }

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      await workflowService.delete(workflowId)
      setWorkflows(workflows.filter(w => w.Id !== workflowId))
      toast.success("Workflow deleted")
    } catch (err) {
      toast.error("Failed to delete workflow")
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
    loadData()
  }, [])

  if (loading) return <Loading type="workflow" />
  if (error) return <Error message={error} onRetry={loadData} />

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
            Workflow Builder
          </h1>
          <p className="text-gray-400 text-lg">
            Chain APIs together to create powerful automation workflows
          </p>
        </div>
        <Button
          onClick={() => setShowBuilder(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Workflow
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{workflows.length}</div>
          <div className="text-gray-400">Total Workflows</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-success mb-2">
            {workflows.filter(w => w.status === "active").length}
          </div>
          <div className="text-gray-400">Active</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">
            {Math.round(workflows.reduce((sum, w) => sum + (w.successRate || 0), 0) / workflows.length) || 0}%
          </div>
          <div className="text-gray-400">Avg Success Rate</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-warning mb-2">
            {workflows.filter(w => w.lastRun).length}
          </div>
          <div className="text-gray-400">Recently Run</div>
        </div>
      </motion.div>

      {/* Workflow Grid */}
      {workflows.length === 0 ? (
        <Empty
          title="No workflows yet"
          description="Create your first workflow to start automating your growth hacks"
          actionLabel="Create Workflow"
          onAction={() => setShowBuilder(true)}
          icon="GitBranch"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold mb-2 text-white">
                    {workflow.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {workflow.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <Badge variant="outline">
                      {workflow.nodes?.length || 0} nodes
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWorkflow(workflow.Id)}
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>

              {/* Workflow Visualization */}
              <div className="bg-surface/30 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {workflow.nodes?.map((node, idx) => (
                    <div key={node.id} className="flex items-center">
                      <div className="flex items-center space-x-1 bg-primary/20 rounded px-2 py-1 text-xs whitespace-nowrap">
                        <ApperIcon name="Zap" size={12} className="text-primary" />
                        <span>
                          {node.type === "api" 
                            ? getApiById(node.apiId)?.name?.split(" ")[0] || "API"
                            : node.type}
                        </span>
                      </div>
                      {idx < workflow.nodes.length - 1 && (
                        <ApperIcon name="ArrowRight" size={12} className="text-gray-400 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-success">
                    {workflow.successRate?.toFixed(1) || 0}%
                  </div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-info">
                    {workflow.lastRun ? 
                      new Date(workflow.lastRun).toLocaleDateString() : 
                      "Never"
                    }
                  </div>
                  <div className="text-xs text-gray-400">Last Run</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRunWorkflow(workflow)}
                  disabled={runningWorkflow === workflow.Id || workflow.status === "error"}
                  className="flex-1"
                >
                  {runningWorkflow === workflow.Id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-1"
                      >
                        <ApperIcon name="Loader2" size={14} />
                      </motion.div>
                      Running...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Play" size={14} className="mr-1" />
                      Run
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <ApperIcon name="Edit" size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-display font-semibold mb-4">Create New Workflow</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Workflow Name</label>
              <Input
                placeholder="Enter workflow name..."
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={handleCreateWorkflow}
                className="flex-1"
              >
                Create Workflow
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowBuilder(false)
                  setNewWorkflowName("")
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold mb-2">Pro Tips for Workflow Building</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Start with simple 2-3 API chains before building complex workflows</li>
              <li>• Use conditional nodes to create smart branching logic</li>
              <li>• Monitor success rates and optimize failing workflows</li>
              <li>• Test individual APIs before chaining them together</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Workflows