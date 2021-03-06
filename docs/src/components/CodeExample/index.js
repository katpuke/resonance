// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'react-docgen';
import ClearFix from 'material-ui/internal/ClearFix';
import Paper from 'material-ui/Paper';
import CodeBlock from './CodeBlock';

class CodeExample extends Component {
  static propTypes = {
    children: PropTypes.node,
    code: PropTypes.string.isRequired,
    component: PropTypes.bool,
    description: PropTypes.string,
    exampleBlockStyle: PropTypes.object,
    layoutSideBySide: PropTypes.bool,
    title: PropTypes.string,
  };

  static defaultProps = {
    component: true,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  render() {
    const {
      children,
      code,
      component,
      exampleBlockStyle,
      layoutSideBySide,
    } = this.props;

    const palette = this.context.muiTheme.rawTheme.palette;
    const canvasColor = palette.canvasColor;

    const styles = {
      root: {
        backgroundColor: canvasColor,
        marginBottom: 32,
      },
      exampleBlock: {
        borderRadius: '0 0 2px 0',
        padding: '14px 24px 24px',
        margin: 0,
        width: layoutSideBySide ? '45%' : null,
        float: layoutSideBySide ? 'right' : null,
      },
    };

    const docs = component ? parse(code) : {};

    return (
      <Paper style={styles.root}>
        <CodeBlock
          title={this.props.title}
          description={this.props.description || docs.description}
        >
          {code}
        </CodeBlock>
        <ClearFix style={Object.assign(styles.exampleBlock, exampleBlockStyle)}>
          {children}
        </ClearFix>
      </Paper>
    );
  }
}

export default CodeExample;
