import {AsyncStorage} from 'react-native';
import {fromJS} from 'immutable';
const STATE_STORAGE_KEY = 'PepperoniAppTemplateAppState:Latest';

const NAVIGATION_STATE = 'navigationState'

export async function resetSnapshot() {
  // clearSnapshot()
  const state = await rehydrate();
  console.log('reHYDRATE state', state)
  if (state) {
    let newState = fromJS(state.app);
    // navigationState is not immutable
    newState[NAVIGATION_STATE] = state.navigation;
    console.log('reHYDRATE newState', newState)
    return newState;
  }

  return null;
}

export async function saveSnapshot(state) {
  // navigationState is not immutable
  let navigationState = state.get(NAVIGATION_STATE);
  state = state.delete(NAVIGATION_STATE);
  await persist({
    app: state.toJS(),
    navigation: navigationState,
  });
}

export async function clearSnapshot() {
  await clear();
}

/**
 * Saves provided state object to async storage
 *
 * @returns {Promise}
 */
async function persist(state) {
  console.log('PERSIST state', state)
  try {
    await AsyncStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error persisting application state', e);
  }
}

/**
 * Reads state object from async storage
 *
 * @returns {Promise}
 */
async function rehydrate() {
  try {
    const state = await AsyncStorage.getItem(STATE_STORAGE_KEY);
    return state
      ? JSON.parse(state)
      : null;
  } catch (e) {
    console.error('Error reading persisted application state', e);
    return null;
  }
}

async function clear() {
  try {
    await AsyncStorage.removeItem(STATE_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing peristed application state', e);
  }
}
