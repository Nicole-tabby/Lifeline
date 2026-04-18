import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginScreen() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-brand-muted border border-brand/30 flex items-center justify-center mx-auto mb-4 text-3xl">♡</div>
        <h1 className="font-serif text-4xl text-white">Life<span className="text-brand">line</span></h1>
        <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase text-xs">One tap from okay</p>
      </div>

      {/* Mode toggle */}
      <div className="flex w-full max-w-xs bg-surface-card border border-surface-border rounded-2xl p-1 mb-6">
        {['login', 'register'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${mode === m ? 'bg-brand text-white' : 'text-gray-500'}`}>
            {m === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="w-full max-w-xs space-y-3">
        {mode === 'register' && (
          <input value={form.name} onChange={set('name')} placeholder="Your name"
            className="w-full bg-surface-card border border-surface-border rounded-2xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-brand/50 transition-colors" required />
        )}
        <input value={form.email} onChange={set('email')} placeholder="University email" type="email"
          className="w-full bg-surface-card border border-surface-border rounded-2xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-brand/50 transition-colors" required />
        <input value={form.password} onChange={set('password')} placeholder="Password" type="password"
          className="w-full bg-surface-card border border-surface-border rounded-2xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-brand/50 transition-colors" required />

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="btn-primary disabled:opacity-50">
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-[10px] text-gray-600 text-center mt-8 max-w-xs leading-relaxed">
        Lifeline is anonymous by default. We never share your data with your institution, peers, or anyone else without your explicit consent.
      </p>
    </div>
  )
}
