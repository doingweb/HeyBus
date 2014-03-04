HeyBus
======

The official Pullman Transit bus locator app is not very fun to use on a phone, which tends to be what I'm holding while I'm on my way to my stop. HeyBus aims to be more fun. http://apps.chrisdoingweb.com/heybus.

HeyBus is an Angular SPA. It runs entirely in-browser and uses the same web service as [the official Pullman Transit bus locator](http://pullman.mapstrat.com/nextvehicle/Map.aspx), to retrieve information about routes and bus locations.

## Building

Install Node.js packages:

```sh
$ npm install
```

Install Bower packages:

```sh
$ bower install
```

Build!

```sh
$ grunt build
```

Built files will show up in the `dist` folder.

_Note: These instructions may be incomplete. If you find that to be the case, please [submit a pull request](https://github.com/doingweb/HeyBus/pulls)._
