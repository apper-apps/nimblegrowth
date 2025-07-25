import apisData from "@/services/mockData/apis.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const apiService = {
  async getAll() {
    await delay(300)
    return [...apisData]
  },

  async getById(Id) {
    await delay(200)
    const api = apisData.find(item => item.Id === parseInt(Id))
    if (!api) {
      throw new Error("API not found")
    }
    return { ...api }
  },

  async searchAPIs(query, category = "all") {
    await delay(250)
    let filtered = [...apisData]
    
    if (category !== "all") {
      filtered = filtered.filter(api => api.category === category)
    }
    
    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(api => 
        api.name.toLowerCase().includes(searchTerm) ||
        api.description.toLowerCase().includes(searchTerm) ||
        api.category.toLowerCase().includes(searchTerm)
      )
    }
    
    return filtered
  },

  async getTrendingAPIs() {
    await delay(200)
    return apisData
      .filter(api => api.popularity >= 80)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8)
  },

  async getAPIsByCategory(category) {
    await delay(200)
    return apisData.filter(api => api.category === category)
  },

  async testAPI(apiId, endpoint, params = {}) {
    await delay(Math.random() * 1000 + 500) // Simulate network delay
    
    // Simulate random success/failure
    if (Math.random() < 0.1) {
      throw new Error("API request failed: Network timeout")
    }
    
    const api = apisData.find(a => a.Id === parseInt(apiId))
    if (!api) {
      throw new Error("API not found")
    }
    
    // Generate mock response based on API type
    const mockResponses = {
      "Social": {
        data: [
          { id: "123", text: "Sample social media post", likes: 42, shares: 8 }
        ],
        meta: { total_count: 1 }
      },
      "Analytics": {
        sessions: 1247,
        users: 892,
        pageviews: 3456,
        bounce_rate: 0.34
      },
      "Content": {
        results: [
          { id: "img_123", url: "https://example.com/image.jpg", title: "Sample Image" }
        ]
      },
      "E-commerce": {
        id: "pi_123",
        amount: 2000,
        currency: "usd",
        status: "succeeded"
      },
      "Data": {
        temperature: 72,
        humidity: 65,
        conditions: "partly cloudy",
        location: "San Francisco"
      },
      "Utility": {
        message: "Operation completed successfully",
        id: "op_123",
        status: "success"
      }
    }
    
    return {
      status: "success",
      statusCode: 200,
      data: mockResponses[api.category] || { message: "Success" },
      headers: {
        "content-type": "application/json",
        "x-ratelimit-remaining": "4999"
      },
      duration: Math.floor(Math.random() * 500 + 100)
    }
  }
}