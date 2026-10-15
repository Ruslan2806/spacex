## SpaceX Stats

This app shows SpaceX launches from [Launch Library 2](https://ll.thespacedevs.com/docs), with launchpad locations plotted on the map. Hover over a launch (or focus it with the keyboard) to highlight its launchpad.

The app requests the 100 most recent SpaceX launches. Launch Library 2 allows up to 100 results per request and limits unauthenticated use to 15 requests per hour. The launchpad data is taken from each launch response, so the app makes one API request when it loads.

Start the development server:

```sh
npm install
npm start
```

Open the local URL printed by Parcel, usually `http://localhost:1234`.


