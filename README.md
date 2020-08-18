  

# Viedo api  
  

The official viedo api for clients.  
  

# Methods
Available api methods with route, query, path or body
## User api
#### Create user 
Create a user with email, username and password.
<blockquote>

    POST /user/create
    Body {email, username, password}
    Response `{token:'xxxxxxxxxxxxxxxxxxxxxx'}
</blockquote>

#### Login 
Login with email or username and password.
<blockquote>

    POST /user/login
    Body {emailOrUsername, password}
    Response {token:'xxxxxxxxxxxxxxxxxxxxxx'}
</blockquote>

#### Logout 
Logout with email or username and password.
<blockquote>

    POST /user/logout
    Headers {token:'xxxxxxxxxxxxxxxxxxxxxx'}
    Response true
</blockquote>


## Geolocation api
#### Update location 
Update latest user geo location.
<blockquote>

    POST `/geo/update`
    Headers `{token:'xxxxxxxxxxxxxxxxxxxxxx'}`
    Body `{peerId, location}`
    Response `{status:'ok'}`
</blockquote>

#### Active users around the place 
Get the list of active users around the location.
<blockquote>

    GET /geo/around?lng=xx.xx,lat=xx.xx
    Headers {token:'xxxxxxxxxxxxxxxxxxxxxx'}
    Response 
    [{id:'xxxxxxxxxxxxxxxxx', userName: 'username', peerId: 'aaaaaaa-bbbbb-cccc', location: {lat:xx.xx, lng:'xx.xx'}}
    ]
</blockquote>

# Running with Docker

`docker-compose up -d`

If you want to customize options you can edit docker-compose.yaml file.  
You need to set up a reverse proxy with a valid SSL certificate and a domain to reverse https requests to viedo api with port 80 and peerjs with port 9000.


