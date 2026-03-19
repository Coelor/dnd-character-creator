import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (_email: string, _password: string, _inviteCode: string) => Promise<any>
  signIn: (_email: string, _password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, inviteCode: string) => {
    // First, validate the invite code
    const { data: validationData, error: validationError } = await supabase
      .rpc('validate_invite_code', { invite_code: inviteCode })

    if (validationError) {
      return { data: null, error: validationError }
    }

    if (!validationData?.valid) {
      return {
        data: null,
        error: { message: validationData?.error || 'Invalid invite code' }
      }
    }

    // Create the account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { data, error }
    }

    // Mark the invite code as used
    if (data.user) {
      const { error: useError } = await supabase
        .rpc('use_invite_code', {
          invite_code: inviteCode,
          user_id: data.user.id
        })

      if (useError) {
        console.error('Error marking invite code as used:', useError)
        // Don't fail the signup if we can't mark it as used
      }
    }

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}