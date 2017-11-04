# Projet Mobile Hybrid: server

## Autors
* robert_u (Thomas Robert de Saint Vincent)
* vibrac_b (Benjamin Vibrac)

## About the project:
This is a game in development at a stage before a pre-alpha, that's why the game rules are not all implemented.
We imagine this game like a sim-city but with an aspect of community, which mean that in a close future, players would need help from other people in order to make the city grow by building relationships between cities.
Thanks to the module we plan to make the game happen.

## Prerequisites
* Mongo **must** be installed and running

## Install:
```
$ npm install
```
then
```
$ npm run build
$ npm run serve
```
You will need the [client](https://github.com/desaintvincent/mobile_client.git)

## Technicals features:
* Websockets
* nodejs

## Known Bugs:
* When you restart server after launch a cron, the cron will never be executed