# Zitate Manager
A simple Webapp to manage funny quotes from your fellow Human beings.

## Setup
1. Install Packages -> `npm i`
2. Run the Server -> `npm run dev`

## Deployment
You can run the App via Docker. Just use `docker compose up` and it should be up and running.
First though, you should add a .env file like this one:
```env
DATABASE_URL="file:./dev.db"

# Used for Github OAuth (if you are using different OAuth providers define their Variables here)
GITHUB_ID=
GITHUB_SECRET=

# Used for Authentication. The URL has to be the same you use with the OAuth providers. The Secret should be some random string, probably just generate some HEX String
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## Todo-List / Roadmap
- [x] Authentification
- [x] Database
- [ ] Basic Backend
- [ ] Basic Frontend
- [ ] Nicer Frontend
