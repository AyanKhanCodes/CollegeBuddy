import ChatBox from './components/ChatBox.jsx'

function App() {
  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">CollegeBuddy</h1>
          <p className="app-subtitle">The Only Counselor That Never Sleeps</p>
        </header>
        <ChatBox />
        <footer className="app-footer">
          <span className="app-footer-text">Your Pocket Guide to Surviving Finals</span>
        </footer>
      </div>
    </div>
  )
}

export default App
