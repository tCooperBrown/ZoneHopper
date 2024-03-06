# PreReq:

- Have MongoDB installed and running.
- Have nodemon installed globally.
- Install npm modules from within the client folder and the server folder.

# Steps to run:

1. You will need a Google API key. Visit https://console.cloud.google.com ,create an account and set up a billing profile. This is a paid service, however you should be offered something like £200 of free credit to get you started so you shouldn't be charged anything.
2. Within your Google Cloud Console enable the API named "Places API (New)". Do not use the old version of the Places API.
3. Create a file named ".env" and place it in the server's root directory. Within your ".env" file write a single line taking the format: `API_KEY=""` and then paste your key between the quotes.
4. Navigate to "client/api-client-service.js". Overwrite BASE_URL to be your own internet adapter's IPv4 address with port 3000. On Windows you can find this by running "ipconfig". On Mac OS you can find this by running "ifconfig" - once you find the correct adapter copy the "inet" (not "inet6") address. This will look like either 192.X.X.X or 10.X.X.X.
5. In a terminal navigate to the server directory. Run "nodemon".
6. In a seperate terminal session navigate to the client directory. Run "npx expo start".
7. Download "Expo Go" from your phone's app store.
8. Scan the QR code from the client terminal session.
9. The app should now be bundled and usable on your phone.

## NOTE: I abandoned checking Android emulation early on in the project to focus on making it look presentable on my own iPhone. Different sized screens or the use of Android phone may yield different results to what you saw in my product demo video.
