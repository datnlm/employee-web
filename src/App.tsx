// routes
import Router from './routes';
// hooks
import useAuth from './hooks/useAuth';
// theme
import ThemeConfig from './theme';
// components
import { AuthProvider } from './contexts/JWTContext';
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import NotistackProvider from './components/NotistackProvider';
import ThemeLocalization from './components/ThemeLocalization';
// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <Settings />
              <ScrollToTop />
              <AuthProvider>{isInitialized ? <Router /> : <LoadingScreen />}</AuthProvider>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
