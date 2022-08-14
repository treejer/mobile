import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';
import type {TAppDispatch, TReduxState} from '../../redux/store';

export const useAppSelector: TypedUseSelectorHook<TReduxState> = useSelector;

export const useAppDispatch = () => useDispatch<TAppDispatch>();
