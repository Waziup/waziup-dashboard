import React, {Component} from 'react';
import ClearFix from 'material-ui/internal/ClearFix';
import spacing from 'material-ui/styles/spacing';
import PropTypes from 'prop-types';
const desktopGutter = spacing.desktopGutter;

class  FullWidthSection extends Component {

    getDefaultProps() {
      return {
        useContent: false,
        contentType: 'div'
      };
    }

    getStyles() {
      return {
        root: {
          paddingTop: desktopGutter,
          paddingBottom: desktopGutter * 2,
          boxSizing: 'border-box'
        },
        content: {
          maxWidth: 1200,
          padding: '0 20',
          margin: '0 auto'
        }
      };
    }

    render() {
      const {
        style,
        useContent,
        contentType,
        contentStyle
      } = this.props;

      const styles = this.getStyles();

      let content;
      if (useContent) {
        content = React.createElement(
          contentType,
          {style: Object.assign(styles.content, contentStyle)},
          this.props.children
        );
      } else {
        content = this.props.children;
      }

      return (
        <ClearFix
          style={Object.assign(styles.root,style)}
        >
            {content}
        </ClearFix>
      );
    }
};

FullWidthSection.propTypes = {
      children: PropTypes.node,
      contentStyle: PropTypes.object,
      contentType:PropTypes.string,
      style: PropTypes.object,
      useContent: PropTypes.bool
}
export default FullWidthSection;

