import { createContext, useContext, useState } from 'react'

const UserModeContext = createContext()

export const useUserMode = () => {
  const context = useContext(UserModeContext)
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider')
  }
  return context
}

export const UserModeProvider = ({ children }) => {
  const [userMode, setUserMode] = useState('developer') // 'developer' or 'marketer'
  
  const toggleUserMode = () => {
    setUserMode(prev => prev === 'developer' ? 'marketer' : 'developer')
  }
  
  const value = {
    userMode,
    setUserMode,
    toggleUserMode,
    isMarketer: userMode === 'marketer',
    isDeveloper: userMode === 'developer'
  }
  
  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  )
}