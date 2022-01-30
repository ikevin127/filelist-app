<p align="center">
  <a href="https://filelist.io/">
    <img alt="Filelist" src="https://i.epvpimg.com/TI5dbab.png">
  </a>
</p>

# 💭 About

> **React Native App** based on **Filelist API**. Filelist is a private romanian torrent tracker that recently developed an API that allows its **registered users** to get information about torrents using their **Username** and **Passkey**.

# 📲 App features

> Recent search keywords history

> State management w/ **Redux Ducks**

> Language support: **Romanian & English**

> Custom function for handling **font size responsiveness**

> Options for changing font size to: **Small, Medium or Large**

> Data persistence w/ **@react-native-async-storage/async-storage**

> Connection listener ON | OFF w/ **@react-native-community/netinfo**

> Layout responsiveness using **rem** units w/ **react-native-extended-stylesheet**

> API Error handling for all **Error codes** listed at the bottom of the **API description**

# ![Google Play Logo](https://www.gstatic.com/android/market_images/web/favicon_v2.ico "Google Play Logo") Google Play Store
**[Filelist App](https://play.google.com/store/apps/details?id=com.baderproductions.fl)**

# 📋 API description

```sh
# General info

- All calls to the API have to be sent as a GET request
- All the arguments listed below are set as parameters in the call URL
- Every API call requires authentication with Username and Passkey
- Every user is limited to 150 API calls per hour

# Authentication

 Parameters:
   username
   passkey
 Example: https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]

 # Parameters & endpoints

 Parameters:
   action
 Valid values: search-torrents, latest-torrents
 Example: https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]&action=search-torrents

 Additional parameters for action=search-torrents
   type               Valid values: imdb, name
   query              If you choose imdb as type, it is accepted in two forms: tt4719744 or 4719744;
   name               Accepted as an optional parameter if type=imdb. Also searches in the name field.
   category           Valid values: IDs from categories, multiple values ​​separated by a comma are accepted.
   moderated          Valid values: 0,1
   internal           Valid values: 0,1
   freeleech          Valid values: 0,1
   doubleup           Valid values: 0,1
   output             Valid values: json, rss. Default is JSON.
   season             Valid values integers
   episode            Valid values integers

 Additional parameters for action=latest-torrents
   limit         Maximum number of torrents displayed in the request. Can be 1-100. Default value: 100
   imdb          Accepted as: tt4719744 or 4719744
   category      Valid values: IDs from categories, multiple values ​​separated by a comma are accepted.
   output        Valid values: json, rss. Default is JSON.

 Examples:
   https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]&action=search-torrents&type=name&query=Gemini
   https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]&action=search-torrents&type=imdb&query=tt4719744&category=4,19
   https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]&action=latest-torrents
   https://filelist.io/api.php?username=[USERNAME]&passkey=[PASSKEY]&action=latest-torrents&output=rss

 # Category ID Codes

+----+------------------+
| id | name             |
+----+------------------+
|  1 | Filme SD         |
|  2 | Filme DVD        |
|  3 | Filme DVD-RO     |
|  4 | Filme HD         |
|  5 | FLAC             |
|  6 | Filme 4K         |
|  7 | XXX              |
|  8 | Programe         |
|  9 | Jocuri PC        |
| 10 | Jocuri Console   |
| 11 | Audio            |
| 12 | Videoclip        |
| 13 | Sport            |
| 14 | TV               |
| 15 | Desene           |
| 16 | Docs             |
| 17 | Linux            |
| 18 | Diverse          |
| 19 | Filme HD-RO      |
| 20 | Filme Blu-Ray    |
| 21 | Seriale HD       |
| 22 | Mobile           |
| 23 | Seriale SD       |
| 24 | Anime            |
| 25 | Filme 3D         |
| 26 | Filme 4K Blu-Ray |
| 27 | Seriale 4K       |
+----+------------------+

 # Error codes

 400 - Invalid search/filter
 401 - Username and passkey cannot be empty.
 403 - Too many failed authentications
 403 - Invalid passkey/username
 429 - Rate limit reached
 503 - Service unavailable

```

## :scroll: License

MIT © [BADERproductions.co.uk](https://baderproductions.co.uk/)
