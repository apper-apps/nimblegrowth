import testHistoryData from "@/services/mockData/testHistory.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const testHistoryService = {
  async getAll() {
    await delay(250)
    return [...testHistoryData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getByApiId(apiId) {
    await delay(200)
    return testHistoryData
      .filter(test => test.apiId === apiId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async create(testData) {
    await delay(200)
    const newId = Math.max(...testHistoryData.map(t => t.Id)) + 1
    const newTest = {
      Id: newId,
      ...testData,
      timestamp: new Date().toISOString()
    }
    testHistoryData.push(newTest)
    return { ...newTest }
  },

  async getRecentTests(limit = 10) {
    await delay(200)
    return testHistoryData
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  },

  async getSuccessfulTests() {
    await delay(200)
    return testHistoryData.filter(test => test.status === "success")
  },

  async getFailedTests() {
    await delay(200)
    return testHistoryData.filter(test => test.status === "error")
  },

async getTestStats() {
    await delay(200)
    const total = testHistoryData.length
    const successful = testHistoryData.filter(t => t.status === "success").length
    const failed = testHistoryData.filter(t => t.status === "error").length
    const avgDuration = testHistoryData.reduce((sum, t) => sum + t.duration, 0) / total

    return {
      total,
      successful,
      failed,
      successRate: (successful / total) * 100,
      avgDuration: Math.round(avgDuration)
    }
  },

  async getMarketingMetrics() {
    await delay(200)
    const stats = await this.getTestStats()
    return {
      ...stats,
      conversions: Math.floor(stats.successful * 0.7),
      leads: Math.floor(stats.total * 2.3),
      roi: Math.floor(stats.successRate * 2.5)
    }
  }
}