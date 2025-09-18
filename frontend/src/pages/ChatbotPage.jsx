import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Bot, 
  Stethoscope, 
  FileText, 
  Heart, 
  AlertTriangle,
  Sparkles,
  Brain,
  Shield,
  Activity
} from 'lucide-react';
import ChatbotContainer from '../components/ChatbotContainer';

const ChatbotPage = () => {
  const features = [
    {
      icon: Stethoscope,
      title: "Préconsultation",
      description: "Préparez votre consultation en répondant à des questions ciblées sur vos symptômes.",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Dossier Médical",
      description: "Consultez vos allergies, médicaments, antécédents et rendez-vous en temps réel.",
      color: "text-green-600"
    },
    {
      icon: Heart,
      title: "Conseils Médicaux",
      description: "Recevez des conseils personnalisés sur la nutrition, l'exercice et le bien-être.",
      color: "text-red-600"
    },
    {
      icon: AlertTriangle,
      title: "Urgences",
      description: "Détection automatique des situations d'urgence avec redirection vers les services appropriés.",
      color: "text-orange-600"
    }
  ];

  const stats = [
    { label: "Conversations", value: "1,234", icon: Bot },
    { label: "Préconsultations", value: "456", icon: Stethoscope },
    { label: "Conseils donnés", value: "2,890", icon: Heart },
    { label: "Urgences détectées", value: "23", icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assistant Médical IA
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Votre compagnon intelligent pour la santé. Préconsultation, conseils médicaux, 
            consultation de votre dossier et détection d'urgences en temps réel.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section de démonstration */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Démonstration Interactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium">
                  <Brain className="h-4 w-4" />
                  IA Médicale Avancée
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Cliquez sur le bouton flottant en bas à droite pour commencer une conversation 
                avec votre assistant médical intelligent.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Sécurisé et confidentiel
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Activity className="h-3 w-3 mr-1" />
                  Temps réel
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Brain className="h-3 w-3 mr-1" />
                  Intelligence artificielle
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions d'utilisation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Ouvrir le Chatbot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur le bouton flottant en bas à droite de l'écran pour ouvrir l'assistant médical.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                Choisir un Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sélectionnez le mode qui correspond à vos besoins : préconsultation, dossier médical, ou conseils.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                Interagir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Posez vos questions ou utilisez les suggestions pour obtenir des réponses personnalisées.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chatbot Container */}
      <ChatbotContainer />
    </div>
  );
};

export default ChatbotPage;

