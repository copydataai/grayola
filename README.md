# Grayola - Design as a Service


## About
1. Create "roles" table
 - insert "customer", "product manager", "designer"
2. Create "project" table
 - title, description, customer_id
 - allow multiple image history or files
 - files: create a new table with a relation one-to-many 


## Quick Start

To get it running, follow the steps below:

### Setup dependencies

``` sh
git clone https://github.com/copydataai/grayola.git
cd grayola
pnpm install

cp .env.example .env

# Please ensure to update your envs to your actual supabase & postgresURI
nvim .env


pnpm dev
```


