import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Chrome, RefreshCw, Unlink } from "lucide-react";

interface GoogleAccount {
  id: string;
  email: string;
  google_account_id: string;
  token_expires_at: string | null;
}

const GoogleAuth = () => {
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchGoogleAccounts();
      }
    });
  }, []);

  const fetchGoogleAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('google_accounts')
        .select('id, email, google_account_id, token_expires_at');

      if (error) throw error;
      setGoogleAccounts(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes Google:', error);
    }
  };

  const connectGoogle = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        setIsLoading(false);
        return;
      }
      // Rediriger vers l'OAuth Google
      const redirectUrl = `${window.location.origin}/auth/google/callback`;
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        toast({
          title: "Configuration manquante",
          description: "VITE_GOOGLE_CLIENT_ID n'est pas défini",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=https://www.googleapis.com/auth/business.manage&response_type=code&access_type=offline&prompt=consent`;

      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncGoogleData = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-data');
      
      if (error) throw error;
      
      toast({
        title: "Synchronisation réussie",
        description: "Les données Google Business Profile ont été mises à jour",
      });
      
      // Rafraîchir la page pour voir les nouvelles données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser les données Google",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectGoogle = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('google_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
      
      toast({
        title: "Compte déconnecté",
        description: "Le compte Google a été déconnecté avec succès",
      });
      
      fetchGoogleAccounts();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter le compte Google",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Chrome className="h-5 w-5 text-blue-600" />
          Connexion Google Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {googleAccounts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Connectez votre compte Google pour récupérer automatiquement vos métriques Google Business Profile
            </p>
            <Button 
              onClick={connectGoogle} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Chrome className="h-4 w-4 mr-2" />
              )}
              Connecter Google
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {googleAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Chrome className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{account.email}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Connecté
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={syncGoogleData}
                    disabled={isSyncing}
                    variant="outline"
                    size="sm"
                  >
                    {isSyncing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => disconnectGoogle(account.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Unlink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={syncGoogleData} 
              disabled={isSyncing}
              className="w-full"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Synchroniser les données
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAuth;