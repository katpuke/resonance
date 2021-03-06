// @flow weak
import React, { PureComponent } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { transition, stop } from '../core/transition';
import { ENTER, UPDATE, LEAVE } from '../core/types';

export default class Tick extends PureComponent {
  static propTypes = {
    scale: PropTypes.func.isRequired,
    cache: PropTypes.func.isRequired,

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

  state = this.props.start(this.props.node, this.props.index, this.props.cache);

  componentDidMount() {
    const { node, index, enter, cache } = this.props;
    transition.call(this, enter(node, index, cache));
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (next.scale !== props.scale) {
      const { type, node, index, cache } = next;

      switch (type) {
        case ENTER:
          transition.call(
            this,
            next.enter(node, index, cache),
          );
          break;
        case UPDATE:
          transition.call(
            this,
            next.update(node, index, cache),
          );
          break;
        case LEAVE:
          transition.call(
            this,
            next.leave(node, index, cache, this.remove),
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
