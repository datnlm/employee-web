// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import { AuthProvider } from './contexts/JWTContext';
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import NotistackProvider from './components/NotistackProvider';
import ThemeLocalization from './components/ThemeLocalization';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <Settings />
              <ScrollToTop />
              <AuthProvider>
                <Router />
              </AuthProvider>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
