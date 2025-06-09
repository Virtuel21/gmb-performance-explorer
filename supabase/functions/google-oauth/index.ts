
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      throw new Error('Non authentifié')
    }

    const url = new URL(req.url)
    let code = url.searchParams.get('code')

    if (!code) {
      try {
        const body = await req.json()
        code = body.code
      } catch (_) {
        // ignore body parse errors
      }
    }

    if (!code) {
      throw new Error('Code OAuth manquant')
    }

    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: Deno.env.get('GOOGLE_REDIRECT_URI') ?? '',
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      throw new Error(`Erreur OAuth: ${tokenData.error_description}`)
    }

    // Récupérer les informations du profil Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    const profileData = await profileResponse.json()

    // Calculer la date d'expiration du token
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

    // Sauvegarder le compte Google dans la base de données
    const { error: dbError } = await supabaseClient
      .from('google_accounts')
      .upsert({
        user_id: user.id,
        google_account_id: profileData.id,
        email: profileData.email,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'user_id,google_account_id'
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ success: true, email: profileData.email }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erreur OAuth Google:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
