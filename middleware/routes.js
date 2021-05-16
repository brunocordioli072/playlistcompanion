/* eslint-disable require-jsdoc */
import moment from 'moment';

export default function({store, redirect, route, $auth}) {
  const authenticated = localStorage.getItem('expires_at') >= +moment();
  if (!authenticated && route.path != '/') {
    return redirect('/');
  }
}
