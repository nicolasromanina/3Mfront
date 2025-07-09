import { User, Service, Order, ChatMessage, Notification, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'client@example.com',
    name: 'Nicolas',
    role: 'client',
    phone: '06 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin Système',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    email: 'jean.martin@email.com',
    name: 'Jean',
    role: 'client',
    phone: '06 98 76 54 32',
    address: '456 Avenue des Champs, 69001 Lyon',
    createdAt: '2024-02-01T10:00:00Z'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Flyers A5',
    description: 'Impression de flyers au format A5 (148x210mm)',
    category: 'flyers',
    basePrice: 0.15,
    unit: 'unité',
    minQuantity: 50,
    maxQuantity: 10000,
    options: [
      {
        id: 'papier',
        name: 'Type de papier',
        type: 'select',
        options: ['Standard 90g', 'Premium 135g', 'Luxe 250g'],
        priceModifier: 1.0,
        required: true
      },
      {
        id: 'recto-verso',
        name: 'Impression recto-verso',
        type: 'checkbox',
        priceModifier: 1.5,
        required: false
      },
      {
        id: 'pelliculage',
        name: 'Pelliculage',
        type: 'select',
        options: ['Aucun', 'Mat', 'Brillant'],
        priceModifier: 1.2,
        required: false
      }
    ]
  },
  {
    id: '2',
    name: 'Cartes de Visite',
    description: 'Cartes de visite professionnelles (85x54mm)',
    category: 'cartes',
    basePrice: 0.25,
    unit: 'unité',
    minQuantity: 100,
    maxQuantity: 5000,
    options: [
      {
        id: 'papier',
        name: 'Type de papier',
        type: 'select',
        options: ['Standard 300g', 'Premium 350g', 'Luxe 400g'],
        priceModifier: 1.0,
        required: true
      },
      {
        id: 'finition',
        name: 'Finition',
        type: 'select',
        options: ['Aucune', 'Vernis sélectif', 'Dorure à chaud'],
        priceModifier: 1.3,
        required: false
      }
    ]
  },
  {
    id: '3',
    name: 'Affiches A3',
    description: 'Affiches grand format A3 (297x420mm)',
    category: 'affiches',
    basePrice: 2.50,
    unit: 'unité',
    minQuantity: 1,
    maxQuantity: 1000,
    options: [
      {
        id: 'papier',
        name: 'Type de papier',
        type: 'select',
        options: ['Standard 135g', 'Photo 200g', 'Affichage 150g'],
        priceModifier: 1.0,
        required: true
      },
      {
        id: 'plastification',
        name: 'Plastification',
        type: 'checkbox',
        priceModifier: 1.4,
        required: false
      }
    ]
  },
  {
    id: '4',
    name: 'Brochures A4',
    description: 'Brochures multi-pages format A4',
    category: 'brochures',
    basePrice: 1.20,
    unit: 'page',
    minQuantity: 4,
    maxQuantity: 100,
    options: [
      {
        id: 'reliure',
        name: 'Type de reliure',
        type: 'select',
        options: ['Agrafage', 'Spirale', 'Dos carré collé'],
        priceModifier: 1.0,
        required: true
      },
      {
        id: 'papier',
        name: 'Type de papier',
        type: 'select',
        options: ['Standard 90g', 'Premium 135g'],
        priceModifier: 1.0,
        required: true
      }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    clientId: '1',
    client: mockUsers[0],
    items: [
      {
        serviceId: '1',
        service: mockServices[0],
        quantity: 500,
        options: { papier: 'Premium 135g', 'recto-verso': true },
        unitPrice: 0.225,
        totalPrice: 112.50
      }
    ],
    status: 'en_cours',
    totalPrice: 112.50,
    notes: 'Impression urgente pour événement',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-02T14:30:00Z',
    dueDate: '2024-12-05T18:00:00Z'
  },
  {
    id: '2',
    clientId: '3',
    client: mockUsers[2],
    items: [
      {
        serviceId: '2',
        service: mockServices[1],
        quantity: 250,
        options: { papier: 'Premium 350g', finition: 'Vernis sélectif' },
        unitPrice: 0.325,
        totalPrice: 81.25
      }
    ],
    status: 'terminee',
    totalPrice: 81.25,
    createdAt: '2024-11-28T15:20:00Z',
    updatedAt: '2024-12-01T09:15:00Z',
    dueDate: '2024-12-03T12:00:00Z'
  },
  {
    id: '3',
    clientId: '1',
    client: mockUsers[0],
    items: [
      {
        serviceId: '3',
        service: mockServices[2],
        quantity: 10,
        options: { papier: 'Photo 200g', plastification: true },
        unitPrice: 3.50,
        totalPrice: 35.00
      }
    ],
    status: 'devis',
    totalPrice: 35.00,
    notes: 'Devis pour affiches événement',
    createdAt: '2024-12-03T08:45:00Z',
    updatedAt: '2024-12-03T08:45:00Z'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    orderId: '1',
    senderId: '1',
    senderName: 'Marie Dupont',
    senderRole: 'client',
    message: 'Bonjour, pouvez-vous me confirmer les délais pour ma commande de flyers ?',
    timestamp: '2024-12-02T09:30:00Z',
    read: true
  },
  {
    id: '2',
    orderId: '1',
    senderId: '2',
    senderName: 'Admin Système',
    senderRole: 'admin',
    message: 'Bonjour Marie, votre commande sera prête demain en fin d\'après-midi.',
    timestamp: '2024-12-02T10:15:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '3',
    senderName: 'Jean Martin',
    senderRole: 'client',
    message: 'Avez-vous reçu les fichiers pour ma commande de cartes de visite ?',
    timestamp: '2024-12-03T14:20:00Z',
    read: false
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Commande en cours',
    message: 'Votre commande #1 est actuellement en cours d\'impression.',
    type: 'info',
    read: false,
    createdAt: '2024-12-02T14:30:00Z',
    orderId: '1'
  },
  {
    id: '2',
    userId: '1',
    title: 'Nouveau devis disponible',
    message: 'Votre devis #3 est disponible au téléchargement.',
    type: 'success',
    read: true,
    createdAt: '2024-12-03T09:00:00Z',
    orderId: '3'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalOrders: 156,
  pendingOrders: 8,
  completedOrders: 142,
  totalRevenue: 18750,
  monthlyOrders: [
    { month: 'Jan', count: 12, revenue: 1500 },
    { month: 'Fév', count: 18, revenue: 2250 },
    { month: 'Mar', count: 15, revenue: 1875 },
    { month: 'Avr', count: 22, revenue: 2750 },
    { month: 'Mai', count: 19, revenue: 2375 },
    { month: 'Jun', count: 25, revenue: 3125 },
    { month: 'Jul', count: 28, revenue: 3500 },
    { month: 'Aoû', count: 20, revenue: 2500 },
    { month: 'Sep', count: 24, revenue: 3000 },
    { month: 'Oct', count: 30, revenue: 3750 },
    { month: 'Nov', count: 26, revenue: 3250 },
    { month: 'Déc', count: 8, revenue: 1000 }
  ],
  topServices: [
    { service: 'Flyers A5', count: 45 },
    { service: 'Cartes de Visite', count: 32 },
    { service: 'Affiches A3', count: 28 },
    { service: 'Brochures A4', count: 15 }
  ]
};