// Third party libraries
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

// Local libraries
import { fmt } from './string';

const request = (method, path, params, { enqueueSnackbar, setData, setLoading }) => {
  setLoading(true);
  fetch(`${window.location.origin}${fmt(path, params)}`, { method })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }

      throw Error('Request failed');
    })
    .then((data) => {
      if (method != 'get') {
        enqueueSnackbar('Success!', { variant: 'success' });
      }
      setData(data);
      setLoading(false);
    })
    .catch((error) => {
      enqueueSnackbar(`An error has occurred: ${error}`, { variant: 'error' });
      setLoading(false);
    })
};

export const getLoginURL = (next) => (
  `/oauth/google/start?next=${encodeURIComponent(next)}`
);

export const doLogin = (next) => {
  window.location.assign(getLoginURL(next));
};

export const useGet = (path, initialData, params={}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const call = () => {
    request('get', path, params, { enqueueSnackbar, setData, setLoading });
  };

  useEffect(() => {
    call();
  }, []);

  return { data, loading, call };
}

export const usePost = (path, initialData) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const call = (params={}) => {
    request('post', path, params, { enqueueSnackbar, setData, setLoading });
  };

  return { data, loading, call };
}

export const useDelete = (path, initialData) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const call = (params={}) => {
    request('delete', path, params, { enqueueSnackbar, setData, setLoading });
  };

  return { data, loading, call };
}

export const globalEmail = () => window.globals?.session?.email;

export const globalSession = () => window.globals?.session;

export const hasActiveSession = () => (
  ![null, undefined].includes(globalEmail())
);

export const ensureActiveSession = () => {
  // Redirect to index as there is no session
  if (!hasActiveSession()) {
    window.location.assign('/')
  }
}
