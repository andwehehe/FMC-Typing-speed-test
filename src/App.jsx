import Dashboard from "./Pages/Dashboard/Dashboard"
import TimerContextProvider from "./Features/TextField/TimerContext"

 function App() {

  return(
    <>
      <TimerContextProvider>
          <Dashboard />
      </TimerContextProvider>
    </>
  )
 }

 export default App