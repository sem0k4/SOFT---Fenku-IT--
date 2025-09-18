import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bot, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ChatbotTest = () => {
  const [tests, setTests] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testCases = [
      {
        name: "Initialisation du service d'authentification",
        test: () => {
          try {
            // Test simple d'import
            const auth = require('../services/auth');
            return { success: true, message: "Service d'authentification chargé" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
      },
      {
        name: "Initialisation du service chatbot",
        test: () => {
          try {
            const chatbotService = require('../services/chatbotService').default;
            return { success: true, message: "Service chatbot chargé" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
      },
      {
        name: "Test des composants UI",
        test: () => {
          try {
            // Test d'import des composants
            const Button = require('./ui/button').Button;
            const Card = require('./ui/card').Card;
            return { success: true, message: "Composants UI chargés" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
      },
      {
        name: "Test du hook useChatbot",
        test: () => {
          try {
            const useChatbot = require('../hooks/useChatbot').useChatbot;
            return { success: true, message: "Hook useChatbot chargé" };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
      }
    ];

    for (const testCase of testCases) {
      try {
        const result = testCase.test();
        setTests(prev => [...prev, {
          name: testCase.name,
          success: result.success,
          message: result.message,
          timestamp: new Date()
        }]);
        
        // Délai pour voir les résultats
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        setTests(prev => [...prev, {
          name: testCase.name,
          success: false,
          message: error.message,
          timestamp: new Date()
        }]);
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (success) => {
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (success) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Succès" : "Échec"}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Test du Chatbot Médical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? "Tests en cours..." : "Lancer les tests"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setTests([])}
                disabled={isRunning}
              >
                Effacer les résultats
              </Button>
            </div>

            {tests.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Résultats des tests :</h3>
                {tests.map((test, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.success)}
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-gray-600">{test.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.success)}
                      <span className="text-xs text-gray-500">
                        {test.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Résumé :</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {tests.filter(t => t.success).length} sur {tests.length} tests réussis
                  </p>
                </div>
              </div>
            )}

            {isRunning && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Exécution des tests...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotTest;

