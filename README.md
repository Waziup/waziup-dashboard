
Waziup dashboard
================

The Waziup dashboard allows visualize your sensors and applications.


Install
-------

To install and test locally, use the following:
```
$ npm install
$ REACT_APP_DASHBOARD_IDENTITY=false npm start
```

Deploy
------

Dashboard Dockerfile build & deployment:

```
docker build -t waziup/dashboard .
docker push waziup/dashboard

kubectl delete -f dashboard.yaml
kubectl apply -f dashboard.yaml
```

Debug
-----

after re-deploying dashboard, we need to restart apache (identity proxy)
kubectl exec -ti identityproxy-y5h7q --namespace=waziup --  /usr/sbin/httpd -k restart

kubectl exec -ti dashboard-no0lu --namespace=waziup --  bash

Development
-----------

The following environment variables can be used:

- REACT_APP_DASHBOARD_IDENTITY: set to false to avoid queries to identity server

