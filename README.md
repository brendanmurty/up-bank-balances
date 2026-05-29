# bank-account-balance

A small script for [Up bank](https://up.com.au/) users that lists your accounts, balances and recent transactions.

## Setup

1. Install the [latest stable release of Deno](https://deno.com/)
2. Setup your [Up Personal Access Token](https://api.up.com.au/getting_started) 
3. Copy `.up.sample.env` to `.up.env`
4. Edit `.up.env` and set appropriate values for each variable
5. Create the `public` subdirectory: `mkdir public`

## Usage

### Terminal

```bash
deno task cli
```

### Local web server

```bash
deno task web
```

Then open [localhost:8001](http://localhost:8001/) in your web browser.
