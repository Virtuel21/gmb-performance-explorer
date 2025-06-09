
-- Table pour stocker les comptes Google connectés
CREATE TABLE public.google_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  google_account_id TEXT NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, google_account_id)
);

-- Table pour stocker les établissements Google Business Profile
CREATE TABLE public.business_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  google_account_id UUID REFERENCES public.google_accounts NOT NULL,
  location_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  department TEXT,
  group_type TEXT,
  phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(google_account_id, location_id)
);

-- Table pour stocker les avis récupérés
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.business_locations NOT NULL,
  google_review_id TEXT NOT NULL,
  author_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date TIMESTAMP WITH TIME ZONE NOT NULL,
  response_text TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location_id, google_review_id)
);

-- Table pour stocker les métriques quotidiennes
CREATE TABLE public.daily_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.business_locations NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  searches INTEGER DEFAULT 0,
  actions INTEGER DEFAULT 0,
  calls INTEGER DEFAULT 0,
  direction_requests INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location_id, date)
);

-- RLS policies pour google_accounts
ALTER TABLE public.google_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own Google accounts" ON public.google_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own Google accounts" ON public.google_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own Google accounts" ON public.google_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own Google accounts" ON public.google_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS policies pour business_locations
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their business locations" ON public.business_locations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.google_accounts WHERE google_accounts.id = business_locations.google_account_id AND google_accounts.user_id = auth.uid())
);
CREATE POLICY "Users can create business locations" ON public.business_locations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.google_accounts WHERE google_accounts.id = business_locations.google_account_id AND google_accounts.user_id = auth.uid())
);
CREATE POLICY "Users can update their business locations" ON public.business_locations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.google_accounts WHERE google_accounts.id = business_locations.google_account_id AND google_accounts.user_id = auth.uid())
);

-- RLS policies pour reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view reviews of their locations" ON public.reviews FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.business_locations bl 
    JOIN public.google_accounts ga ON bl.google_account_id = ga.id 
    WHERE bl.id = reviews.location_id AND ga.user_id = auth.uid()
  )
);

-- RLS policies pour daily_metrics
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view metrics of their locations" ON public.daily_metrics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.business_locations bl 
    JOIN public.google_accounts ga ON bl.google_account_id = ga.id 
    WHERE bl.id = daily_metrics.location_id AND ga.user_id = auth.uid()
  )
);

-- Fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour auto-update des timestamps
CREATE TRIGGER update_google_accounts_updated_at BEFORE UPDATE ON public.google_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_business_locations_updated_at BEFORE UPDATE ON public.business_locations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
