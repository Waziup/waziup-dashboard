import React from "react";
import ContentLoader from "react-content-loader";

const DeviceLoader = () => (
  <ContentLoader
    height={260}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="5" y="79" rx="3" ry="3" width="137" height="149" />
    <rect x="15" y="20" rx="0" ry="0" width="0" height="0" />
    <rect x="6" y="3" rx="0" ry="0" width="520" height="67" />
  </ContentLoader>
);

const ProjectLoader = () => (
  <ContentLoader
    height={500}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="11" y="101" rx="3" ry="3" width="137" height="149" />
    <rect x="15" y="20" rx="0" ry="0" width="0" height="0" />
    <rect x="104" y="6" rx="0" ry="0" width="421" height="88" />
    <rect x="11" y="257" rx="0" ry="0" width="515" height="155" />
    <rect x="10" y="6" rx="0" ry="0" width="90" height="88" />
    <rect x="97" y="68" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
);

const GatewayLoader = () => (
  <ContentLoader 
    height={500}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="15" y="20" rx="0" ry="0" width="0" height="0" /> 
    <rect x="8" y="6" rx="0" ry="0" width="518" height="81" /> 
    <rect x="97" y="68" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)

const ListLoader = () => (
  <ContentLoader 
    height={500}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="15" y="20" rx="0" ry="0" width="0" height="0" /> 
    <rect x="8" y="6" rx="0" ry="0" width="518" height="74" /> 
    <rect x="97" y="68" rx="0" ry="0" width="0" height="0" /> 
    <rect x="8" y="88" rx="0" ry="0" width="518" height="74" /> 
    <rect x="9" y="169" rx="0" ry="0" width="518" height="74" /> 
    <rect x="10" y="249" rx="0" ry="0" width="518" height="74" />
  </ContentLoader>
)

export { DeviceLoader, ProjectLoader, GatewayLoader, ListLoader };
