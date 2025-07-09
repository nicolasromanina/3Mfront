import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Headphones } from 'lucide-react';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'faq' | 'contact'>('chat');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Votre message a été envoyé avec succès !');
    setContactForm({ subject: '', message: '', priority: 'normal' });
  };

  const faqItems = [
    {
      question: "Comment puis-je suivre ma commande ?",
      answer: "Vous pouvez suivre votre commande dans la section 'Mes Commandes' de votre espace client. Vous recevrez également des notifications par email à chaque étape."
    },
    {
      question: "Quels formats de fichiers acceptez-vous ?",
      answer: "Nous acceptons les formats PDF, JPG, PNG, DOC, DOCX, et la plupart des formats d'image courants. Pour de meilleurs résultats, nous recommandons le PDF en haute résolution."
    },
    {
      question: "Quels sont vos délais de livraison ?",
      answer: "Les délais varient selon le type de service : 24-48h pour les flyers, 2-3 jours pour les cartes de visite, 3-5 jours pour les brochures. Les délais urgents sont disponibles sur demande."
    },
    {
      question: "Comment modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier votre commande tant qu'elle n'est pas en cours de production. Contactez-nous via le chat ou par email pour toute modification."
    },
    {
      question: "Proposez-vous des remises pour les gros volumes ?",
      answer: "Oui, nous proposons des tarifs dégressifs pour les commandes importantes. Contactez notre équipe commerciale pour obtenir un devis personnalisé."
    },
    {
      question: "Comment obtenir un devis personnalisé ?",
      answer: "Vous pouvez demander un devis directement depuis notre formulaire de commande. Notre équipe vous répondra dans les plus brefs délais."
    }
  ];

  const tabs = [
    { id: 'chat', label: 'Chat en direct', icon: MessageCircle },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Nous contacter', icon: Mail }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Client</h1>
        <p className="text-gray-600 mt-2">
          Notre équipe est là pour vous aider. Choisissez le moyen de contact qui vous convient.
        </p>
      </div>

      {/* Informations de contact rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Téléphone</h3>
              <p className="text-gray-600">01 23 45 67 89</p>
              <p className="text-sm text-gray-500">Lun-Ven 9h-18h</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">support@printpro.fr</p>
              <p className="text-sm text-gray-500">Réponse sous 2h</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Horaires</h3>
              <p className="text-gray-600">Lun-Ven 9h-18h</p>
              <p className="text-sm text-gray-500">Sam 9h-12h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {selectedTab === 'chat' && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Chat en direct</h2>
              </div>
              <p className="text-gray-600">
                Discutez directement avec notre équipe support. Nous sommes là pour répondre à toutes vos questions.
              </p>
            </div>
            <ChatWindow />
          </div>
        )}

        {selectedTab === 'faq' && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Questions fréquentes</h2>
              <p className="text-gray-600">
                Trouvez rapidement les réponses aux questions les plus courantes.
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold text-blue-600">Q</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'contact' && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Formulaire de contact</h2>
              <p className="text-gray-600">
                Envoyez-nous un message détaillé et nous vous répondrons rapidement.
              </p>
            </div>
            
            <Card>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Sujet"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priorité
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="low">Faible</option>
                      <option value="normal">Normale</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Décrivez votre demande en détail..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" icon={<Mail className="w-4 h-4" />}>
                    Envoyer le message
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    icon={<FileText className="w-4 h-4" />}
                  >
                    Joindre un fichier
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};