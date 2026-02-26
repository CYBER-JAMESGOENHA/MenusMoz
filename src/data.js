export const checkIsOpen = (hoursString) => {
  if (!hoursString) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [start, end] = hoursString.split(" - ");

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const startTime = parseTime(start);
  let endTime = parseTime(end);

  if (endTime < startTime) {
    if (currentTime >= startTime || currentTime < endTime) {
      return true;
    }
  } else {
    if (currentTime >= startTime && currentTime < endTime) {
      return true;
    }
  }

  return false;
};

export const RESTAURANTS = [
  {
    id: 1,
    slug: "sabor-do-mar",
    name: "Sabor do Mar",
    cuisine: "Mariscos",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=800&auto=format&fit=crop",
    description: "Referência em frutos do mar frescos com vista para a baía de Maputo.",
    location: "Avenida Marginal, Maputo",
    coords: { lat: -25.9622, lng: 32.6105 },
    whatsapp: "258840000001",
    hours: "11:00 - 23:00",
    rating: 4.8,
    reviewCount: 142,
    offer: "15% OFF em Lagostas (Qua)",
    menuCategories: [
      {
        name: "Entradas",
        items: [
          { name: "Casquinha de Siri", price: "350 MT", desc: "Carne de siri temperada e gratinada com queijo da ilha." },
          { name: "Lulas Salteadas", price: "450 MT", desc: "Lulas frescas com alho, salsa e um toque de piri-piri." },
          { name: "Gambas à Guilho", price: "680 MT", desc: "Gambas descascadas com molho de alho e vinho branco." },
          { name: "Amêijoas à Bulhão Pato", price: "550 MT", desc: "Amêijoas frescas com azeite, alho e coentros." }
        ]
      },
      {
        name: "Pratos Principais",
        items: [
          { name: "Lagosta Grelhada", price: "2.400 MT", desc: "Lagosta inteira com manteiga de limão e batata frita." },
          { name: "Camarão Tigre Grelhado", price: "1.850 MT", desc: "Camarão gigante com molho piri-piri da casa." },
          { name: "Arroz de Marisco Especial", price: "950 MT", desc: "Arroz malandrinho com variados frutos do mar e coentros." },
          { name: "Caril de Camarão", price: "820 MT", desc: "Camarão de Maputo com leite de coco e arroz basmati." },
          { name: "Peixe da Ilha Grelhado", price: "850 MT", desc: "Posta de peixe do dia com molho de manteiga e legumes." },
          { name: "Penne de Frutos do Mar", price: "720 MT", desc: "Massa com camarão, lulas e amêijoas em molho de tomate." }
        ]
      },
      {
        name: "Sobremesas",
        items: [
          { name: "Pudim de Leite de Coco", price: "220 MT", desc: "Receita tradicional com calda de caramelo." },
          { name: "Fruta da Época", price: "150 MT", desc: "Seleção de papaias, manga e ananás fresco." },
          { name: "Mousse de Chocolate", price: "180 MT", desc: "Chocolate belga com flor de sal." }
        ]
      },
      {
        name: "Bebidas",
        items: [
          { name: "Vinho Branco Alentejo", price: "1.200 MT", desc: "Garrafa 750ml — Adega de Portalegre." },
          { name: "Limonada com Hortelã", price: "150 MT", desc: "Feita na hora com limões orgânicos." },
          { name: "Cerveja 2M Imperial", price: "80 MT", desc: "A cerveja preferida de Maputo." },
          { name: "Água Natural 1.5L", price: "60 MT", desc: "Água mineral fresca." }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "cantinho-do-gato",
    name: "O Cantinho do Gato",
    cuisine: "Moçambicana",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    description: "O autêntico sabor da Matapa e do Frango à Zambeziana no coração da cidade.",
    location: "Rua da Argélia, Maputo",
    coords: { lat: -25.9685, lng: 32.5854 },
    whatsapp: "258840000002",
    hours: "10:00 - 22:00",
    rating: 4.6,
    reviewCount: 98,
    offer: "Matapa Grátis na compra de 2 Pratos",
    menuCategories: [
      {
        name: "Tradicionais",
        items: [
          { name: "Matapa com Camarão", price: "650 MT", desc: "Folhas de mandioquinha com leite de coco e amendoim." },
          { name: "Caril de Caranguejo", price: "850 MT", desc: "Caranguejo fresco da nossa costa." },
          { name: "Galinha à Zambeziana", price: "750 MT", desc: "Grelhada com leite de coco e piri-piri." }
        ]
      },
      {
        name: "Acompanhamentos",
        items: [
          { name: "Arroz Branco", price: "100 MT", desc: "Soltinho e fresco." },
          { name: "Xima de Milho", price: "80 MT", desc: "Tradição no prato." }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "patio-luis",
    name: "Pátio do Luís",
    cuisine: "Portuguesa",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    description: "Pratos tradicionais portugueses num ambiente acolhedor e familiar.",
    location: "Matola Rio, Matola",
    coords: { lat: -25.9614, lng: 32.4822 },
    whatsapp: "258840000003",
    hours: "12:00 - 00:00",
    rating: 4.5,
    reviewCount: 76,
    offer: "Happy Hour: Cerveja 2x1 (17h-19h)",
    menuCategories: [
      {
        name: "Entradas",
        items: [
          { name: "Chouriço Assado", price: "380 MT", desc: "Chouriço tradicional português no fogo." },
          { name: "Bolinhos de Bacalhau", price: "300 MT", desc: "6 unidades crocantes." }
        ]
      },
      {
        name: "Pratos Principais",
        items: [
          { name: "Polvo à Lagareiro", price: "1.450 MT", desc: "Polvo assado com batatas a murro e azeite virgem." },
          { name: "Francesinha Especial", price: "850 MT", desc: "O clássico do Porto com molho secreto." }
        ]
      }
    ]
  },
  {
    id: 4,
    slug: "mercado-28",
    name: "Mercado 28",
    cuisine: "Street Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    description: "Explosão de sabores urbanos. A melhor comida de rua reinventada com estilo.",
    location: "Avenida Eduardo Mondlane, Maputo",
    coords: { lat: -25.9640, lng: 32.5870 },
    whatsapp: "258840000004",
    hours: "17:00 - 02:00",
    rating: 4.7,
    reviewCount: 211,
    offer: "Burger + Batata + Refri: 650 MT",
    menuCategories: [
      {
        name: "Burgers",
        items: [
          { name: "Burger de Picanha", price: "550 MT", desc: "180g de blend de picanha e cheddar." },
          { name: "Chicken Crispy", price: "450 MT", desc: "Frango frito crocante e maionese de limão." }
        ]
      },
      {
        name: "Bebidas",
        items: [
          { name: "Cocktail MenusMOZ", price: "350 MT", desc: "Gin, maracujá e manjericão." }
        ]
      }
    ]
  },
  {
    id: 5,
    slug: "doces-momentos",
    name: "Doces Momentos",
    cuisine: "Pastelaria",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop",
    description: "As melhores sobremesas e cafés gourmet para os seus momentos especiais.",
    location: "Avenida 24 de Julho, Maputo",
    coords: { lat: -25.9655, lng: 32.5898 },
    whatsapp: "258840000005",
    hours: "07:30 - 20:00",
    rating: 4.9,
    reviewCount: 63,
    offer: "Café + Pastel de Nata: 150 MT",
    menuCategories: [
      {
        name: "Pastelaria",
        items: [
          { name: "Pastel de Nata", price: "85 MT", desc: "O autêntico e crocante." },
          { name: "Croissant com Amêndoas", price: "150 MT", desc: "Massa folhada com recheio cremoso." }
        ]
      },
      {
        name: "Cafés",
        items: [
          { name: "Expresso", price: "70 MT", desc: "Lote selecionado." },
          { name: "Cappuccino", price: "140 MT", desc: "Com canela e chocolate." }
        ]
      }
    ]
  },
  {
    id: 6,
    slug: "brasa-viva",
    name: "Brasa Viva",
    cuisine: "Grelhados",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    description: "O melhor churrasco ao carvão de Maputo, com carnes selecionadas e espetadas tradicionais.",
    location: "Avenida Julius Nyerere, Maputo",
    coords: { lat: -25.9700, lng: 32.5930 },
    whatsapp: "258840000006",
    hours: "12:00 - 23:00",
    rating: 4.7,
    reviewCount: 134,
    offer: "Espetada Mista para 2: 1.200 MT",
    menuCategories: [
      {
        name: "Espetadas",
        items: [
          { name: "Espetada de Frango", price: "450 MT", desc: "Frango marinado em piri-piri e grelhado no carvão." },
          { name: "Espetada Mista", price: "750 MT", desc: "Combinação de frango, carne e linguiça no carvão." },
          { name: "Espetada de Camarão", price: "850 MT", desc: "Camarão tigre com manteiga de alho e ervas." }
        ]
      },
      {
        name: "Carnes",
        items: [
          { name: "Picanha na Brasa", price: "1.200 MT", desc: "Peça inteira de picanha com sal grosso." },
          { name: "Costelas de Vaca", price: "950 MT", desc: "Costelas grelhadas com molho barbecue da casa." },
          { name: "Frango Inteiro Grelhado", price: "880 MT", desc: "Frango marinado, grelhado lentamente no carvão." }
        ]
      },
      {
        name: "Acompanhamentos",
        items: [
          { name: "Funge de Mandioca", price: "80 MT", desc: "Acompanhamento tradicional moçambicano." },
          { name: "Batata Frita", price: "120 MT", desc: "Crocante e temperada com alho e salsa." },
          { name: "Salada Mista", price: "100 MT", desc: "Alface, tomate, pepino e cebola." }
        ]
      },
      {
        name: "Bebidas",
        items: [
          { name: "Cerveja 2M", price: "80 MT", desc: "A cerveja nacional de Moçambique." },
          { name: "Sumo de Maracujá", price: "100 MT", desc: "Natural, feito na hora." }
        ]
      }
    ]
  }
];

export const CATEGORIES = [
  "Tudo", "Mariscos", "Portuguesa", "Pastelaria", "Street Food", "Moçambicana", "Grelhados"
];

export const FEATURED_DISHES = [
  {
    id: 1,
    name: "Matapa Zambeziana",
    tagline: "Destaque do Dia",
    desc: "Folhas de mandioquinha processadas com leite de coco e amendoim, acompanhadas por camarão tigre da nossa costa.",
    price: "850 MT",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/cantinho-do-gato"
  },
  {
    id: 2,
    name: "Bacalhau à Lagareiro",
    tagline: "Especial Português",
    desc: "Posta de bacalhau premium assada com azeite virgem, batatas a murro e grelos salteados.",
    price: "1.450 MT",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/patio-luis"
  },
  {
    id: 3,
    name: "Grelhada Mista do Mar",
    tagline: "Frescura Suprema",
    desc: "Uma seleção dos melhores mariscos do dia: lagosta, camarão tigre e lulas, grelhados no carvão.",
    price: "2.800 MT",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/sabor-do-mar"
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Onde encontrar a melhor Matapa em Maputo?",
    excerpt: "Descubra os segredos deste prato icónico moçambicano e os lugares onde a tradição é sagrada.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    date: "24 Fev, 2026",
    author: "Equipa MenusMOZ"
  },
  {
    id: 2,
    title: "Marisco Fresco: Do mar para o prato na Avenida Marginal",
    excerpt: "Uma volta pelos restaurantes que servem o camarão e a lagosta mais frescos da capital.",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=800&auto=format&fit=crop",
    date: "20 Fev, 2026",
    author: "Sofia Mucavele"
  },
  {
    id: 3,
    title: "Review: Mercado 28 e a revolução da Street Food",
    excerpt: "Fomos provar os burgers de picanha e os cocktails que estão a dar que falar em Maputo.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    date: "15 Fev, 2026",
    author: "Carlos Langa"
  }
];
