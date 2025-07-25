import { motion } from "framer-motion"

const Loading = ({ type = "default" }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded mb-4"></div>
              <div className="h-3 bg-surface rounded mb-2"></div>
              <div className="h-3 bg-surface rounded w-3/4 mb-4"></div>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-primary/30 rounded w-16"></div>
                <div className="h-2 bg-secondary/30 rounded w-12"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === "workflow") {
    return (
      <div className="h-[400px] glass-card rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded mb-6 w-48"></div>
          <div className="grid grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-20 bg-surface rounded-lg"></div>
                <div className="h-3 bg-surface rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
      />
    </div>
  )
}

export default Loading