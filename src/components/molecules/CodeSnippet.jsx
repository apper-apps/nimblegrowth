import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";

const CodeSnippet = ({ code, language = "javascript", title = "Code Snippet" }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Code" size={16} className="text-primary" />
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-xs">{language}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-xs"
        >
          <ApperIcon name={copied ? "Check" : "Copy"} size={14} className="mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      
      <div className="p-4 bg-surface/50 overflow-x-auto">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeSnippet