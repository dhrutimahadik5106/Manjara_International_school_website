import { PortalDataProvider } from './context/PortalDataContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <PortalDataProvider><AppRoutes /></PortalDataProvider>
    </AuthProvider>
  );
}

export default App;

