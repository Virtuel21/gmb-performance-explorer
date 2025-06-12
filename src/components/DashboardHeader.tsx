
import { Building2, TrendingUp, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const DashboardHeader = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard GMB Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Suivi de vos fiches Google Business Profile
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Connecté à Google
          </Badge>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Exporter les données
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
