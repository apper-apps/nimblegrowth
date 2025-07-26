import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { useUserMode } from "@/contexts/UserModeContext"
const Sidebar = ({ isOpen, onClose }) => {
  const { isMarketer } = useUserMode()
  
  const developerNavigation = [
    { name: "Explorer", href: "/explorer", icon: "Search", description: "Discover APIs" },
    { name: "Tester", href: "/tester", icon: "Play", description: "Test endpoints" },
    { name: "Workflows", href: "/workflows", icon: "GitBranch", description: "Build chains" },
    { name: "Recipes", href: "/recipes", icon: "BookOpen", description: "Growth hacks" },
    { name: "Dashboard", href: "/dashboard", icon: "BarChart3", description: "Analytics" }
  ]
  
  const marketerNavigation = [
    { name: "Command Center", href: "/marketing", icon: "Target", description: "Campaign hub" },
    { name: "Growth Tools", href: "/explorer", icon: "Search", description: "Find tools" },
    { name: "Campaigns", href: "/workflows", icon: "Megaphone", description: "Manage campaigns" },
    { name: "Recipe Library", href: "/recipes", icon: "BookOpen", description: "Growth recipes" },
    { name: "Test Center", href: "/tester", icon: "TestTube", description: "Try tools" }
  ]
  
  const navigation = isMarketer ? marketerNavigation : developerNavigation
  
  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 glass-card rounded-none border-l-0 border-t-0 border-b-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">API Growth Lab</h1>
                <p className="text-xs text-gray-400">Growth Hacking Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-neon/20 border border-primary/30"
                      : "text-gray-400 hover:text-white hover:bg-surface/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={18}
                      className={`mr-3 flex-shrink-0 ${
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
<div className="px-4 mt-6">
            <div className="glass-card rounded-lg p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Rocket" size={16} className="text-primary" />
                <span className="text-sm font-medium">{isMarketer ? "Marketing Tip" : "Growth Tip"}</span>
              </div>
              <p className="text-xs text-gray-400">
                {isMarketer 
                  ? "Start with email capture recipes - they have 200%+ ROI and are beginner-friendly!"
                  : "Chain 3+ APIs together for maximum growth impact. Try weather + social + payments!"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-l-0 border-t-0 border-b-0"
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon">
                  <ApperIcon name="Zap" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold gradient-text">API Growth Lab</h1>
                  <p className="text-xs text-gray-400">Growth Hacking Platform</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-neon/20 border border-primary/30"
                        : "text-gray-400 hover:text-white hover:bg-surface/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon
                        name={item.icon}
                        size={18}
                        className={`mr-3 flex-shrink-0 ${
                          isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>
    </>
  )
  
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar