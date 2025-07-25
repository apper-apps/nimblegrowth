import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ placeholder = "Search APIs...", onSearch, className = "" }) => {
  const [query, setQuery] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }
  
  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4 bg-surface/70 border-white/10 focus:border-primary/50 focus:bg-surface/90"
        />
      </div>
    </form>
  )
}

export default SearchBar