/* eslint-disable require-jsdoc */
import moment from 'moment';
import {Middleware} from '@nuxt/types';

const routes: Middleware = ({redirect, route}) => {
  const expiresAt = localStorage.getItem('expires_at') as unknown as number;
  const authenticated = expiresAt >= +moment();
  if (!authenticated && route.path != '/') {
    return redirect('/');
  }
};

export default routes;
