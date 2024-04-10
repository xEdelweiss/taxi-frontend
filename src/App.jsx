import { useState } from 'react'
import Client from "./components/Client.jsx";
import Driver from "./components/Driver.jsx";
import Admin from "./components/Admin.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 min-h-screen">
        <div className="col-span-1 grid grid-rows-2 md:col-span-1">
          <div className="border-gray-500 border-b-2">
            <Client />
          </div>

          <div>
            <Driver />
          </div>
        </div>

        <div className="relative col-span-1 md:col-span-2 border-gray-500 border-l-2">
          <Admin />
        </div>
      </div>
    </div>
  )
}

export default App
