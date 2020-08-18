  

# Viedo api  
  

The official viedo api for clients.  
  

# Methods
Available api methods with route, query, path or body
## User api
#### Create user 
Create a user with email, username and password.

POST `/user/create`
Body `{email, username, password}`
Response `{token:'xxxxxxxxxxxxxxxxxxxxxx}`

#### Login the user 
Login the user with email or username and password.

POST `/user/login`
Body `{emailOrUsername, password}`
Response `{token:'xxxxxxxxxxxxxxxxxxxxxx}`

#### Logout the user 
Logout the user with email or username and password.

POST `/user/logout`
Headers `{token:'xxxxxxxxxxxxxxxxxxxxxx'}`
Response `true`



## Geolocation api
#### Update location 
Update latest user geo location

POST `/geo/update`
Headers `{token:'xxxxxxxxxxxxxxxxxxxxxx'}`
Body `{peerId, location}`
Response `{status:'ok'}`

#### Active users around the place 
Get the user around the place that has active camera

GET `/geo/around?lng=xx.xx,lat=xx.xx`
Headers `{token:'xxxxxxxxxxxxxxxxxxxxxx'}`
Response 
`[{id:'xxxxxxxxxxxxxxxxx', userName: 'username', peerId: 'aaaaaaa-bbbbb-cccc', location: {lat:xx.xx, lng:'xx.xx'}}
]`

