import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { AppContextProvider } from '../context';

import createEmotionCache from '../utils/createEmotionCache';
import darkThemeOptions from '../styles/theme/darkThemeOptions';
import '../styles/globals.css';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const darkTheme = createTheme(darkThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <AppContextProvider>
            <Component {...pageProps} />
          </AppContextProvider>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
