
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/DashboardHeader";
import KPICards from "@/components/KPICards";
import ChartsSection from "@/components/ChartsSection";
import ReviewsTable from "@/components/ReviewsTable";
import FilterPanel from "@/components/FilterPanel";
import GoogleAuth from "@/components/GoogleAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: "all",
    department: "all",
    group: "all",
    minScore: 0,
    period: "30"
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />
        
        <GoogleAuth />
        
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
        
        <KPICards filters={filters} />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="reviews">Avis récents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartsSection type="ratings" filters={filters} />
              <ChartsSection type="reviews" filters={filters} />
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ChartsSection type="evolution" filters={filters} />
              <ChartsSection type="geographic" filters={filters} />
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewsTable filters={filters} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
