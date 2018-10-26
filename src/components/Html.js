import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../config';

class Html extends React.Component {

  render() {
    const { vendor, client, app, children } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title> WAZIUP </title>
          <meta name="description" content="IoT dashboard for Arduino, Raspberry PI and LoRa"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link key={vendor} rel="preload" href={vendor} as="script" />
          <link key={client} rel="preload" href={client} as="script" />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <link rel="stylesheet" href="/index.css" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css"/>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.css"/>

        </head>
        <body>
          <div id="app" className="content-wrap" dangerouslySetInnerHTML={{ __html: children }} />
          <script dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }} />
          <script key={vendor} src={vendor} />
          <script key={client} src={client} />
          {config.analytics.googleTrackingId &&
            <script dangerouslySetInnerHTML={{__html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + `ga('create','${config.analytics.googleTrackingId}','auto');ga('send','pageview')` }} />}
          {config.analytics.googleTrackingId &&
            <script src="https://www.google-analytics.com/analytics.js" async defer/>}
        </body>
      </html>
    );
  }

  static propTypes = {
    app: PropTypes.object,
    children: PropTypes.string.isRequired,
  };

}

export default Html;
