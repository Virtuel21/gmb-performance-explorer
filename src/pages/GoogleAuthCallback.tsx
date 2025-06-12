import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/");
      return;
    }

    interface GoogleOAuthResponse {
      success?: boolean;
      email?: string;
      error?: string;
    }

    const finishAuth = async () => {
      const { data, error } = await supabase.functions.invoke<GoogleOAuthResponse>("google-oauth", {
        body: { code },
      });

      if (error) {
        console.error("Invocation google-oauth échouée:", error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de connecter Google",
          variant: "destructive",
        });
      } else if (data && data.error) {
        console.error("Erreur retournée par google-oauth:", data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Compte Google connecté",
          description: data?.email,
        });
      }

      navigate("/");
    };

    finishAuth();
  }, [navigate, toast]);

  return <p className="p-4">Connexion à Google…</p>;
};

export default GoogleAuthCallback;
