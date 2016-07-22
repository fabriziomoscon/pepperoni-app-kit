import {connect} from 'react-redux';
import {pushRoute, popRoute, switchTab, navigationCompleted} from './NavigationState';
import NavigationView from './NavigationView';

export default connect(
  state => ({
    // navigationState: state.get('navigationState').toJS(),
    navigationState: state.get('navigationState'),
  }),
  dispatch => ({
    switchTab(index) {
      dispatch(switchTab(index));
    },
    pushRoute(index) {
      dispatch(pushRoute(index))
    },
    onNavigateBack() {
      dispatch(popRoute());
    },
    onNavigateCompleted() {
      dispatch(navigationCompleted());
    }
  })
)(NavigationView);
