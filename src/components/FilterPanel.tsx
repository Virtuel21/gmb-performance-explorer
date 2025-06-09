
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface FilterPanelProps {
  filters: {
    city: string;
    department: string;
    group: string;
    minScore: number;
    period: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                <SelectItem value="paris">Paris</SelectItem>
                <SelectItem value="lyon">Lyon</SelectItem>
                <SelectItem value="marseille">Marseille</SelectItem>
                <SelectItem value="toulouse">Toulouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="75">Paris (75)</SelectItem>
                <SelectItem value="69">Rhône (69)</SelectItem>
                <SelectItem value="13">Bouches-du-Rhône (13)</SelectItem>
                <SelectItem value="31">Haute-Garonne (31)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Groupe</Label>
            <Select value={filters.group} onValueChange={(value) => updateFilter('group', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les groupes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les groupes</SelectItem>
                <SelectItem value="lockers">Lockers</SelectItem>
                <SelectItem value="points-relais">Points relais</SelectItem>
                <SelectItem value="boutiques">Boutiques</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Période</Label>
            <Select value={filters.period} onValueChange={(value) => updateFilter('period', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minScore">Note minimale: {filters.minScore}</Label>
            <Slider
              value={[filters.minScore]}
              onValueChange={(value) => updateFilter('minScore', value[0])}
              max={5}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
