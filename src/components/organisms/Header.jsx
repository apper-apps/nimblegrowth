import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

import { useUserMode } from "@/contexts/UserModeContext"

const Header = ({ onMenuClick, onSearch }) => {
  const [notifications] = useState(3)
  const { userMode, toggleUserMode, isMarketer } = useUserMode()
  
  return (
    <header className="lg:pl-64 bg-background/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="hidden sm:block">
              <SearchBar 
                placeholder="Search APIs, workflows, recipes..."
                onSearch={onSearch}
                className="w-96"
              />
            </div>
          </div>
          
<div className="flex items-center space-x-4">
            {/* User Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isMarketer ? "primary" : "ghost"}
                size="sm"
                onClick={toggleUserMode}
                className="text-xs"
              >
                <ApperIcon name={isMarketer ? "Target" : "Code"} size={14} className="mr-1" />
                {isMarketer ? "Marketer" : "Developer"}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <motion.div 
              className="hidden md:flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button variant="ghost" size="sm" className="text-xs">
                <ApperIcon name="Plus" size={14} className="mr-1" />
                {isMarketer ? "New Campaign" : "New Workflow"}
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <ApperIcon name="Import" size={14} className="mr-1" />
                Import
              </Button>
            </motion.div>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <ApperIcon name="Bell" size={18} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full flex items-center justify-center text-xs text-white">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-gray-400 hidden sm:inline">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-4 sm:hidden">
          <SearchBar 
            placeholder="Search APIs..."
            onSearch={onSearch}
          />
        </div>
      </div>
    </header>
  )
}

export default Header