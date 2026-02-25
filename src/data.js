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
    offer: "15% OFF em Lagostas (Qua)",
    menuCategories: [
      {
        name: "Entradas",
        items: [
          { name: "Casquinha de Siri", price: "350 MT", desc: "Carne de siri temperada e gratinada." },
          { name: "Lulas Salteadas", price: "450 MT", desc: "Lulas frescas com alho e salsa." }
        ]
      },
      {
        name: "Pratos Principais",
        items: [
          { name: "Lagosta Grelhada", price: "2.400 MT", desc: "Lagosta inteira com manteiga de limão." },
          { name: "Camarão Tigre", price: "1.850 MT", desc: "Camarão grelhado com molho piri-piri." },
          { name: "Arroz de Marisco", price: "950 MT", desc: "Arroz malandrinho com variados frutos do mar." }
        ]
      },
      {
        name: "Bebidas",
        items: [
          { name: "Vinho Branco Alentejo", price: "1.200 MT", desc: "Garrafa 750ml." },
          { name: "Limonada Natural", price: "150 MT", desc: "Feita na hora com hortelã." }
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
    offer: "Matapa Grátis na compra de 2 Pratos",
    menuCategories: [
      {
        name: "Tradicionais",
        items: [
          { name: "Matapa with Camarão", price: "650 MT", desc: "with leite de coco e amendoim." },
          { name: "Caril de Caranguejo", price: "850 MT", desc: "Caranguejo fresco da nossa costa." },
          { name: "Galinha à Zambeziana", price: "750 MT", desc: "Grelhada with leite de coco e piri-piri." }
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
          { name: "Polvo à Lagareiro", price: "1.450 MT", desc: "Polvo assado with batatas a murro." },
          { name: "Francesinha Especial", price: "850 MT", desc: "O clássico do Porto with molho secreto." }
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
    description: "Explosão de sabores urbanos. A melhor comida de rua reinventada with estilo.",
    location: "Avenida Eduardo Mondlane, Maputo",
    coords: { lat: -25.9640, lng: 32.5870 },
    whatsapp: "258840000004",
    hours: "17:00 - 02:00",
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
