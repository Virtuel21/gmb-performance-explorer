
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, Download } from "lucide-react";
import type { Filters } from "@/components/FilterPanel";

interface ReviewsTableProps {
  filters: Filters;
}

const ReviewsTable = ({ filters }: ReviewsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Données de démonstration
  const reviewsData = [
    {
      id: 1,
      etablissement: "Boutique Paris Centre",
      ville: "Paris",
      auteur: "Marie D.",
      note: 5,
      commentaire: "Excellent service, personnel très accueillant !",
      date: "2024-06-08",
      repondu: true
    },
    {
      id: 2,
      etablissement: "Point Relais Lyon",
      ville: "Lyon",
      auteur: "Jean M.",
      note: 4,
      commentaire: "Bon service mais temps d'attente un peu long.",
      date: "2024-06-07",
      repondu: false
    },
    {
      id: 3,
      etablissement: "Locker Marseille",
      ville: "Marseille",
      auteur: "Sophie L.",
      note: 2,
      commentaire: "Problème avec le code d'accès, pas d'aide disponible.",
      date: "2024-06-06",
      repondu: true
    },
    {
      id: 4,
      etablissement: "Boutique Toulouse",
      ville: "Toulouse",
      auteur: "Pierre R.",
      note: 5,
      commentaire: "Parfait ! Très satisfait de mon expérience.",
      date: "2024-06-05",
      repondu: true
    },
    {
      id: 5,
      etablissement: "Point Relais Nice",
      ville: "Nice",
      auteur: "Anna K.",
      note: 3,
      commentaire: "Service correct mais locaux un peu vétustes.",
      date: "2024-06-04",
      repondu: false
    }
  ];

  const getStarColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating === 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (repondu: boolean) => {
    return repondu ? (
      <Badge className="bg-green-100 text-green-800">Répondu</Badge>
    ) : (
      <Badge variant="outline" className="border-orange-200 text-orange-800 bg-orange-50">En attente</Badge>
    );
  };

  const filteredReviews = reviewsData.filter(review =>
    review.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.commentaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Avis récents</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Établissement</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{review.etablissement}</TableCell>
                  <TableCell>{review.ville}</TableCell>
                  <TableCell>{review.auteur}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className={`h-4 w-4 fill-current ${getStarColor(review.note)}`} />
                      <span className="font-medium">{review.note}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.commentaire}</TableCell>
                  <TableCell>{new Date(review.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{getStatusBadge(review.repondu)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsTable;
