# all-my-gh-health

Set of scripts to check the health of all an account's gh-pages repo CNAMEs

Originally made for https://github.com/h5bp/lazyweb-requests/issues/165

## Usage

Set up the prerequisites:

```bash
./setup.sh
```

Anonymously check the health of CNAMEs of a user's repos with gh-pages:

```
./checkall.sh stuartpb
```

If you set up a new [personal access token][1], you can use it for more accurate / non-rate-limited results:

```
./checkall.sh stuartpb OAUTH_TOKEN_GOES_HERE
```

[1]: https://github.com/settings/tokens
