import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  colors,
  Stack,
  Typography,
} from '@mui/material';

import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import React, { useEffect, useReducer, Reducer } from 'react';
import { DockerContainerList } from './DockerContainerList';
import { ServiceStore, Action, AlfrescoStates } from './types';
import { resources } from '../helper/resources';
import {
  serviceReducer,
  defaultAlfrescoState,
  getAlfrescoServices,
} from './services';
import {
  canRun,
  isRunning,
  canStop,
  isLoading,
  isStopping,
  isError,
} from './queryState';
import { runContainers, stopContainers } from '../helper/cli';
import { ALFRESCO_7_2_CONFIGURATION } from './configuration';

const CommandPanel = ({ alfrescoState, dispatch }) => {
  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
        <Button
          disabled={!canRun(alfrescoState)}
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            runContainers(ALFRESCO_7_2_CONFIGURATION);
            dispatch({ type: 'START_ALFRESCO' });
          }}
          startIcon={<PlayIcon />}
        >
          {!isRunning(alfrescoState) ? 'Run' : 'Running...'}
        </Button>
        <Button
          disabled={!canStop(alfrescoState)}
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            stopContainers(ALFRESCO_7_2_CONFIGURATION);
            dispatch({ type: 'STOP_ALFRESCO' });
          }}
          startIcon={<StopIcon />}
        >
          {alfrescoState !== AlfrescoStates.STOPPING ? 'Stop' : 'Stopping...'}
        </Button>
      </Stack>
    </React.Fragment>
  );
};

const FeedbackPanel = ({ alfrescoState }) => {
  if (isLoading(alfrescoState) || isStopping(alfrescoState))
    return (
      <Box
        sx={{
          marginBottom: '15px',
          textAlign: 'center',
        }}
      >
        <Typography>{alfrescoState}</Typography>
        <CircularProgress
          size={30}
          sx={{
            color: colors.blue[500],
          }}
        />
      </Box>
    );
  return <></>;
};

export const DockerContainerCreate = () => {
  const [alfresco, dispatch] = useReducer<Reducer<ServiceStore, Action>>(
    serviceReducer,
    defaultAlfrescoState(ALFRESCO_7_2_CONFIGURATION)
  );

  const refreshContainers = async () => {
    let result = await getAlfrescoServices(ALFRESCO_7_2_CONFIGURATION);
    dispatch({ type: 'REFRESH_SERVICE_STATE', payload: result });
  };

  // run refresh containers on load
  useEffect(() => {
    refreshContainers();
  }, []);

  // refresh every 1.5 secs to check state
  useEffect(() => {
    let timer = setTimeout(refreshContainers, 1500);
    if (alfresco.alfrescoState === AlfrescoStates.NOT_ACTIVE)
      clearTimeout(timer);
    return () => {
      clearTimeout(timer);
    };
  }, [alfresco]);

  let errorComponent: {};
  if (isError(alfresco.alfrescoState)) {
    errorComponent = (
      <Box>
        <Alert severity="error">
          <AlertTitle>{resources.CREATE.ERROR}</AlertTitle>
          {alfresco.errors}
        </Alert>
      </Box>
    );
  }

  return (
    <React.Fragment>
      {errorComponent}
      <CommandPanel
        alfrescoState={alfresco.alfrescoState}
        dispatch={dispatch}
      />
      <FeedbackPanel alfrescoState={alfresco.alfrescoState} />
      <DockerContainerList alfresco={alfresco} />
    </React.Fragment>
  );
};
