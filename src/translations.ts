export interface TranslationSchema {
    meta: { title: string; description: string };
    nav: { home: string; sabor: string; about: string; owners: string; login: string };
    nav_mobile: { home: string; favorites: string; search: string; profile: string };
    hero: { badge: string; title_part1: string; title_part2: string; subtitle: string; search_placeholder: string; location_btn: string; location_tooltip: string };
    home: { featured_tag: string; order_now: string; view_restaurant: string; open_now: string; closed: string; view_full_menu: string; how_it_works: string; step1_title: string; step1_desc: string; step2_title: string; step2_desc: string; step3_title: string; step3_desc: string; recommended_title: string; top_picks: string };
    detail: { quick_res: string; res_desc: string; whatsapp_res: string; total_est: string; back: string; share: string; reviews_title: string; write_review: string; review_placeholder: string; review_submit: string; review_login: string; review_thanks: string; review_error: string; scroll_more: string; ligar: string };
    footer: { desc: string; platform: string };
    about: { manifesto: string; title: string; subtitle: string; mission: string; mission_desc: string; future: string; future_desc: string };
    forOwners: { title: string; subtitle: string; form_title: string; name: string; email: string; phone: string; submit: string };
    blog: { tag: string; title: string; subtitle: string; read_more: string; all: string; culture: string; reviews: string; recipes: string; news: string };
    profile: { title: string; favorites: string; reviews: string; settings: string; personal_info: string; security: string; joined: string; logout: string };
}

export const translations: { pt: TranslationSchema; en: TranslationSchema } = {
    pt: {
        meta: {
            title: "Locais de Moz — O Melhor da Gastronomia de Moçambique",
            description: "Descubra os melhores restaurantes de Maputo, Matola e Beira. Navega menus digitais, faz reservas e poupa tempo."
        },
        nav: {
            home: "Início",
            sabor: "O Sabor",
            about: "Sobre Nós",
            owners: "Para Restaurantes",
            login: "Entrar"
        },
        nav_mobile: {
            home: "Início",
            favorites: "Favoritos",
            search: "Pesquisar",
            profile: "Perfil"
        },
        hero: {
            badge: "🇲🇿 Maputo • Matola • Beira",
            title_part1: "O sabor digital de",
            title_part2: "Moçambique",
            subtitle: "Explore os melhores menus, do curry mais picante aos mariscos frescos da nossa costa.",
            search_placeholder: "Pesquisar restaurante ou prato...",
            location_btn: "Usar localização",
            location_tooltip: "Encontrar perto de mim"
        },
        home: {
            featured_tag: "Destaque do Dia",
            order_now: "Encomendar Agora",
            view_restaurant: "Ver Restaurante",
            open_now: "Aberto agora",
            closed: "Fechado",
            view_full_menu: "Ver Menu Completo",
            how_it_works: "Como Funciona o Locais de Moz?",
            step1_title: "Explore",
            step1_desc: "Navegue pelos melhores restaurantes da sua zona.",
            step2_title: "Escolha",
            step2_desc: "Consulte o menu digital completo e atualizado.",
            step3_title: "Visite",
            step3_desc: "Vá até ao local ou encomende o sabor da tradição.",
            recommended_title: "Mais Recomendados",
            top_picks: "Top picks para si"
        },
        detail: {
            quick_res: "Reserva Rápida",
            res_desc: "Garanta o seu lugar ou faça o seu pedido antecipadamente.",
            whatsapp_res: "Reservar via WhatsApp",
            total_est: "Total Estimado",
            back: "Voltar",
            share: "Partilhar",
            reviews_title: "O que dizem os clientes",
            write_review: "Escrever Avaliação",
            review_placeholder: "Partilhe a sua experiência...",
            review_submit: "Publicar Avaliação",
            review_login: "Inicie sessão para avaliar",
            review_thanks: "Obrigado pela sua avaliação!",
            review_error: "Erro ao publicar. Tente novamente.",
            scroll_more: "Deslize para mais",
            ligar: "Ligar Direto"
        },
        footer: {
            desc: "A maior rede de menus digitais de Moçambique. O sabor da nossa terra na palma da sua mão.",
            platform: "Plataforma"
        },
        about: {
            manifesto: "O Nosso Manifesto",
            title: "Digitalizando o sabor de",
            subtitle: "Locais de Moz nasceu da paixão pela gastronomia e da vontade de colocar a alma culinária do país na palma da mão de todos.",
            mission: "A Nossa Missão",
            mission_desc: "Democratizamos o acesso à informação gastronómica de qualidade em Moçambique, capacitando restauradores locais com ferramentas digitais de elite e guiando clientes a descobertas autênticas.",
            future: "O Futuro",
            future_desc: "Queremos ser a maior rede de curadoria gastronómica de África Austral, celebrando a diversidade da nossa Pérola do Índico."
        },
        forOwners: {
            title: "Traga o seu restaurante para a era digital",
            subtitle: "Junte-se a centenas de proprietários que estão a transformar o seu negócio com menus digitais premium.",
            form_title: "Candidatura",
            name: "Nome do Estabelecimento",
            email: "Email de Contacto",
            phone: "Telemóvel",
            submit: "Enviar Candidatura"
        },
        blog: {
            tag: "Diário Gastronómico",
            title: "O Sabor de",
            subtitle: "Curiosidades, receitas ancestrais e histórias por trás dos pratos que definem a nossa identidade.",
            read_more: "Ler Detalhes",
            all: "Tudo",
            culture: "Cultura",
            reviews: "Reviews",
            recipes: "Receitas",
            news: "Notícias"
        },
        profile: {
            title: "Meu Perfil",
            favorites: "Favoritos",
            reviews: "Avaliações",
            settings: "Definições",
            personal_info: "Info Pessoal",
            security: "Segurança",
            joined: "Membro desde",
            logout: "Sair"
        }
    },
    en: {
        meta: {
            title: "Locais de Moz — The Best of Mozambican Gastronomy",
            description: "Discover the best restaurants in Maputo, Matola and Beira. Browse digital menus, make reservations and save time."
        },
        nav: {
            home: "Home",
            sabor: "The Flavor",
            about: "About Us",
            owners: "For Owners",
            login: "Login"
        },
        nav_mobile: {
            home: "Home",
            favorites: "Favorites",
            search: "Search",
            profile: "Profile"
        },
        hero: {
            badge: "🇲🇿 Maputo • Matola • Beira",
            title_part1: "The digital flavor of",
            title_part2: "Mozambique",
            subtitle: "Explore the best menus, from the spiciest curry to fresh seafood from our coast.",
            search_placeholder: "Search for restaurant or dish...",
            location_btn: "Use location",
            location_tooltip: "Find near me"
        },
        home: {
            featured_tag: "Dish of the Day",
            order_now: "Order Now",
            view_restaurant: "View Restaurant",
            open_now: "Open now",
            closed: "Closed",
            view_full_menu: "View Full Menu",
            how_it_works: "How Locais de Moz Works?",
            step1_title: "Explore",
            step1_desc: "Browse through the best restaurants in your area.",
            step2_title: "Choose",
            step2_desc: "Check the full and updated digital menu.",
            step3_title: "Visit",
            step3_desc: "Go to the location or order the flavor of tradition.",
            recommended_title: "Most Recommended",
            top_picks: "Top picks for you"
        },
        detail: {
            quick_res: "Quick Booking",
            res_desc: "Secure your spot or pre-order your meal.",
            whatsapp_res: "Book via WhatsApp",
            total_est: "Estimated Total",
            back: "Back",
            share: "Share",
            reviews_title: "What customers say",
            write_review: "Write a Review",
            review_placeholder: "Share your experience...",
            review_submit: "Post Review",
            review_login: "Log in to leave a review",
            review_thanks: "Thank you for your review!",
            review_error: "Error posting. Please try again.",
            scroll_more: "Swipe for more",
            ligar: "Call Directly"
        },
        footer: {
            desc: "Mozambique's largest digital menu network. The flavor of our land in the palm of your hand.",
            platform: "Platform"
        },
        about: {
            manifesto: "Our Manifesto",
            title: "Digitalizing the flavor of",
            subtitle: "Locais de Moz was born from a passion for gastronomy and the desire to put the country's culinary soul in everyone's palm.",
            mission: "Our Mission",
            mission_desc: "We democratize access to quality gastronomic information in Mozambique, empowering local restaurateurs with elite digital tools and guiding customers to authentic discoveries.",
            future: "The Future",
            future_desc: "We want to be the largest gastronomic curation network in Southern Africa, celebrating the diversity of our Pearl of the Indian Ocean."
        },
        forOwners: {
            title: "Bring your restaurant to the digital era",
            subtitle: "Join hundreds of owners who are transforming their business with premium digital menus.",
            form_title: "Application",
            name: "Establishment Name",
            email: "Contact Email",
            phone: "Mobile",
            submit: "Send Application"
        },
        blog: {
            tag: "Foodie Blog",
            title: "The Flavor of",
            subtitle: "Curiosity, ancestral recipes, and stories behind the dishes that define our identity.",
            read_more: "Read Details",
            all: "All",
            culture: "Culture",
            reviews: "Reviews",
            recipes: "Recipes",
            news: "News"
        },
        profile: {
            title: "My Profile",
            favorites: "Favorites",
            reviews: "Reviews",
            settings: "Settings",
            personal_info: "Personal Info",
            security: "Security",
            joined: "Member since",
            logout: "Logout"
        }
    }
};
