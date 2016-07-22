import {fromJS} from 'immutable';

import {NavigationExperimental} from 'react-native';

const {StateUtils: NavigationStateUtils} = NavigationExperimental;

// Actions
const PUSH_ROUTE = 'NavigationState/PUSH_ROUTE';
const POP_ROUTE = 'NavigationState/POP_ROUTE';
const SWITCH_TAB = 'NavigationState/SWITCH_TAB';
const NAVIGATION_COMPLETED = 'NavigationState/NAVIGATION_COMPLETED';

export function switchTab(tabKey) {
  return {
    type: SWITCH_TAB,
    tabKey,
  };
}

// Action creators
export function pushRoute(route) {
  return {
    type: PUSH_ROUTE,
    route,
  };
}

export function popRoute() {
  return {type: POP_ROUTE};
}

// reducers for tabs and scenes are separate
// routes titles are used in <NavigationHeader.Title>
// TODO find a way to avoid fromJS/toJS on navigationState
// ideally we could avoid fromJS since NavigationExperimental
// requires the navigationState to be plain JS,
// but state hydrated from the snapshots is immutable
// const initialState = fromJS({
//   tabs: {
//     index: 0,
//     routes: [
//       {key: 'HomeTab', title: 'HOME'},
//       {key: 'ProfileTab', title: 'PROFILE'},
//     ],
//   },
//   // Scenes for the `HomeTab` tab.
//   HomeTab: {
//     index: 0,
//     routes: [{key: 'Counter', title: 'Counter Screen'}],
//   },
//   // Scenes for the `ProfileTab` tab.
//   ProfileTab: {
//     index: 0,
//     routes: [{key: 'Color', title: 'Color Screen'}],
//   },
// });
const initialState = {
  tabs: {
    index: 0,
    routes: [
      {key: 'HomeTab', title: 'HOME'},
      {key: 'ProfileTab', title: 'PROFILE'},
    ],
  },
  // Scenes for the `HomeTab` tab.
  HomeTab: {
    index: 0,
    routes: [{key: 'Counter', title: 'Counter Screen'}],
  },
  // Scenes for the `ProfileTab` tab.
  ProfileTab: {
    index: 0,
    routes: [{key: 'Color', title: 'Color Screen'}],
  },
};

export default function NavigationReducer(state = initialState, action) {
  let {type} = action;
  if (type === 'BackAction') {
    type = POP_ROUTE;
  }

  switch (type) {
    case PUSH_ROUTE: {
      // Push a route into the scenes stack.
      const route = action.route;
      const {tabs} = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = NavigationStateUtils.push(scenes, route);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes,
        };
      }
      break;
    }

    case POP_ROUTE: {
      // Pops a route from the scenes stack.
      const {tabs} = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes,
        };
      }
      break;
    }

    case SWITCH_TAB: {
      console.log('SWITCH_TAB', state)
      // Switches the tab.
      const tabKey = action.tabKey;
      console.log('SWITCH_TAB', tabKey)
      const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey);
      console.log('SWITCH_TAB', tabs)
      if (tabs !== state.tabs) {
        return {
          ...state,
          tabs,
        };
      }
      break;
    }
  }
  return state;
}
