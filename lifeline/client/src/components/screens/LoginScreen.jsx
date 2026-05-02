import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginScreen() {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '' })
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
      if (mode === 'login') {
        const user = await login(form.email, form.password)
        navigate(user.role === 'parent' ? '/parent' : '/home')
      } else {
        const user = await register(form.name, form.email, form.password, role, form.university)
        navigate(user.role === 'parent' ? '/parent' : '/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)',
    borderRadius: 14, padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-primary)',
    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
<<<<<<< HEAD
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--brand-muted)', border: '1px solid var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 30 }}>♡</div>
          <h1 className="font-serif" style={{ fontSize: '2.75rem', color: 'var(--text-primary)', letterSpacing: '-1px' }}>
            Life<span style={{ color: 'var(--brand)' }}>line</span>
          </h1>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 6 }}>One tap from okay</p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 14, padding: 4, marginBottom: '1.25rem' }}>
          {[['login', 'Sign in'], ['register', 'Sign up']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '0.55rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              background: mode === m ? 'var(--brand)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-secondary)',
            }}>
              {label}
=======
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
>>>>>>> 4c50bfe79723333d9f25a17c5b058dc30ff0e4bc
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {/* Role selector (signup only) */}
        {mode === 'register' && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>I am a</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['student', '🎓', 'Student'], ['parent', '👨‍👩‍👧', 'Parent / Guardian']].map(([r, icon, label]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: '0.75rem', borderRadius: 12, border: `1.5px solid ${role === r ? 'var(--brand)' : 'var(--bg-border)'}`,
                  background: role === r ? 'var(--brand-muted)' : 'var(--bg-card)', cursor: 'pointer',
                  color: role === r ? 'var(--brand)' : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <input value={form.name} onChange={set('name')} placeholder="Your full name" style={inputStyle} required />
          )}
          <input value={form.email} onChange={set('email')} placeholder={mode === 'register' ? (role === 'student' ? 'University email' : 'Your email') : 'Email'} type="email" style={inputStyle} required />
          <input value={form.password} onChange={set('password')} placeholder="Password" type="password" style={inputStyle} required />
          {mode === 'register' && role === 'student' && (
            <input value={form.university} onChange={set('university')} placeholder="Your university (e.g. Chanakya University)" style={inputStyle} />
          )}

          {error && <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.875rem', background: 'var(--brand)', color: 'white', border: 'none',
            borderRadius: 14, fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            opacity: loading ? 0.6 : 1, marginTop: 4, transition: 'opacity 0.15s'
          }}>
=======
        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'register' && (
            <input value={form.name} onChange={set('name')} placeholder="Your name" className="input-field" required />
          )}
          <input value={form.email} onChange={set('email')} placeholder="University email" type="email" className="input-field" required />
          <input value={form.password} onChange={set('password')} placeholder="Password" type="password" className="input-field" required />

          {error && <p style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', opacity: loading ? 0.6 : 1 }}>
>>>>>>> 4c50bfe79723333d9f25a17c5b058dc30ff0e4bc
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

<<<<<<< HEAD
        {/* Parent hint */}
        {mode === 'register' && role === 'parent' && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '0.5px solid var(--bg-border)', borderRadius: 12 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              💡 After signing up, ask your student for their <strong style={{ color: 'var(--text-primary)' }}>6-character invite code</strong> from their Lifeline app to link accounts.
            </p>
          </div>
        )}

        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.7 }}>
          Lifeline is anonymous by default. We never share your data with institutions or third parties without your explicit consent.
=======
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem', lineHeight: 1.6 }}>
          Lifeline is anonymous by default. We never share your data with your institution, peers, or anyone else without your explicit consent.
>>>>>>> 4c50bfe79723333d9f25a17c5b058dc30ff0e4bc
        </p>
      </div>
    </div>
  )
}
