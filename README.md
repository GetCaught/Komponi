# Komponi - Influencer Collaboration Portal

A modern web application built for connecting influencers with companies for collaboration opportunities. Built with Next.js 14, Supabase, TypeScript, and TailwindCSS.

## 🚀 Features

### For Influencers
- Create detailed profiles showcasing reach and engagement
- Browse and filter campaigns by category
- Apply to campaigns with compelling pitches
- Track application status
- Manage social media handles and categories

### For Companies
- Create targeted campaigns with budgets and requirements
- Browse influencer profiles and metrics
- Review and manage applications
- Accept/reject applications
- Track campaign performance

### Platform Features
- Secure authentication with Supabase Auth
- Role-based access control
- Real-time data updates
- Mobile-responsive design
- Category-based matching system
- Application management system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend & Auth**: Supabase
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL (via Supabase)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd influencer-collaboration-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('influencer', 'company')) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  company_name TEXT,
  industry TEXT,
  company_size TEXT,
  followers_count INTEGER,
  engagement_rate DECIMAL(5,2),
  categories TEXT[],
  social_media_handles JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  requirements TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pitch TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table (for future chat feature)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES
  ('Fashion & Beauty', 'Fashion, beauty, and lifestyle content'),
  ('Technology', 'Tech reviews, tutorials, and gadget content'),
  ('Food & Cooking', 'Food, recipes, and cooking content'),
  ('Travel', 'Travel vlogs, tips, and destination content'),
  ('Fitness & Health', 'Workout routines, health tips, and wellness content'),
  ('Gaming', 'Gaming streams, reviews, and esports content'),
  ('Education', 'Educational content, tutorials, and learning resources'),
  ('Entertainment', 'Entertainment, comedy, and lifestyle content');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Companies can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'company'
    )
  );

CREATE POLICY "Anyone can view active campaigns" ON campaigns
  FOR SELECT USING (status = 'active');

CREATE POLICY "Companies can view their own campaigns" ON campaigns
  FOR SELECT USING (
    company_id = auth.uid() OR status = 'active'
  );

CREATE POLICY "Companies can update their own campaigns" ON campaigns
  FOR UPDATE USING (company_id = auth.uid());

CREATE POLICY "Influencers can apply to campaigns" ON applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'influencer'
    )
  );

CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (
    influencer_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = applications.campaign_id 
      AND campaigns.company_id = auth.uid()
    )
  );

CREATE POLICY "Companies can update applications for their campaigns" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = applications.campaign_id 
      AND campaigns.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages they're part of" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'role')::text,
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
influencer-collaboration-portal/
├── app/
│   ├── api/
│   │   └── messages/          # Messaging API endpoints
│   ├── campaigns/
│   │   ├── browse/           # Campaign browsing page
│   │   ├── create/           # Campaign creation form
│   │   └── [id]/             # Campaign detail page
│   ├── dashboard/
│   │   ├── influencer/       # Influencer dashboard
│   │   └── company/          # Company dashboard
│   ├── login/                # Login page
│   ├── profile/
│   │   └── edit/             # Profile editing
│   ├── signup/               # Signup page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── AuthForm.tsx          # Shared auth component
│   ├── CampaignCard.tsx      # Campaign display component
│   └── InfluencerCard.tsx    # Influencer display component
├── lib/
│   └── supabase.ts           # Supabase client & types
├── public/                   # Static assets
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- Real-time chat system
- Advanced search and filtering
- Analytics dashboard
- Payment integration
- Mobile app
- Email notifications
- Advanced campaign management tools
- Influencer verification system
