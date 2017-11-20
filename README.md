
WATERSENSE 
==========

Watersense is an application for monitoring humidity in crops.
It is based on [Waziup](www.waziup.io) platform.

Install
-------

Watersense can be launched using docker-compose:
```
docker-compose up
```
Then open the following address on your browser: http://localhost:3000

Watersense uses Waziup backend. You can either use the online instance of Waziup, or launch a local instance.


Debug
-----

Watersense is composed of two components: the back-end and the front-end (in `server` and `client` folders respectively).

In order to test the back-end, you need to retrieve an access token from keycloak.
Make sure that the realm "watersense" exists in Keycloak, as well as a client "watersense".
A user "watersense" should also exist and have the attributes "Service", "ServicePath" and "permissions" correctly set. Each attribute should have a mapper.
Retrieve the token:
```
sudo echo "127.0.0.1 keycloak" >> /etc/hosts
TOKEN=`curl --data "grant_type=password&client_id=watersense&username=watersense&password=watersense" http://keycloak:8080/auth/realms/watersense/protocol/openid-connect/token | jq ".access_token" -r`
```

***Get sensors***


Then, you can test each access point using curl commands:
```
curl localhost:4000/api/v1/orion/v2/entities -H 'Fiware-Service:watersense' -H 'Fiware-ServicePath:/#' -H "Authorization: Bearer $TOKEN" | jq ".[].id"
```
The command above should yeld a list of watersense sensors.


***Get sensor data***

Sensor data is accessed through Elasticsearch.
To list all the indices:
```
curl localhost:80/api/v1/elasticsearch/_cat/indices -H 'Fiware-Service:watersense' -H 'Fiware-ServicePath:/#' -H "Authorization: Bearer $TOKEN"
```

