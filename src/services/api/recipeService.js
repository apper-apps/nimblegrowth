import recipesData from "@/services/mockData/recipes.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const recipeService = {
  async getAll() {
    await delay(300)
    return [...recipesData]
  },

  async getById(Id) {
    await delay(200)
    const recipe = recipesData.find(item => item.Id === parseInt(Id))
    if (!recipe) {
      throw new Error("Recipe not found")
    }
    return { ...recipe }
  },

  async getByCategory(category) {
    await delay(250)
    return recipesData.filter(recipe => recipe.category === category)
  },

  async getPopular() {
    await delay(200)
    return recipesData
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 6)
  },

  async searchRecipes(query) {
    await delay(250)
    if (!query) return [...recipesData]
    
    const searchTerm = query.toLowerCase()
    return recipesData.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  },

  async deployRecipe(Id) {
    await delay(1500) // Simulate deployment time
    
    const recipe = recipesData.find(r => r.Id === parseInt(Id))
    if (!recipe) {
      throw new Error("Recipe not found")
    }
    
    // Simulate success/failure
    const success = Math.random() > 0.15
    
    if (success) {
      // Increment usage count
      recipe.uses += 1
      return {
        success: true,
        workflowId: Math.floor(Math.random() * 1000) + 100,
        message: `Recipe "${recipe.title}" deployed successfully!`
      }
    } else {
      throw new Error("Deployment failed: Missing API credentials")
    }
  },

  async getRecipesByDifficulty(difficulty) {
    await delay(200)
    return recipesData.filter(recipe => recipe.difficulty === difficulty)
  }
}