
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Reply, TrendingUp } from "lucide-react";

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
  // Données de démonstration (à remplacer par l'API réelle)
  const kpiData = {
    averageRating: 4.3,
    totalReviews: 1247,
    recentReviews: {
      "7": 23,
      "30": 89,
      "90": 245
    },
    responseRate: 78,
    modificationRate: 12
  };

  const cards = [
    {
      title: "Note moyenne",
      value: kpiData.averageRating.toFixed(1),
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
      value: kpiData.recentReviews[filters.period as keyof typeof kpiData.recentReviews],
      icon: TrendingUp,
      trend: "+8%",
      trendLabel: "vs période précédente",
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Taux de réponse",
      value: `${kpiData.responseRate}%`,
      icon: Reply,
      trend: "+5%",
      trendLabel: "vs mois dernier",
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

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
