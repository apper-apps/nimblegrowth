import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating something new",
  actionLabel,
  onAction,
  icon = "Database"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-64 text-center px-4"
    >
      <div className="glass-card rounded-full p-6 mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      {onAction && actionLabel && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty