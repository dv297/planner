import '../styles/global.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import createEmotionCache from '../lib/createEmotionCache';
import { theme } from '../lib/createTheme';

const queryClient = new QueryClient();
const clientSideEmotionCache = createEmotionCache();

interface CustomAppProps extends AppProps {
  emotionCache: EmotionCache;
}

type ComponentWithLayout = NextComponentType<NextPageContext, any> & {
  getLayout: undefined | (() => NextComponentType<NextPageContext, any>);
};

const App = (props: CustomAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const componentWithLayout = Component as ComponentWithLayout;
  const getLayout =
    componentWithLayout.getLayout || ((page: ReactNode) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={pageProps.session}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </SessionProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
};

export default App;