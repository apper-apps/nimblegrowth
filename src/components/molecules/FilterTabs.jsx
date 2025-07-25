import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"

const FilterTabs = ({ options, activeFilter, onFilterChange, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant={activeFilter === option.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={
              activeFilter === option.value 
                ? "shadow-neon" 
                : "text-gray-400 hover:text-white"
            }
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

export default FilterTabs