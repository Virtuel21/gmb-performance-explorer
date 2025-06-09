
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

    // Récupérer les comptes Google de l'utilisateur
    const { data: googleAccounts, error: accountsError } = await supabaseClient
      .from('google_accounts')
      .select('*')
      .eq('user_id', user.id)

    if (accountsError) throw accountsError

    if (!googleAccounts || googleAccounts.length === 0) {
      throw new Error('Aucun compte Google connecté')
    }

    for (const account of googleAccounts) {
      let accessToken = account.access_token

      // Vérifier si le token a expiré et le rafraîchir si nécessaire
      if (account.token_expires_at && new Date(account.token_expires_at) <= new Date()) {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
            refresh_token: account.refresh_token,
            grant_type: 'refresh_token',
          }),
        })

        const refreshData = await refreshResponse.json()
        accessToken = refreshData.access_token

        // Mettre à jour le token dans la base de données
        const expiresAt = new Date(Date.now() + refreshData.expires_in * 1000)
        await supabaseClient
          .from('google_accounts')
          .update({
            access_token: accessToken,
            token_expires_at: expiresAt.toISOString(),
          })
          .eq('id', account.id)
      }

      // Récupérer les établissements Google Business Profile
      const locationsResponse = await fetch('https://mybusiness.googleapis.com/v4/accounts/me/locations', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        
        for (const location of locationsData.locations || []) {
          // Sauvegarder ou mettre à jour l'établissement
          await supabaseClient
            .from('business_locations')
            .upsert({
              google_account_id: account.id,
              location_id: location.name,
              name: location.locationName,
              address: location.address?.addressLines?.join(', '),
              city: location.address?.locality,
              department: location.address?.administrativeArea,
              phone: location.primaryPhone,
              website: location.websiteUrl,
            }, {
              onConflict: 'google_account_id,location_id'
            })

          // Récupérer les avis récents
          const reviewsResponse = await fetch(`https://mybusiness.googleapis.com/v4/${location.name}/reviews`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          })

          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json()
            
            for (const review of reviewsData.reviews || []) {
              await supabaseClient
                .from('reviews')
                .upsert({
                  location_id: location.name,
                  google_review_id: review.reviewId,
                  author_name: review.reviewer?.displayName,
                  rating: review.starRating,
                  comment: review.comment,
                  review_date: new Date(review.createTime).toISOString(),
                  response_text: review.reviewReply?.comment,
                  response_date: review.reviewReply?.updateTime ? new Date(review.reviewReply.updateTime).toISOString() : null,
                }, {
                  onConflict: 'location_id,google_review_id'
                })
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Données synchronisées avec succès' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erreur synchronisation Google:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
