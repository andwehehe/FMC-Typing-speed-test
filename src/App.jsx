import Dashboard from "./Pages/Dashboard/Dashboard"
import StatsContextProvider from "./Features/TextField/StatsContext"

 function App() {

  return(
    <>
      <StatsContextProvider>
          <Dashboard />
      </StatsContextProvider>
    </>
  )
 }

 export default App