# Database Setup Guide

## 1. Environment Variables

Create a `.env` file in the root directory with:

```
DATABASE_URL="postgresql://postgres:caNxum-xagciq-8muzwi@db.imniflevkzovvsqtpxjf.supabase.co:5432/postgres"
NODE_ENV="development"
```

## 2. Database Migration

Run the following commands to set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Deploy the schema to the database
npx prisma db push
```

## 3. Optional: View Database

To view your database in a browser:

```bash
npx prisma studio
```

## 4. Deployment to Render

For deployment to Render, make sure to:

1. Set the `DATABASE_URL` environment variable in Render's dashboard
2. The database will be automatically migrated on deployment

## 5. Testing the Voting System

1. **Register a voter**: Go to `/vote` and register with a 13-digit CNP and your name
2. **Login**: Use the same CNP to login
3. **Vote**: Navigate to any candidate's detail page and cast your vote
4. **Verify**: Try to vote again - you should see that you've already voted

## Database Schema

The voting system uses these tables:

- `Voter`: Stores voter information (CNP as primary key, name, hasVoted flag)
- `Vote`: Stores individual votes (links voter CNP to candidate ID)
- Unique constraint ensures one vote per voter

## API Endpoints

- `POST /api/voters` - Register a new voter
- `POST /api/voters/login` - Login with CNP
- `POST /api/votes` - Cast a vote
- `GET /api/votes` - Get voting statistics 