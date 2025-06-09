
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Filters } from "@/components/FilterPanel";

interface ChartsSectionProps {
  type: "ratings" | "reviews" | "evolution" | "geographic";
  filters: Filters;
}

const ChartsSection = ({ type, filters }: ChartsSectionProps) => {
  // Données de démonstration
  const ratingsData = [
    { name: "5 étoiles", value: 65, count: 810 },
    { name: "4 étoiles", value: 20, count: 249 },
    { name: "3 étoiles", value: 8, count: 100 },
    { name: "2 étoiles", value: 4, count: 50 },
    { name: "1 étoile", value: 3, count: 38 }
  ];

  const evolutionData = [
    { month: "Jan", avis: 45, note: 4.2 },
    { month: "Fév", avis: 52, note: 4.1 },
    { month: "Mar", avis: 48, note: 4.3 },
    { month: "Avr", avis: 61, note: 4.4 },
    { month: "Mai", avis: 55, note: 4.2 },
    { month: "Juin", avis: 67, note: 4.3 }
  ];

  const geographicData = [
    { ville: "Paris", avis: 245, note: 4.2 },
    { ville: "Lyon", avis: 189, note: 4.4 },
    { ville: "Marseille", avis: 156, note: 4.1 },
    { ville: "Toulouse", avis: 134, note: 4.3 },
    { ville: "Nice", avis: 98, note: 4.5 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderChart = () => {
    switch (type) {
      case "ratings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Répartition des avis par étoiles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "reviews":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Nombre d'avis par note</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "evolution":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Évolution des avis et notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="avis" fill="#10B981" />
                  <Line yAxisId="right" type="monotone" dataKey="note" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case "geographic":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Répartition géographique</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ville" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avis" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderChart();
};

export default ChartsSection;
