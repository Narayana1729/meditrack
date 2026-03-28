import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const fallbackUser = {
  name: 'Srimannarayana Deevi',
  age: 22,
  blood: 'O+',
  email: 'narayana@meditrack.app',
  phone: '+91 98765 43210',
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  allergies: ['Penicillin'],
}

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) {
        setUser(fallbackUser)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single()
        if (error) throw error
        if (data) {
          data.conditions = typeof data.conditions === 'string' ? JSON.parse(data.conditions) : (data.conditions || [])
          data.allergies = typeof data.allergies === 'string' ? JSON.parse(data.allergies) : (data.allergies || [])
          setUser(data)
        } else {
          setUser(fallbackUser)
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message)
        setUser(fallbackUser)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const updateUser = async (newData) => {
    setUser(newData)
    if (supabase) {
      try {
        const { error } = await supabase.from('profiles').upsert([{ id: newData.id || 1, ...newData }])
        if (error) throw error
      } catch (err) {
        console.error('Error saving profile:', err.message)
      }
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
