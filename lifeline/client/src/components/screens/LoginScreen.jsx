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
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-muted)', border: '1px solid var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 28 }}>♡</div>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            Life<span style={{ color: 'var(--brand)' }}>line</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>One tap from okay</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: '1rem', padding: 4, marginBottom: '1.5rem' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '0.5rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              background: mode === m ? 'var(--brand)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-secondary)',
            }}>
              {m === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <input value={form.name} onChange={set('name')} placeholder="Your name" className="input-field" required />
          )}
          <input value={form.email} onChange={set('email')} placeholder="University email" type="email" className="input-field" required />
          <input value={form.password} onChange={set('password')} placeholder="Password" type="password" className="input-field" required />

          {error && <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem', lineHeight: 1.6 }}>
          Lifeline is anonymous by default. We never share your data with your institution, peers, or anyone else without your explicit consent.
        </p>
      </div>
    </div>
  )
}
