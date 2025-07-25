import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import CodeSnippet from "@/components/molecules/CodeSnippet"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { apiService } from "@/services/api/apiService"
import { testHistoryService } from "@/services/api/testHistoryService"

const Tester = () => {
  const location = useLocation()
  const [selectedApi, setSelectedApi] = useState(location.state?.selectedApi || null)
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState("")
  const [testResult, setTestResult] = useState(null)
  const [requestParams, setRequestParams] = useState({})
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("GET")
  const [testHistory, setTestHistory] = useState([])

  const loadApis = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiService.getAll()
      setApis(data)
      if (!selectedApi && data.length > 0) {
        setSelectedApi(data[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTestHistory = async () => {
    try {
      const history = await testHistoryService.getRecentTests(5)
      setTestHistory(history)
    } catch (err) {
      console.error("Failed to load test history:", err)
    }
  }

  const handleApiSelect = (api) => {
    setSelectedApi(api)
    setTestResult(null)
    setEndpoint("")
    setRequestParams({})
  }

  const handleTest = async () => {
    if (!selectedApi) {
      toast.error("Please select an API to test")
      return
    }

    try {
      setTesting(true)
      setError("")
      
      const result = await apiService.testAPI(selectedApi.Id, endpoint, requestParams)
      setTestResult(result)
      
      // Save to test history
      await testHistoryService.create({
        apiId: selectedApi.Id.toString(),
        endpoint: endpoint || "/test",
        method,
        request: requestParams,
        response: result.data,
        duration: result.duration,
        status: "success",
        statusCode: result.statusCode
      })
      
      toast.success("API test completed successfully!")
      loadTestHistory()
    } catch (err) {
      setError(err.message)
      setTestResult({
        status: "error",
        statusCode: 400,
        error: err.message,
        duration: 0
      })
      toast.error("API test failed")
    } finally {
      setTesting(false)
    }
  }

  const generateCodeSnippet = () => {
    if (!selectedApi) return ""
    
    const params = Object.keys(requestParams).length > 0 ? 
      JSON.stringify(requestParams, null, 2) : "{}"
    
    return `// ${selectedApi.name} API Test
const response = await fetch('${selectedApi.baseUrl}${endpoint || '/test'}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${params})
});

const data = await response.json();
console.log(data);`
  }

  useEffect(() => {
    loadApis()
    loadTestHistory()
  }, [])

  if (loading) return <Loading />
  if (error && !selectedApi) return <Error message={error} onRetry={loadApis} />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* API Selection */}
      <div className="lg:col-span-1 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center">
            <ApperIcon name="List" size={20} className="mr-2 text-primary" />
            Select API
          </h2>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {apis.map((api) => (
              <motion.button
                key={api.Id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApiSelect(api)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedApi?.Id === api.Id
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 shadow-neon/20"
                    : "bg-surface/50 hover:bg-surface/70 border border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{api.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {api.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {api.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Test History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center">
            <ApperIcon name="History" size={20} className="mr-2 text-secondary" />
            Recent Tests
          </h2>
          
          {testHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">No tests yet</p>
          ) : (
            <div className="space-y-2">
              {testHistory.map((test) => (
                <div key={test.Id} className="p-2 bg-surface/30 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">
                      {apis.find(a => a.Id.toString() === test.apiId)?.name || "Unknown API"}
                    </span>
                    <Badge 
                      variant={test.status === "success" ? "success" : "error"}
                      className="text-xs"
                    >
                      {test.statusCode}
                    </Badge>
                  </div>
                  <div className="text-gray-400">
                    {test.duration}ms • {new Date(test.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Test Interface */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedApi ? (
          <Empty
            title="Select an API to test"
            description="Choose an API from the list to start testing endpoints"
            icon="Play"
          />
        ) : (
          <>
            {/* Request Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold flex items-center">
                  <ApperIcon name="Settings" size={20} className="mr-2 text-primary" />
                  Test {selectedApi.name}
                </h2>
                <Badge variant="primary">
                  {selectedApi.authType}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">HTTP Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full h-10 bg-surface/50 border border-white/20 rounded-lg px-3 text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Endpoint</label>
                  <Input
                    placeholder="/endpoint/path"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Request Parameters (JSON)</label>
                <textarea
                  placeholder='{"key": "value"}'
                  value={JSON.stringify(requestParams, null, 2)}
                  onChange={(e) => {
                    try {
                      setRequestParams(e.target.value ? JSON.parse(e.target.value) : {})
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="w-full h-24 bg-surface/50 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-sm resize-none"
                />
              </div>

              <Button
                onClick={handleTest}
                disabled={testing}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-neon"
              >
                {testing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <ApperIcon name="Loader2" size={16} />
                    </motion.div>
                    Testing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Play" size={16} className="mr-2" />
                    Test API
                  </>
                )}
              </Button>
            </motion.div>

            {/* Response */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-semibold">Response</h3>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={testResult.status === "success" ? "success" : "error"}
                    >
                      {testResult.statusCode}
                    </Badge>
                    {testResult.duration > 0 && (
                      <Badge variant="outline">
                        {testResult.duration}ms
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-surface/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(testResult.data || testResult.error, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Code Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CodeSnippet
                code={generateCodeSnippet()}
                language="javascript"
                title={`${selectedApi.name} Integration Code`}
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Tester