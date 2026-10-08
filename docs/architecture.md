# The Manna Architecture

## Product Boundary

The Manna combines customer-facing commerce with operational workflows for restaurant staff and administrators.

~~~text
Customer Experience
       │
       ▼
Next.js Application
       │
       ├──────────────┐
       ▼              ▼
   Prisma          Auth / APIs
       │              │
       └──────┬───────┘
              ▼
         PostgreSQL
              │
       Operational Data
~~~

## Core Domains

- Customer ordering
- Product management
- Inventory
- POS workflows
- Sales reporting
- Affiliate/referral tracking
- Administrative management

## Data and Business Logic

Prisma provides the application data boundary to PostgreSQL. Business workflows are implemented in the application layer rather than relying on the UI to enforce operational rules.

## Engineering Focus

### Commerce + operations
The application connects an online ordering experience with internal operational workflows rather than treating the storefront as an isolated website.

### Reporting
Sales data is surfaced through reporting and dashboard workflows so operational users can inspect business activity.

### Responsive product surface
The customer-facing experience is designed as a responsive web application while administrative workflows support more operationally dense interfaces.

## Deployment

The original project was deployed through Vercel. The custom production domain is no longer active; the repository remains as a portfolio record of the implementation.