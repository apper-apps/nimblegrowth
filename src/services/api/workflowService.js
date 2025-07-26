import workflowsData from "@/services/mockData/workflows.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const workflowService = {
  async getAll() {
    await delay(300)
    return [...workflowsData]
  },

  async getById(Id) {
    await delay(200)
    const workflow = workflowsData.find(item => item.Id === parseInt(Id))
    if (!workflow) {
      throw new Error("Workflow not found")
    }
    return { ...workflow }
  },

  async create(workflowData) {
    await delay(400)
    const newId = Math.max(...workflowsData.map(w => w.Id)) + 1
    const newWorkflow = {
      Id: newId,
      ...workflowData,
      createdAt: new Date().toISOString(),
      lastRun: null,
      successRate: 0,
      status: "draft"
    }
    workflowsData.push(newWorkflow)
    return { ...newWorkflow }
  },

  async update(Id, updates) {
    await delay(300)
    const index = workflowsData.findIndex(w => w.Id === parseInt(Id))
    if (index === -1) {
      throw new Error("Workflow not found")
    }
    workflowsData[index] = { ...workflowsData[index], ...updates }
    return { ...workflowsData[index] }
  },

  async delete(Id) {
    await delay(200)
    const index = workflowsData.findIndex(w => w.Id === parseInt(Id))
    if (index === -1) {
      throw new Error("Workflow not found")
    }
    workflowsData.splice(index, 1)
    return true
  },

  async runWorkflow(Id) {
    await delay(2000) // Simulate workflow execution time
    
    // Simulate success/failure
    const success = Math.random() > 0.2
    
    const workflow = workflowsData.find(w => w.Id === parseInt(Id))
    if (workflow) {
      workflow.lastRun = new Date().toISOString()
      workflow.status = success ? "active" : "error"
      // Update success rate
      const currentRate = workflow.successRate || 0
      workflow.successRate = success ? 
        Math.min(100, currentRate + Math.random() * 5) :
        Math.max(0, currentRate - Math.random() * 10)
    }
    
    if (!success) {
      throw new Error("Workflow execution failed: API timeout in node 2")
    }
    
    return {
      success: true,
      executionTime: 1847,
      nodesExecuted: workflow?.nodes?.length || 0,
      result: "Workflow completed successfully"
    }
  },

async getActiveWorkflows() {
    await delay(200)
    return workflowsData.filter(w => w.status === "active")
  },

  async getMarketingCampaigns() {
    await delay(200)
    return workflowsData.map(workflow => ({
      ...workflow,
      campaignType: this.getCampaignType(workflow.name),
      expectedROI: Math.floor(Math.random() * 300) + 150,
      estimatedLeads: Math.floor(Math.random() * 1000) + 200,
      conversionRate: Math.floor(Math.random() * 15) + 5
    }))
  },

  getCampaignType(name) {
    if (name.toLowerCase().includes('email')) return 'Email Campaign'
    if (name.toLowerCase().includes('social')) return 'Social Media Campaign'
    if (name.toLowerCase().includes('lead')) return 'Lead Generation'
    if (name.toLowerCase().includes('content')) return 'Content Marketing'
    return 'Growth Campaign'
  }
}