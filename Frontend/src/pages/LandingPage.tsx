import { useEffect, useState } from 'react'
import { Lock, Receipt, Target, BarChart3 } from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)

  // Counter Animation function
  const animateCounter = (el: HTMLElement, target: number, duration: number, prefix = '', suffix = '', isFloat = false) => {
    const start = performance.now()
    const update = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = eased * target
      
      let displayVal
      if (isFloat) {
        displayVal = current.toFixed(1)
      } else {
        displayVal = Math.floor(current).toLocaleString('en-IN')
      }
      
      el.textContent = prefix + displayVal + suffix
      if (progress < 1) requestAnimationFrame(update)
      else {
        el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString('en-IN')) + suffix
      }
    }
    requestAnimationFrame(update)
  }

  useEffect(() => {
    // 1. Navbar Background
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)

    // 2. Load Hero Counter immediately
    const heroCounter = document.getElementById('hero-counter')
    if (heroCounter) animateCounter(heroCounter, 47230, 2000)

    // 3. IntersectionObserver for Reveal & Stats Counters
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    let statsAnimated = false

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('animate-on-scroll')) {
            entry.target.classList.add('visible')
          }
          if (entry.target.id === 'dashboard-preview') {
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            (entry.target as HTMLElement).style.opacity = '1'
          }
          if (entry.target.id === 'stats-section' && !statsAnimated) {
            statsAnimated = true
            document.querySelectorAll('.counter').forEach(el => {
              const target = parseInt(el.getAttribute('data-target') || '0', 10)
              animateCounter(el as HTMLElement, target, 2000)
            })
            document.querySelectorAll('.counter-float').forEach(el => {
              const target = parseFloat(el.getAttribute('data-target') || '0')
              animateCounter(el as HTMLElement, target, 2000, '', '', true)
            })
          }
          if (entry.target.classList.contains('animate-on-scroll') && entry.target.id !== 'dashboard-preview'){
             observer.unobserve(entry.target)
          }
        }
      })
    }, observerOptions)

    document.querySelectorAll('.animate-on-scroll, #stats-section, #dashboard-preview').forEach(el => {
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if(target) target.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="landing-body">


  {/*  1. Navbar  */}
  <nav className="nav" id="nav" style={{ background: navScrolled ? "rgba(12,13,15,0.96)" : "rgba(12,13,15,0.85)" }}>
    <a href="#" className="logo"><span className="logo-bullet"></span>Expense<span>Track</span></a>
    <div className="nav-links">
      <a href="#features">Features</a>
      <a href="#how">How it works</a>
      <a href="#pricing">Pricing</a>
    </div>
    <div className="nav-cta">
      <a href="/login" className="signin-link">Sign in</a>
      <a href="/register" className="btn-primary">Get Started</a>
    </div>
  </nav>

  {/*  2. Hero Section  */}
  <section className="hero">
    <div className="hero-content">
      <div className="eyebrow animate-on-scroll">
        <div className="pulse-dot"></div>
        Now in Public Beta — Free Forever
      </div>
      <h1 className="animate-on-scroll">Know exactly where<br /><i>your money <span className="underline-amber">goes.</span></i></h1>
      <p className="hero-sub animate-on-scroll">
        Track expenses, set budgets, and understand your spending patterns — all in one beautifully designed dashboard.
      </p>
      <div className="cta-row animate-on-scroll">
        <a href="/register" className="btn-primary btn-hero">Get Started Free {"\u2192"}</a>
        <a href="#how" onClick={(e) => handleSmoothScroll(e, 'how')} className="btn-secondary">See how it works {"\u2193"}</a>
      </div>
      <div className="trust-line animate-on-scroll">
        <span><i>&#10003;</i> No credit card required</span>
        <span><i>&#10003;</i> Free forever</span>
        <span><i>&#10003;</i> Open source</span>
      </div>

      <div className="terminal animate-on-scroll">
        <div className="terminal-header">
          <div className="dots"><div className="dot r"></div><div className="dot y"></div><div className="dot g"></div></div>
          <div className="term-title">ExpenseTrack {"\u2014"} Dashboard</div>
        </div>
        <div className="terminal-body mono">
          <div className="term-stats">
            <div className="t-card">
              <span className="t-label">TOTAL THIS MONTH</span>
              <span className="t-val primary">₹<span id="hero-counter" style={{"color":"inherit"}}>0</span>.00</span>
              <span className="t-sub pos">&#9650; 12% vs last month</span>
            </div>
            <div className="t-card">
              <span className="t-label">TRANSACTIONS</span>
              <span className="t-val neutral">143</span>
              <span className="t-sub neutral">this month</span>
            </div>
            <div className="t-card">
              <span className="t-label">BUDGETS</span>
              <span className="t-val neutral">4<span>/5</span></span>
              <span className="t-sub pos">on track</span>
            </div>
          </div>
          <div className="term-chart">
            <span className="term-chart-label">MONTHLY SPENDING</span>
            <div className="chart-bars">
              <div className="bar-col"><div className="bar" style={{"height":"50%"}}></div><span className="x-label">Aug</span></div>
              <div className="bar-col"><div className="bar" style={{"height":"70%"}}></div><span className="x-label">Sep</span></div>
              <div className="bar-col"><div className="bar" style={{"height":"45%"}}></div><span className="x-label">Oct</span></div>
              <div className="bar-col active">
                <span className="y-val-top">₹47k</span>
                <div className="bar" style={{"height":"85%"}}></div><span className="x-label" style={{"color":"var(--text-1)"}}>Nov</span>
              </div>
              <div className="bar-col"><div className="bar" style={{"height":"60%"}}></div><span className="x-label">Dec</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  3. Social Proof / Stats  */}
  <section className="stats-bar mono" id="stats-section">
    <div className="stat-item animate-on-scroll">
      <span className="stat-val"><span className="counter" data-target="10000">0</span>+</span>
      <span className="stat-label">Expenses Tracked</span>
    </div>
    <div className="stat-sep"></div>
    <div className="stat-item animate-on-scroll" style={{"transitionDelay":"100ms"}}>
      <span className="stat-val">₹<span className="counter-float" data-target="2.4">0.0</span> Cr+</span>
      <span className="stat-label">Money Monitored</span>
    </div>
    <div className="stat-sep"></div>
    <div className="stat-item animate-on-scroll" style={{"transitionDelay":"200ms"}}>
      <span className="stat-val"><span className="counter" data-target="500">0</span>+</span>
      <span className="stat-label">Active Users</span>
    </div>
    <div className="stat-sep"></div>
    <div className="stat-item animate-on-scroll" style={{"transitionDelay":"300ms"}}>
      <span className="stat-val">4.9/5</span>
      <span className="stat-label">Average Rating</span>
    </div>
  </section>

  {/*  4. Features Grid  */}
  <section className="features" id="features">
    <div className="section-header animate-on-scroll">
      <span className="section-eyebrow">What you get</span>
      <h2 className="section-title">Everything you need to master your money.</h2>
      <p className="section-sub">Built for people who are serious about understanding their finances, not just logging receipts.</p>
    </div>
    
    <div className="features-grid">
      <div className="f-card animate-on-scroll">
        <div className="f-icon-wrap"><Receipt size={24} /></div>
        <h3>Smart Expense Tracking</h3>
        <p>Log expenses with categories, tags, and receipts. Filter, search, and export your complete financial history in seconds.</p>
      </div>
      <div className="f-card animate-on-scroll" style={{"transitionDelay":"60ms"}}>
        <div className="f-icon-wrap"><Target size={24} /></div>
        <h3>Budget Intelligence</h3>
        <p>Set budgets by category or overall. Three calculation modes — monthly reset, rolling 30 days, or paycheck-based. Get alerts before you overspend.</p>
      </div>
      <div className="f-card animate-on-scroll" style={{"transitionDelay":"120ms"}}>
        <div className="f-icon-wrap"><BarChart3 size={24} /></div>
        <h3>Visual Analytics</h3>
        <p>Pie charts, bar charts, and trend lines that show exactly how your spending patterns evolve month over month.</p>
      </div>
    </div>
  </section>

  {/*  5. How It Works  */}
  <section className="steps-section" id="how">
    <div className="section-header animate-on-scroll">
      <span className="section-eyebrow">How it works</span>
      <h2 className="section-title">Up and running in 60 seconds.</h2>
      <p className="section-sub">No complicated setup. No onboarding flows. Just start tracking.</p>
    </div>
    <div className="steps-grid">
      <div className="steps-connector"></div>
      <div className="step-item animate-on-scroll">
        <div className="step-num">1</div>
        <h3>Create your account</h3>
        <p>Register with your email in under 30 seconds. Your account comes pre-loaded with 8 expense categories and sample data so you can see the dashboard immediately.</p>
      </div>
      <div className="step-item animate-on-scroll" style={{"transitionDelay":"100ms"}}>
        <div className="step-num">2</div>
        <h3>Add your first expense</h3>
        <p>Hit 'Add Expense', enter the amount, pick a category, and you're done. Set a budget for that category and watch the progress bar fill up in real time.</p>
      </div>
      <div className="step-item animate-on-scroll" style={{"transitionDelay":"200ms"}}>
        <div className="step-num">3</div>
        <h3>See your patterns</h3>
        <p>After a week of tracking, the analytics page starts telling your money's story — which categories eat your salary, which months you overspend, where the leaks are.</p>
      </div>
    </div>
  </section>

  {/*  6. Dashboard Preview  */}
  <section className="preview-section">
    <div className="section-header animate-on-scroll">
      <span className="section-eyebrow">The Dashboard</span>
      <h2 className="section-title">Your finances, at a glance.</h2>
      <p className="section-sub">Everything that matters, front and center. No clutter, no noise.</p>
    </div>
    
    <div className="preview-container animate-on-scroll" id="dashboard-preview" style={{"transform":"translateY(40px)","opacity":0,"transition":"all 0.6s ease"}}>
      <div className="browser-chrome">
        <div className="dots"><div className="dot r"></div><div className="dot y"></div><div className="dot g"></div></div>
        <div className="url-bar">
          <Lock style={{"width":"12px","height":"12px","color":"var(--success)"}}/>
          app.expensetrack.in/dashboard
        </div>
      </div>
      <div className="app-ui">
        <div className="fake-sidebar">
          <div className="nav-skeleton active"></div>
          <div className="nav-skeleton"></div>
          <div className="nav-skeleton"></div>
          <div className="nav-skeleton"></div>
          <div style={{"flex":1}}></div>
          <div className="nav-skeleton" style={{"borderRadius":"50%","width":"32px","height":"32px"}}></div>
        </div>
        <div className="app-main">
          <div className="app-cards">
            <div className="app-card"><div className="c-line1"></div><div className="c-line2"></div></div>
            <div className="app-card"><div className="c-line1"></div><div className="c-line2"></div></div>
            <div className="app-card"><div className="c-line1"></div><div className="c-line2"></div></div>
            <div className="app-card"><div className="c-line1"></div><div className="c-line2"></div></div>
          </div>
          <div className="app-charts">
            <div className="app-panel">
              <div className="pie-placeholder"></div>
            </div>
            <div className="app-panel">
              <div className="bar-placeholder">
                <div className="b-line" style={{"height":"30%"}}></div>
                <div className="b-line" style={{"height":"50%"}}></div>
                <div className="b-line" style={{"height":"80%"}}></div>
                <div className="b-line" style={{"height":"40%"}}></div>
                <div className="b-line" style={{"height":"90%","background":"var(--amber)","opacity":0.8}}></div>
                <div className="b-line" style={{"height":"60%"}}></div>
              </div>
            </div>
          </div>
          <div className="app-panel" style={{"flexDirection":"column","alignItems":"stretch","gap":0,"padding":"0 16px"}}>
            <div className="tx-row"><div className="tx-l"><div className="tx-icon"></div><div className="tx-t"></div></div><div className="tx-amt"></div></div>
            <div className="tx-row"><div className="tx-l"><div className="tx-icon"></div><div className="tx-t"></div></div><div className="tx-amt"></div></div>
            <div className="tx-row" style={{"border":"none"}}><div className="tx-l"><div className="tx-icon"></div><div className="tx-t"></div></div><div className="tx-amt"></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>



  {/*  8. Pricing  */}
  <section className="pricing" id="pricing">
    <div className="section-header animate-on-scroll">
      <span className="section-eyebrow">Pricing</span>
      <h2 className="section-title">Free. No tricks.</h2>
      <p className="section-sub">ExpenseTrack is completely free and open source. No premium tier. No feature gating. No ads. Ever.</p>
    </div>
    
    <div className="pricing-card animate-on-scroll">
      <span className="plan-badge">Forever Free</span>
      <div className="price-wrap">
        <span className="price">₹0</span>
        <span className="per">/ month</span>
      </div>
      <div className="p-divider"></div>
      <ul className="p-features">
        <li><i>&#10003;</i> Unlimited expense tracking</li>
        <li><i>&#10003;</i> All chart types and analytics</li>
        <li><i>&#10003;</i> Budget tracking with alerts</li>
        <li><i>&#10003;</i> No ads, ever</li>
        <li><i>&#10003;</i> Open source — fork and self-host</li>
      </ul>
      <a href="/register" className="btn-primary btn-block">Create Free Account {"\u2192"}</a>
      <p className="p-footer">Because money stress is universal. Expense tracking shouldn't be paywalled.</p>
    </div>
  </section>

  {/*  9. Final CTA  */}
  <section className="final-cta">
    <h2 className="animate-on-scroll">Start knowing your money.</h2>
    <p className="animate-on-scroll" style={{"transitionDelay":"100ms"}}>Join thousands of professionals who stopped guessing and started understanding their finances.</p>
    <div className="cta-row animate-on-scroll" style={{"transitionDelay":"200ms"}}>
      <a href="/register" className="btn-primary btn-hero">Get Started Free {"\u2192"}</a>
      <a href="/login" className="btn-secondary">Sign in</a>
    </div>
    <p className="cta-note animate-on-scroll" style={{"transitionDelay":"300ms"}}>No credit card {"\u00B7"} No subscription {"\u00B7"} No nonsense</p>
  </section>

  {/*  10. Footer  */}
  <footer>
    <div className="f-logo-wrap">
      <a href="#" className="logo"><span className="logo-bullet"></span>Expense<span>Track</span></a>
      <p>Personal finance for serious people.</p>
    </div>
    
    <div className="f-creator">
      <p>Created by <strong>Jagadish Patil</strong></p>
      <div className="f-socials">
        <a href="https://github.com/jagadish-555" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.1.75-.24.75-.53v-1.88c-3.06.66-3.71-1.48-3.71-1.48-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.73-1.51-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.12-.28-.49-1.4.11-2.91 0 0 .93-.3 3.02 1.11a10.5 10.5 0 0 1 5.5 0c2.09-1.41 3.02-1.11 3.02-1.11.6 1.51.23 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.14-5.03 5.42.41.35.78 1.05.78 2.12v3.13c0 .29.2.64.76.53A11 11 0 0 0 12 1.27"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/jagadish-patil-283747322/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.847-3.037-1.848 0-2.13 1.445-2.13 2.939v5.667H9.362V9.083h3.411v1.551h.049c.475-.901 1.637-1.85 3.364-1.85 3.599 0 4.26 2.368 4.26 5.435v6.233zM5.337 7.514a2.062 2.062 0 1 1 0-4.125 2.063 2.063 0 0 1 0 4.125zM7.11 20.452H3.56V9.083h3.55v11.369z"/></svg>
        </a>
        <a href="https://x.com/jagadiship55" target="_blank" rel="noopener noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
        </a>
      </div>
    </div>

    <div className="f-links">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="https://github.com/jagadish-555/Multi-Wallet-FinTech-Expense-Budget-Platform">GitHub</a>
    </div>
    <div className="f-right">
      <p>{"\u00A9"} 2024 ExpenseTrack. MIT License.</p>
    </div>
  </footer>

  {/*  Scripts  */}
      </div>
  )
}
