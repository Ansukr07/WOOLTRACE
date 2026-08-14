export const CATEGORIES = [
  'ALL',
  'WOOL & YARN',
  'TEXTILES',
  'FARM EQUIPMENT',
  'SHEARING',
  'WOOL PROCESSING',
  'SHEEP CARE',
  'FODDER & NUTRITION',
  'FARM SUPPLIES',
  'HANDCRAFTS'
];

export const MOCK_PRODUCTS = [
  {
    id: 'WK-001',
    name: 'Premium Merino Wool Yarn',
    description: 'Exceptionally soft and fine Merino wool yarn, perfectly spun for high-quality knitting and weaving. Naturally sourced and processed without harsh chemicals.',
    images: [
      '/images/wool_yarn.jpg'
    ],
    category: 'WOOL & YARN',
    price: 1250,
    unit: 'kg',
    availableQuantity: 500,
    minimumOrderQuantity: 5,
    sellerId: 'S-001',
    sellerName: 'Himalayan Wool Works',
    sellerLocation: 'Mysuru, Karnataka',
    sellerVerified: true,
    sellerRating: 4.8,
    productRating: 4.9,
    reviews: [
      { id: 1, name: 'Anil Kumar', rating: 5, date: '12 Aug 2026', review: 'Excellent quality yarn, very soft and strong.' }
    ],
    specifications: {
      'Fiber': 'Merino Wool',
      'Origin': 'Karnataka, India',
      'Color': 'Natural Cream',
      'Grade': 'Superfine',
      'Weight': '1 KG Cone'
    },
    deliveryEstimate: '3-5 days',
    stockStatus: 'In Stock'
  },
  {
    id: 'WK-002',
    name: 'Pro-Shear Sheep Clippers',
    description: 'Professional grade electric sheep shearing clippers. High-speed motor with advanced cooling system to prevent overheating during continuous use.',
    images: [
      '/images/sheep_clippers.jpg'
    ],
    category: 'SHEARING',
    price: 8500,
    unit: 'unit',
    availableQuantity: 45,
    minimumOrderQuantity: 1,
    sellerId: 'S-002',
    sellerName: 'AgriTech Tools India',
    sellerLocation: 'Pune, Maharashtra',
    sellerVerified: true,
    sellerRating: 4.6,
    productRating: 4.7,
    reviews: [],
    specifications: {
      'Power': '350W',
      'Speed': '2400 RPM',
      'Weight': '1.5 KG',
      'Warranty': '1 Year'
    },
    deliveryEstimate: '4-7 days',
    stockStatus: 'In Stock'
  },
  {
    id: 'WK-003',
    name: 'Raw Chokla Wool',
    description: 'High-quality raw Chokla wool, known for its superior carpet-grade quality. Unwashed and direct from the farm.',
    images: [
      '/images/raw_wool.jpg'
    ],
    category: 'WOOL & YARN',
    price: 350,
    unit: 'kg',
    availableQuantity: 2000,
    minimumOrderQuantity: 50,
    sellerId: 'S-003',
    sellerName: 'Rajasthan Wool Cooperative',
    sellerLocation: 'Bikaner, Rajasthan',
    sellerVerified: true,
    sellerRating: 4.5,
    productRating: 4.4,
    reviews: [],
    specifications: {
      'Fiber Type': 'Chokla',
      'Origin': 'Rajasthan, India',
      'Processing': 'Raw / Unwashed',
      'Micron': '28-32 µm'
    },
    deliveryEstimate: '5-8 days',
    stockStatus: 'In Stock'
  },
  {
    id: 'WK-004',
    name: 'Nutri-Sheep Mineral Block',
    description: 'Essential mineral and vitamin supplement blocks for optimal sheep health, fleece growth, and overall immunity.',
    images: [
      '/images/mineral_block.jpg'
    ],
    category: 'FODDER & NUTRITION',
    price: 450,
    unit: 'block (5kg)',
    availableQuantity: 300,
    minimumOrderQuantity: 2,
    sellerId: 'S-004',
    sellerName: 'Kisan Feed Supplements',
    sellerLocation: 'Ludhiana, Punjab',
    sellerVerified: false,
    sellerRating: 4.2,
    productRating: 4.5,
    reviews: [],
    specifications: {
      'Weight': '5 KG',
      'Type': 'Mineral Supplement',
      'Suitable For': 'All breeds of sheep'
    },
    deliveryEstimate: '2-4 days',
    stockStatus: 'In Stock'
  },
  {
    id: 'WK-005',
    name: 'Handwoven Woolen Blanket',
    description: 'Traditional Kullu handwoven wool blanket. Exceptional warmth and beautiful indigenous patterns.',
    images: [
      '/images/wool_blanket.jpg'
    ],
    category: 'HANDCRAFTS',
    price: 3200,
    unit: 'piece',
    availableQuantity: 15,
    minimumOrderQuantity: 1,
    sellerId: 'S-005',
    sellerName: 'Himalayan Artisans',
    sellerLocation: 'Kullu, Himachal Pradesh',
    sellerVerified: true,
    sellerRating: 4.9,
    productRating: 5.0,
    reviews: [],
    specifications: {
      'Material': '100% Pure Wool',
      'Craft': 'Handwoven',
      'Size': '90 x 108 inches',
      'Origin': 'Himachal Pradesh'
    },
    deliveryEstimate: '5-10 days',
    stockStatus: 'Low Stock'
  },
  {
    id: 'WK-006',
    name: 'Wool Carding Machine (Manual)',
    description: 'Durable manual wool carding machine for small-scale fiber processing. Essential for preparing raw wool for spinning.',
    images: [
      '/images/carding_machine.jpg'
    ],
    category: 'WOOL PROCESSING',
    price: 12500,
    unit: 'unit',
    availableQuantity: 8,
    minimumOrderQuantity: 1,
    sellerId: 'S-002',
    sellerName: 'AgriTech Tools India',
    sellerLocation: 'Pune, Maharashtra',
    sellerVerified: true,
    sellerRating: 4.6,
    productRating: 4.8,
    reviews: [],
    specifications: {
      'Type': 'Manual Drum Carder',
      'Material': 'Teak Wood & Stainless Steel',
      'Capacity': '500g per pass'
    },
    deliveryEstimate: '7-10 days',
    stockStatus: 'In Stock'
  }
];
