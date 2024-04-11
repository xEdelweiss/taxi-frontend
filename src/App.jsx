import Client from './blocks/Client.jsx';
import Driver from './blocks/Driver.jsx';
import Admin from './blocks/Admin.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <div className="min-h-screen">
      <div className="bg grid min-h-screen grid-cols-2 md:grid-cols-3">
        <div className="col-span-1 grid grid-rows-2 md:col-span-1">
          <div className="border-b-2 border-gray-500">
            <ErrorBoundary>
              <Client />
            </ErrorBoundary>
          </div>

          <div>
            <ErrorBoundary>
              <Driver />
            </ErrorBoundary>
          </div>
        </div>

        <div className="relative col-span-1 border-l-2 border-gray-500 md:col-span-2">
          <ErrorBoundary>
            <Admin />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
