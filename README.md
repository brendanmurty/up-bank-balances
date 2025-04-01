# bank-account-balance

A small script for [Up bank](https://up.com.au/) users that lists your accounts, balances and recent transactions.

## Setup

1. [Install Deno 2.0](https://deno.land/#installation)
2. Setup your [Up Personal Access Token](https://api.up.com.au/getting_started) 
3. Copy `.env.example` to `.env`
4. Edit `.env` and set appropriate values for each variable
5. Create the `public` subdirectory: `mkdir public`

## Usage

### Terminal

```
deno task cli
```

### Local webserver

```
deno task server
```

Then open [localhost:8001](http://localhost:8001/) in your web browser.
