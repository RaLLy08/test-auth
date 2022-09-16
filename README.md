docker build . -t [image name]

docker run -p [inside port]:[outside port] -d --name [new container name] [image name]

JWT tokens working principles:

  +--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+


(A) The client requests an access token by authenticating with the authorization server and presenting an authorization grant.

(B) The authorization server authenticates the client and validates the authorization grant, and if valid, issues an access token and a refresh token.

(C) The client makes a protected resource request to the resource server by presenting the access token.

(D) The resource server validates the access token, and if valid, serves the request.

(E) Steps (C) and (D) repeat until the access token expires. If the client knows the access token expired, it skips to step (G); otherwise, it makes another protected resource request.

(F) Since the access token is invalid, the resource server returns an invalid token error.

(G) The client requests a new access token by authenticating with the authorization server and presenting the refresh token. The client authentication requirements are based on the client type and on the authorization server policies.

(H) The authorization server authenticates the client and validates the refresh token, and if valid, issues a new access token (and, optionally, a new refresh token).

A brief description of the logic:

Signup: 
  User logins with (login, password).
    1) Identification.
        a) If exists throw error.
        b) Save user.
            1) Hashing password by secret key.
            2) Create user in db.

Sigin:
  User logins with (login, password, device fingerprint).
    1) Identification.
        a) If not exists throw error.
    2) Authentication.
        a) Hashing password by secret key and comparing with password in db if no match throw error.
    3) Authorization.
        a) Creates access token (contains: user entity except password) returns as response.
        b) Creates refresh token (contains: login) and sets to cookie and write it to the db.
            1) If not exists: creates new refresh token entity in db with userId relationship.
            2) If exists:
              When fingerprint same userId same: replaces current token in db with new.
              When fingerprint differs userId same: creates new entity in db for new device.

Refresh:
  1) Verify Refresh token
  2) Compares passed refresh token with stored in db
  3) Decodes and extracts login from refresh token
  4) Find user by login and makes Refresh, Access tokens by secret key with new exp time