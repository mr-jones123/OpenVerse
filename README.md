# OpenVerse✨

## Greetings🙋‍♂️
Hey everyone! I know how awesome [Paraverse](https://paraverse.feutech.edu.ph/portal/) is. It brings us iTamaraws closer to one another. My favorite feature of Paraverse is definitely briefcase🤗💼. Anyway, the problem I find with Paraverse is we can't see under the hood. We don't know how it works or what makes it tick. That is absolutelty fine though! It is FEU Tech's property.

But that does not stop a madlad like me to create my own version of Paraverse. I call it **OpenVerse**. I want to cultivate a sense of transparency and collaboration between experienced and new developers in FEU Tech. So here it is, currently in development and open-source.

## Why OpenVerse❓
The best advantage of OpenVerse is that it is built on the modern, industry-based technology like Next.js. I think it is the best framework for begginers to start on. It is convienient because you can easily deploy your own version of this app using Vercel. And since the latter is serverless, you can expect to run it without cost. I also use Supabase for the database of Aral and used Prisma as the ORM. Lastly, I used Tailwind to make components faster and easier. I don't want to mimic the services made by Paraverse since it is far too complex for one man to handle. But since it is open-source, in the future I want to see students build features on their own.

## Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- A Supabase account
- A Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/OpenVerse.git
   cd OpenVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials (see Supabase setup below)

4. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - In your project dashboard, go to Settings > API
   - Copy the following values to your `.env.local`:
     - `SUPABASE_URL` (Project URL)
     - `SUPABASE_ANON_KEY` (anon public key)
     - `SUPABASE_SERVICE_ROLE_KEY` (service_role secret key)
   - Go to Settings > Database and copy the connection string to `DATABASE_URL`

5. **Configure Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Deployment to Vercel

1. **Connect your repository**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project" and import your GitHub repository

2. **Configure environment variables**
   - In your Vercel project settings, add all environment variables from your `.env.local`
   - Make sure to use the production Supabase credentials

3. **Deploy**
   - Vercel will automatically deploy your application
   - Any push to the main branch will trigger a new deployment

# OpenVerse Services:
## Aral
Aral is a centralized platform where you can get the best resources to advance your college career. Personally, I used a lot of these and helped me to become an AI Engineer. I want you to do the same (but 100x better than me😉).

<img width="1889" height="868" alt="image" src="https://github.com/user-attachments/assets/e5a19d36-d641-4bf1-b18b-0dc15f479935" />


