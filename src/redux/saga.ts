import {all} from 'redux-saga/effects';
import {TStoreRedux} from 'redux/store';
import {initSagas} from './modules/init/init';

export default function* root(store: TStoreRedux) {
  yield all([initSagas()]);
}
