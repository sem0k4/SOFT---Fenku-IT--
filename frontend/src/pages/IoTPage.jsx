import React from 'react';
import IoTMonitor from '../components/IoTMonitor';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const IoTPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Monitoring IoT - Capteurs de Santé
          </h1>
          <p className="text-gray-600">
            Surveillance en temps réel des données du capteur MAX30614 via ESP32
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* IoT Monitor - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <IoTMonitor />
          </div>

          {/* Side Panel - Information and Controls */}
          <div className="space-y-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations Système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capteur:</span>
                    <span className="font-medium">MAX30614</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Microcontrôleur:</span>
                    <span className="font-medium">ESP32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocole:</span>
                    <span className="font-medium">WebSocket</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fréquence:</span>
                    <span className="font-medium">1 Hz</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Assurez-vous que l'ESP32 est connecté au WiFi</p>
                  <p>• Vérifiez que le capteur MAX30614 est correctement branché</p>
                  <p>• Les données s'affichent automatiquement une fois la connexion établie</p>
                  <p>• En cas de problème, consultez les logs de debug</p>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détails Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-gray-500">
                  <p><strong>WebSocket URL:</strong> ws://localhost:8000/ws/esp32/</p>
                  <p><strong>Monitoring URL:</strong> ws://localhost:8000/ws/iot-monitoring/</p>
                  <p><strong>Reconnexion:</strong> Automatique (5s)</p>
                  <p><strong>Timeout:</strong> 30s</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Prototype IoT - Application de Santé | Django + React + ESP32</p>
        </div>
      </div>
    </div>
  );
};

export default IoTPage;