import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import LogoDark from './images/alfresco-white-horizontal.png';
import LogoLight from './images/alfresco-black-horizontal.png';
import { Box, Stack } from '@mui/material';
import { DockerContainers } from './alfresco/DockerContainers';
import React from 'react';

export const App = () => {
  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <Stack direction="column" spacing={2}>
        <Box
          component="img"
          sx={{
            alignSelf: 'right',
            marginTop: '30px',
            marginBottom: '10px',
            maxHeight: { xs: 400, md: 600 },
            maxWidth: { xs: 400, md: 600 },
          }}
          src={isDarkTheme ? LogoDark : LogoLight}
        />
      </Stack>
      <DockerContainers />
    </DockerMuiThemeProvider>
  );
};
