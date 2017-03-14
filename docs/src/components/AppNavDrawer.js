// @flow weak

import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

const SelectableList = makeSelectable(List);

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
  },
  version: {
    paddingLeft: spacing.desktopGutterLess,
    fontSize: 16,
  },
};

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  handleRequestChangeLink = (event, value) => {
    window.location = value;
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
    } = this.props;

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          Resonance
        </div>
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          <ListItem
            primaryText="Documentation"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem
                primaryText="App Bar"
                value="/documentation/app-bar"
                href="#/documentation/app-bar"
              />,
              <ListItem
                primaryText="Auto Complete"
                value="/documentation/auto-complete"
                href="#/documentation/auto-complete"
              />,
              <ListItem
                primaryText="Avatar"
                value="/documentation/avatar"
                href="#/documentation/avatar"
              />,
              <ListItem
                primaryText="Badge"
                value="/documentation/badge"
                href="#/documentation/badge"
              />,
            ]}
          />
          <ListItem
            primaryText="Examples"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem
                primaryText="Alphabet"
                value="/examples/alphabet"
                href="#/examples/alphabet"
              />,
              <ListItem
                primaryText="States Bar Chart"
                value="/examples/states-by-age"
                href="#/examples/states-by-age"
              />,
              <ListItem
                primaryText="Stacked Area Chart"
                value="/examples/stacked-area"
                href="#/examples/stacked-area"
              />,
              <ListItem
                primaryText="Alphabet"
                value="/examples/alphabet"
                href="#/examples/alphabet"
              />,
            ]}
          />
        </SelectableList>
        <Divider />
        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <Subheader>Resources</Subheader>
          <ListItem primaryText="GitHub" value="https://github.com/sghall/resonance" />
          <ListItem primaryText="React" value="http://facebook.github.io/react" />
        </SelectableList>
      </Drawer>
    );
  }
}

export default AppNavDrawer;