import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const APICard = ({ api, onTest, onViewDocs }) => {
  const getCategoryColor = (category) => {
    const colors = {
      "Social": "primary",
      "Analytics": "secondary", 
      "Content": "success",
      "E-commerce": "warning",
      "Data": "error",
      "Utility": "outline"
    }
    return colors[category] || "outline"
  }
  
  const getPopularityLevel = (popularity) => {
    if (popularity >= 80) return { level: "Hot", color: "error", icon: "Flame" }
    if (popularity >= 60) return { level: "Trending", color: "warning", icon: "TrendingUp" }
    if (popularity >= 40) return { level: "Popular", color: "success", icon: "Star" }
    return { level: "New", color: "primary", icon: "Zap" }
  }
  
  const popularityInfo = getPopularityLevel(api.popularity)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card rounded-xl p-6 hover:shadow-neon/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-white mb-2 group-hover:gradient-text transition-all duration-300">
            {api.name}
          </h3>
          <Badge variant={getCategoryColor(api.category)} className="mb-2">
            {api.category}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <ApperIcon name={popularityInfo.icon} size={12} className={`text-${popularityInfo.color}`} />
          <span className={`text-${popularityInfo.color} font-medium`}>{popularityInfo.level}</span>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {api.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <ApperIcon name="Shield" size={12} className="mr-1" />
            {api.authType}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Database" size={12} className="mr-1" />
            {api.responseType}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDocs?.(api)}
          >
            <ApperIcon name="Book" size={14} className="mr-1" />
            Docs
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTest?.(api)}
            className="shadow-neon/50"
          >
            <ApperIcon name="Play" size={14} className="mr-1" />
            Test
          </Button>
        </div>
      </div>
      
      <div className="mt-4 bg-surface/30 rounded-lg p-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Popularity</span>
          <span className="text-primary font-medium">{api.popularity}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-1.5 mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${api.popularity}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default APICard