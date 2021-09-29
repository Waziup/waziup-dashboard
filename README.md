WAZIUP dashboard 
================

The WAZIUP dashboard is the web front-end for [Waziup](www.waziup.io).

Install
-------

First install Yarn:
```
https://classic.yarnpkg.com/en/docs/install
```

Then, the dashboard can be run standalone with:
```
yarn install
yarn start
```

You can also run it against the Cloud instance:
```
API_SERVER_URL=https://api.waziup.io/api KEYCLOAK_URL=https://keycloak.waziup.io/auth yarn start
```

You can also run it against the your local Cloud instance:
```
API_SERVER_URL=http://localhost:800/api KEYCLOAK_URL=http://localhost:8080/auth yarn start
```


Copyright
---------

Copyright 2016-2020 WAZIUP.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

