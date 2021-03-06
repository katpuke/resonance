// @flow weak
import React, { PureComponent } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { transition, stop } from '../core/transition';
import { ENTER, UPDATE, LEAVE } from '../core/types';

export default class Node extends PureComponent {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array, // NodeGroup data
      PropTypes.func,  // TickGroup scale
    ]),

    type: PropTypes.string.isRequired,
    dkey: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,

    start: PropTypes.func.isRequired,

    enter: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,

    render: PropTypes.func.isRequired,

    removeKey: PropTypes.func.isRequired,
    lazyRemoveKey: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { dkey, removeKey, lazyRemoveKey } = this.props;

    (this:any).remove = () => {
      removeKey(dkey);
    };

    (this:any).remove.lazy = () => {
      lazyRemoveKey(dkey);
    };
  }

  state = this.props.start(this.props.node, this.props.index) || {};

  componentDidMount() {
    const { node, index, enter } = this.props;
    transition.call(this, enter(node, index));
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (next.data !== props.data) {
      const { type, node, index, enter, update, leave } = next;

      switch (type) {
        case ENTER:
          transition.call(
            this,
            enter(node, index),
          );
          break;
        case UPDATE:
          transition.call(
            this,
            update(node, index),
          );
          break;
        case LEAVE:
          transition.call(
            this,
            leave(node, index, this.remove),
          );
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    stop.call(this);
  }

  TRANSITION_SCHEDULES = {};

  remove = null;

  render() {
    const { state, props: { node, index, render, type } } = this;

    return render(node, state, index, type);
  }
}
