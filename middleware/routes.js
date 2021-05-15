/* eslint-disable require-jsdoc */
import moment from 'moment';

export default function({store, redirect, route}) {
  const authenticated = store.getters['client/expiresIn'] >= +moment();
  if (!authenticated && route.path != '/') {
    return redirect('/');
  }
}
