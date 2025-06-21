# Deployment Instructions for Render

## 🚨 **CRITICAL: Environment Variables**

Your deployment is failing because the `DATABASE_URL` environment variable is not set in Render.

### **Step 1: Set Environment Variable in Render Dashboard**

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your service: **mpp-exam-bdf3**
3. Click on the **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:caNxum-xagciq-8muzwi@db.imniflevkzovvsqtpxjf.supabase.co:5432/postgres`

### **Step 2: Redeploy**

After adding the environment variable:
1. Go to the **Settings** tab
2. Click **Manual Deploy** 
3. Or simply push a new commit to trigger auto-deploy

### **Step 3: Verify Database Connection**

Once deployed with the correct DATABASE_URL:
1. Visit your deployed app: https://mpp-exam-bdf3.onrender.com/vote
2. Try to register a voter
3. The database connection should now work

## **Build Process**

The build command is now: `prisma db push && next build`

This ensures:
- Database schema is deployed to Supabase
- Prisma client is generated with correct schema
- Next.js builds with proper database connection

## **Environment Variables Needed:**

- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `NODE_ENV` - Automatically set by Render (production)

## **Troubleshooting**

If you still get database connection errors:
1. Verify the DATABASE_URL is exactly: `postgresql://postgres:caNxum-xagciq-8muzwi@db.imniflevkzovvsqtpxjf.supabase.co:5432/postgres`
2. Check that your Supabase database is running
3. Ensure no typos in the environment variable name (`DATABASE_URL`)

## **Local Development**

For local development, create a `.env` file with:
```
DATABASE_URL="postgresql://postgres:caNxum-xagciq-8muzwi@db.imniflevkzovvsqtpxjf.supabase.co:5432/postgres"
NODE_ENV="development"
``` 