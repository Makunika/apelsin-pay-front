// routes
import {SnackbarProvider} from "notistack";
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

export default function App() {
  
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <Router />
      </ThemeConfig>
    </SnackbarProvider>
  );
}
