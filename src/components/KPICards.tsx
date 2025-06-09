
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Reply, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface KPICardsProps {
  filters: {
    city: string;
    department: string;
    group: string;
    minScore: number;
    period: string;
  };
}

const KPICards = ({ filters }: KPICardsProps) => {
  // Récupérer les données réelles depuis Supabase
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews-kpis', filters],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          business_locations!inner(
            city,
            department,
            group_type
          )
        `)
        .gte('review_date', new Date(Date.now() - parseInt(filters.period) * 24 * 60 * 60 * 1000).toISOString());

      // Appliquer les filtres
      if (filters.city !== 'all') {
        query = query.eq('business_locations.city', filters.city);
      }
      if (filters.department !== 'all') {
        query = query.eq('business_locations.department', filters.department);
      }
      if (filters.group !== 'all') {
        query = query.eq('business_locations.group_type', filters.group);
      }
      if (filters.minScore > 0) {
        query = query.gte('rating', filters.minScore);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: totalReviewsData } = useQuery({
    queryKey: ['total-reviews', filters],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          business_locations!inner(
            city,
            department,
            group_type
          )
        `);

      // Appliquer les filtres géographiques
      if (filters.city !== 'all') {
        query = query.eq('business_locations.city', filters.city);
      }
      if (filters.department !== 'all') {
        query = query.eq('business_locations.department', filters.department);
      }
      if (filters.group !== 'all') {
        query = query.eq('business_locations.group_type', filters.group);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Calculer les KPIs à partir des données réelles
  const kpiData = {
    averageRating: reviewsData && reviewsData.length > 0 
      ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
      : 0,
    totalReviews: totalReviewsData?.length || 0,
    recentReviews: reviewsData?.length || 0,
    responseRate: reviewsData && reviewsData.length > 0
      ? (reviewsData.filter(review => review.response_text).length / reviewsData.length) * 100
      : 0
  };

  const cards = [
    {
      title: "Note moyenne",
      value: kpiData.averageRating > 0 ? kpiData.averageRating.toFixed(1) : "N/A",
      icon: Star,
      trend: "+0.2",
      trendLabel: "vs mois dernier",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Total avis",
      value: kpiData.totalReviews.toLocaleString(),
      icon: MessageSquare,
      trend: "+15%",
      trendLabel: "vs mois dernier",
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: `Avis (${filters.period}j)`,
      value: kpiData.recentReviews,
      icon: TrendingUp,
      trend: "+8%",
      trendLabel: "vs période précédente",
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Taux de réponse",
      value: `${kpiData.responseRate.toFixed(0)}%`,
      icon: Reply,
      trend: "+5%",
      trendLabel: "vs mois dernier",
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color.replace('bg-', 'text-')}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                {card.trend}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {card.trendLabel}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
