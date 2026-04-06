export const RESTAURANTS = [
  {
    id: 1,
    slug: "sabor-do-mar",
    name: "Sabor do Mar",
    cuisine: "Internacional",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=800&auto=format&fit=crop",
    description: "Restaurante com ambiente acolhedor, cardápio diversificado e os melhores mariscos, carnes e cocktails de Maputo.",
    location: "Avenida Marginal, Maputo",
    coords: { lat: -25.9622, lng: 32.6105 },
    whatsapp: "258840000001",
    hours: "11:00 - 23:00",
    rating: 4.8,
    reviewCount: 142,
    offer: "Tabua de Carnes 2P: 1.100 MT",
    menuCategories: [
      {
        name: "Pequeno Almoço & Tostas",
        items: [
          { name: "Pequeno Almoço (Meio Frango)", price: "350 MT", desc: "Alho, mostarda, vinho branco, pimenta preta, cebola, tomate maduro e polpa de tomate." },
          { name: "Asinhas Panadas (6)", price: "520 MT", desc: "Asinhas panadas crocantes." },
          { name: "Pequeno Almoço Inglês", price: "550 MT", desc: "Meio frango trinchado frito." },
          { name: "Pequeno Almoço à Iypson (Alcatra)", price: "520 MT", desc: "Carne alcatra frita, trinchada, pickles, mostarda, alho, vinho branco." },
          { name: "Pequeno Almoço à Iypson (Ovos)", price: "420 MT", desc: "2 ovos estrelados/mexidos, fiambre, queijo, cebola caramelizada e torradas." },
          { name: "Pica Pau", price: "520 MT", desc: "Carne alcatra frita, trinchada, pickles, mostarda, alho, vinho branco." },
          { name: "Omelete com Tomate e Cebola", price: "250 MT", desc: "3 ovos, tomate e cebola." },
          { name: "Babalaza Trinchada", price: "450 MT", desc: "Babalaza trinchada, servida quente." },
          { name: "Omelete Mista", price: "350 MT", desc: "3 ovos, fiambre e queijo." },
          { name: "Chouriço de Vaca", price: "720 MT", desc: "Chouriço de vaca grelhado." },
          { name: "Tábua de Carnes (2P)", price: "1.100 MT", desc: "Prego, babalaza, cabeça de lulas panadas, asinhas, pão de alho com queijo." },
          { name: "Tábua de Carnes (4P)", price: "2.200 MT", desc: "Prego, babalaza, cabeça de lulas panadas, asinhas, pão de alho com queijo — para 4 pessoas." },
          { name: "Omelete de Camarão", price: "450 MT", desc: "3 ovos e miolo de camarão." },
          { name: "Tacos de Frango (2)", price: "550 MT", desc: "Peito de frango, pimentos variados, feijão verde, cenoura, repolho roxo." },
          { name: "Tacos de Carne (2)", price: "550 MT", desc: "Bife de vaca alcatra, pimentos variados, feijão verde, cenoura, repolho roxo." },
          { name: "Tosta de Queijo", price: "190 MT", desc: "Tosta simples com queijo." },
          { name: "Tosta Mista", price: "250 MT", desc: "Tosta com fiambre e queijo." },
          { name: "Tosta de Atum", price: "290 MT", desc: "Tosta com atum." },
          { name: "Tosta de Frango", price: "290 MT", desc: "Tosta com frango." },
          { name: "Tosta à Iypson", price: "350 MT", desc: "Peito de frango/atum, ovo cozido, maionese, cebola, pimentos, rodelas de tomate e queijo." },
          { name: "Adicionar Queijo Extra à Tosta", price: "50 MT", desc: "Extra queijo na tosta à escolha." },
        ]
      },
      {
        name: "Entradas",
        items: [
          { name: "Chamuças (6)", price: "490 MT", desc: "Consulte o servente sobre os sabores disponíveis." },
          { name: "Croquetes (6)", price: "490 MT", desc: "Croquetes da casa, crocantes." },
          { name: "Casquinhas (3)", price: "450 MT", desc: "Casquinhas recheadas e gratinadas." },
          { name: "Pastéis de Bacalhau (6)", price: "620 MT", desc: "Pastéis de bacalhau tradicionais." },
          { name: "Bruschetta Tradicional", price: "500 MT", desc: "Bruschetta base com tomate fresco e ervas." },
          { name: "Carpaccio de Peixe/Carne", price: "650 MT", desc: "Chouriço, carne ou camarão em carpaccio." },
          { name: "Bruschettas Variadas", price: "650 MT", desc: "Selecção de bruschettas variadas." },
          { name: "Pão de Alho", price: "450 MT", desc: "Baguete com alho, orégano, salsa e manteiga." },
          { name: "Pão de Alho com Queijo e Babalaza", price: "370 MT", desc: "Baguete com alho, queijo derretido e babalaza." },
          { name: "Camarãozinho Panado", price: "620 MT", desc: "Camarão panado crocante." },
          { name: "Camarão Alhinho", price: "420 MT", desc: "Camarões com alho, manteiga, vinho branco, brandy e sumo de limão." },
          { name: "Ameijoas à Iypson", price: "420 MT", desc: "Ameijoas, alho, cerveja, limão, cebola, pimentos variados, coentro e salsa." },
          { name: "Cabeça de Lulas Panadas com Molho Tártaro", price: "550 MT", desc: "Baguete, alho, orégano, manteiga, queijo muzzarela e babalaza." },
          { name: "Camarões Panados com Molho Tártaro", price: "190 MT", desc: "Camarões panados servidos com molho tártaro." },
        ]
      },
      {
        name: "Mutxutxus (Miudezas)",
        items: [
          { name: "Frango (Mutxutxu)", price: "480 MT", desc: "Tempo de preparo: 20 a 30 min." },
          { name: "Rabada", price: "450 MT", desc: "Carne de rabo de boi." },
          { name: "Dobrada", price: "550 MT", desc: "Dobrada branca com legumes." },
          { name: "Mamusca", price: "420 MT", desc: "Dobrada branca, mão de vaca, babalaza, rabo de boi, alho, pimento verde, cebola, piri-piri, tomate, limão, azeite." },
          { name: "Cabeça de Vaca", price: "420 MT", desc: "Cabeça de vaca temperada." },
          { name: "Cabeça de Peixe", price: "480 MT", desc: "Cabeça de peixe preparada ao estilo da casa." },
        ]
      },
      {
        name: "Carnes",
        items: [
          { name: "Costelas de Carneiro Grelhadas", price: "480 MT", desc: "Costelas de carneiro 350g, molho doce, sal." },
          { name: "Combo de Carnes (2P)", price: "850 MT", desc: "Picanha, babalaza, bife, meio frango, costelas de carneiro." },
          { name: "Combo de Carnes (4P)", price: "1.250 MT", desc: "Picanha, babalaza, bife, meio frango, costelas de carneiro — para 4 pessoas." },
          { name: "Espetadas de Picanha", price: "1.950 MT", desc: "300g de picanha em cubos, cebola roxa, cenoura, pimentos variados, tomate e azeite." },
          { name: "T-bone com Molho de Natas", price: "390 MT", desc: "T-bone 300g com molho cremoso de natas." },
          { name: "1 Frango Grelhado", price: "1.200 MT", desc: "Frango inteiro grelhado." },
          { name: "Meio Frango Grelhado", price: "850 MT", desc: "Meio frango grelhado." },
          { name: "Peito de Frango à Milanesa", price: "1.200 MT", desc: "Peito de frango panado, ovo estrelado." },
          { name: "Peito de Frango Recheado", price: "1.300 MT", desc: "Peito de frango, macon, fiambre, cebola, 2 rodelas de tomate, muzzarela, natas. Tempo de preparo: 20 a 30 min." },
          { name: "Filé Mignon com Molho de Vinho Tinto", price: "1.300 MT", desc: "200g de filete de vaca." },
          { name: "Picanha à Iypson", price: "850 MT", desc: "Picanha 300g, banana, ananás, arroz, feijão preto, couve, ovo, macon." },
          { name: "Bife com Natas e Cogumelos", price: "1.250 MT", desc: "Bife alcatra 300g." },
          { name: "Bife Recheado", price: "1.950 MT", desc: "Bife alcatra 300g, cogumelos e pimentos verdes, mostarda, manteiga, cebola. Tempo de preparo: 20 a 30 min." },
          { name: "Tomahawk Grelhado 500g (1P)", price: "2.900 MT", desc: "Carne Tomahawk 500g, ananás, limão, alecrim." },
          { name: "Tomahawk Grelhado 500g (2P)", price: "5.500 MT", desc: "Carne Tomahawk 500g, ananás, limão, alecrim — para 2 pessoas." },
          { name: "Riberye Grelhado à Iypson", price: "1.200 MT", desc: "Riberye 300g, sal, limão, ananás, alecrim." },
        ]
      },
      {
        name: "Mariscos & Peixes",
        items: [
          { name: "Camarão Grelhado (8)", price: "1.300 MT", desc: "8 camarões tamanho Q, manteiga, alho, limão." },
          { name: "Lagosta Grelhada (1/2)", price: "1.800 MT", desc: "Meia lagosta, manteiga, alho, limão." },
          { name: "Peixe do Dia Inteiro Grelhado (1P)", price: "850 MT", desc: "Peixe escalado, manteiga, alho, limão. Tempo de preparo: 20 a 30 min. Consulte o servente para o peixe do dia." },
          { name: "Polvo à Lagareiro", price: "1.490 MT", desc: "250g de polvo, alho, cebola, pimentos, batata murro, azeite, folha de louro." },
          { name: "Filete de Peixe Grelhado", price: "950 MT", desc: "300g de filete de peixe, manteiga, alho, limão." },
          { name: "Posta de Peixe do Dia Grelhada (1/2)", price: "550 MT", desc: "Posta de peixe, manteiga, alho, limão." },
          { name: "Bacalhau com Natas", price: "780 MT", desc: "Bacalhau desfiado 150g, batata, cebola, leite, natas, muzzarella, noz moscada." },
          { name: "Bacalhau à Lagareiro", price: "920 MT", desc: "Bacalhau 250g, alho, cebola, pimentos verdes, batatinha, folha de louro." },
          { name: "Arroz com Mariscos (2P)", price: "1.500 MT", desc: "Arroz, lulas, camarão, posta de peixe, ameijoas." },
          { name: "Combo de Mariscos Grelhados à Iypson (2P)", price: "1.390 MT", desc: "Camarão, posta de peixe, lagosta, caranguejo, ameijoas, lulas." },
          { name: "Combo de Mariscos Grelhados à Iypson (4P)", price: "1.100 MT", desc: "Camarão, posta de peixe, lagosta, caranguejo, ameijoas, lulas — para 4 pessoas." },
          { name: "Combo Camarão e Filete de Peixe", price: "1.350 MT", desc: "4 camarões Q, 150g de filete de peixe, manteiga, alho e limão." },
          { name: "Combo Camarão e Lulas", price: "1.290 MT", desc: "4 camarões Q, 150g de lulas, manteiga, alho e limão." },
          { name: "Combo Lulas e Filete de Peixe", price: "1.290 MT", desc: "150g de lulas, 150g de filete de peixe, manteiga, alho e limão." },
        ]
      },
      {
        name: "Pregos & Hambúrgueres",
        items: [
          { name: "Prego de Picanha", price: "620 MT", desc: "Carne de picanha, sal, pimenta preta, cebola caramelizada. Acompanha batata frita." },
          { name: "Prego à Iypson", price: "520 MT", desc: "Prego especial da casa. Acompanha batata frita." },
          { name: "Prego de Filete de Frango", price: "590 MT", desc: "Prego de filete de frango. Acompanha batata frita." },
          { name: "Hambúrguer à Iypson", price: "590 MT", desc: "Carne moída, cebola, tomate, molho inglês, queijo, molho da casa, ovo estrelado. Acompanha batata frita." },
          { name: "Hambúrguer Italiano", price: "550 MT", desc: "Carne moída, cebola, pimenta alho, queijo, cebolinha, queijo muzzarela, pesto, agrião. Acompanha batata frita." },
          { name: "Hambúrguer de Frango", price: "550 MT", desc: "Peito de frango panado. Acompanha batata frita." },
        ]
      },
      {
        name: "Pratos Vegetarianos",
        items: [
          { name: "Springroll de Vegetal (6)", price: "450 MT", desc: "Feijão verde, repolho, cenoura, couve, aprás." },
          { name: "Lasanha de Vegetais", price: "790 MT", desc: "Leite, nata, manteiga, noz moscada, repolho, couve, cenoura, ervilha, milho, queijo muzzarela, azeite." },
          { name: "Massa Chinesa de Vegetais", price: "590 MT", desc: "Feijão verde, cenoura, milho, molho inglês, cebola, repolho." },
          { name: "Risotto de Vegetais", price: "990 MT", desc: "Vinho branco, cebola, cenoura, brócolis, couve-flor, cogumelos, azeite, leite de coco, queijo parmesão." },
          { name: "Espetada de Vegetais", price: "550 MT", desc: "Cogumelos, tomate, cenoura, cebola, pimentos verdes, repolho." },
        ]
      },
      {
        name: "Saladas",
        items: [
          { name: "Salada de Picanha", price: "750 MT", desc: "Picanha 150g, rúcula, cebola roxa, rabanete, tomate cherry, cenoura, brócolis, couve-flor." },
          { name: "Salada de Atum", price: "650 MT", desc: "Atum 150g, grão de bico, ovo, batata, azeitonas pretas, alface, tomate, cebola." },
          { name: "Salada de Frutos do Mar", price: "850 MT", desc: "Camarão 50g, cabeça de lulas 50g, ameijoas 50g, tomate, alface, cebola, frutos secos." },
          { name: "Salada à Iypson", price: "750 MT", desc: "Picanha 75g, camarão 75g, tomate cherry, rúcula, cebola roxa, rabanete, massa chinesa." },
          { name: "Salada de Peito de Frango", price: "650 MT", desc: "Ananás, peito de frango, uvas secas, maionese, orégano, ovo." },
          { name: "Salada de Salmão", price: "990 MT", desc: "Salmão, brócolis, couve-flor, cenoura, ervilha, azeite, tomate cherry, milho." },
          { name: "Salada Grega", price: "520 MT", desc: "Alface, tomate, queijo feta, orégano, pepino, cebola, azeitonas pretas." },
        ]
      },
      {
        name: "Pastas",
        items: [
          { name: "Carbonara", price: "650 MT", desc: "Macon, massa fettuccine, natas e gema de ovo, parmesão." },
          { name: "Penne de Mariscos", price: "750 MT", desc: "Molho de tomate, camarão e lulas, queijo parmesão." },
          { name: "Bolonhesa", price: "690 MT", desc: "Esparguete, carne moída, queijo parmesão." },
          { name: "Pasta à Iypson", price: "750 MT", desc: "Fettuccine, macon, fiambre, molho manjericão, parmesão." },
          { name: "Pasta Alfredo", price: "650 MT", desc: "Fettuccine, picanha, molho de tomate, cogumelos, parmesão." },
          { name: "Pasta de Picanha", price: "950 MT", desc: "Penne, peito de frango às tiras, molho de natas e cogumelos, parmesão." },
          { name: "Lasanha de Frango", price: "850 MT", desc: "Peito de frango, leite, natas, manteiga, noz moscada, muzzarela." },
          { name: "Lasanha de Carne", price: "890 MT", desc: "Carne moída, leite, natas, manteiga, noz moscada, muzzarela." },
          { name: "Parmesão Extra na Pasta", price: "100 MT", desc: "Adicione parmesão extra à sua pasta." },
        ]
      },
      {
        name: "Pizzas",
        items: [
          { name: "Pizza Margarita", price: "590 MT", desc: "Molho de tomate, muzzarela fresca." },
          { name: "Pizza Mexicana", price: "790 MT", desc: "Ingredientes ao estilo mexicano." },
          { name: "Pizza de Frango", price: "790 MT", desc: "Frango e outros ingredientes selecionados." },
          { name: "Pizza de Mariscos", price: "750 MT", desc: "Frutos do mar variados." },
          { name: "Pizza Vegetariana", price: "750 MT", desc: "Legumes frescos e queijo." },
          { name: "Pizza de Babalaza", price: "790 MT", desc: "Com babalaza e molho especial." },
          { name: "Pizza de Atum", price: "790 MT", desc: "Atum fresco e ingredientes selecionados." },
          { name: "Pizza de Picanha", price: "950 MT", desc: "Picanha e molho especial da casa." },
          { name: "Pizza à Iypson", price: "890 MT", desc: "A pizza especial da Iypson." },
          { name: "Queijo Muzzarela Extra (50g)", price: "200 MT", desc: "Adicione muzzarela extra à sua pizza." },
        ]
      },
      {
        name: "Menu Infantil",
        items: [
          { name: "Mini Hambúrguer", price: "320 MT", desc: "Mini hambúrguer com batata frita." },
          { name: "Mini Pizza (Margarita/Frango/Atum)", price: "390 MT", desc: "Mini pizza à escolha: margarita, frango ou atum." },
          { name: "Panadinhos de Frango", price: "420 MT", desc: "Panadinhos de frango com batata frita." },
          { name: "Bolonhesa com Esparguete", price: "450 MT", desc: "Bolonhesa com esparguete (sem batata frita)." },
          { name: "Panadinhos de Peixe", price: "490 MT", desc: "Panadinhos de peixe com batata frita." },
        ]
      },
      {
        name: "Extras & Acompanhamentos",
        items: [
          { name: "Batata Frita", price: "180 MT", desc: "Batata frita crocante." },
          { name: "Purê de Batata Rena/Doce/Abóbora", price: "220 MT", desc: "Purê à escolha." },
          { name: "Arroz de Vegetais", price: "150 MT", desc: "Arroz, ervilhas, cenoura, repolho, couve, azeite, cebola." },
          { name: "Arroz Branco", price: "120 MT", desc: "Arroz branco simples." },
          { name: "Legumes Salteados", price: "250 MT", desc: "Brócolis, couve-flor, cenoura, abóbora, curgete." },
          { name: "Feijão Preto", price: "80 MT", desc: "Feijão preto, cebola, azeite, tomate maduro, pimentos verdes, macon." },
          { name: "Queijo", price: "80 MT", desc: "Fatia de queijo." },
          { name: "Ovo", price: "120 MT", desc: "Ovo estrelado ou cozido." },
          { name: "Fiambre", price: "120 MT", desc: "Fatia de fiambre." },
          { name: "Queijo Muzzarela", price: "120 MT", desc: "Queijo muzzarela extra." },
        ]
      },
      {
        name: "Sobremesas",
        items: [
          { name: "Mousse do Dia", price: "320 MT", desc: "Mousse do dia, consulte o servente." },
          { name: "Pudim de Coco", price: "320 MT", desc: "Pudim caseiro de coco." },
          { name: "Tarte do Dia", price: "350 MT", desc: "Tarte do dia, consulte o servente." },
          { name: "Gelado do Dia", price: "250 MT", desc: "Gelado do dia, consulte o servente." },
          { name: "Petit Gâteau", price: "420 MT", desc: "Bolinho de chocolate quente com gelado." },
          { name: "Bolo Aniversário", price: "350 MT", desc: "Fatia de bolo de aniversário." },
        ]
      },
      {
        name: "Bebidas Quentes",
        items: [
          { name: "Descafeinado", price: "120 MT", desc: "Café descafeinado." },
          { name: "Café Expresso", price: "80 MT", desc: "Expresso curto." },
          { name: "Café Longo", price: "150 MT", desc: "Café longo." },
          { name: "Chá Simples", price: "120 MT", desc: "Chá simples." },
          { name: "Chá de Camomila", price: "120 MT", desc: "Chá de camomila." },
          { name: "Chá Verde", price: "120 MT", desc: "Chá verde." },
          { name: "Chá de Frutos Vermelhos", price: "120 MT", desc: "Chá de frutos vermelhos." },
          { name: "Cappuccino", price: "150 MT", desc: "Cappuccino cremoso." },
          { name: "Galão", price: "170 MT", desc: "Galão tradicional." },
          { name: "Chocolate Quente", price: "90 MT", desc: "Chocolate quente cremoso." },
          { name: "Copo de Leite", price: "90 MT", desc: "Copo de leite quente ou frio." },
          { name: "Irish Coffee Simples", price: "450 MT", desc: "Café, açúcar, whiskey irlandês." },
          { name: "Irish Coffee com Natas", price: "450 MT", desc: "Café, açúcar, whiskey irlandês, camada de natas." },
        ]
      },
      {
        name: "Cervejas",
        subcategories: [
          {
            name: "À Garrafa / Lata",
            items: [
              { name: "Corona", price: "180 MT", desc: "Cerveja mexicana." },
              { name: "2M Lata", price: "130 MT", desc: "Cerveja 2M em lata." },
              { name: "2M Xtti", price: "120 MT", desc: "Cerveja 2M garrafa pequena." },
              { name: "Preta Curta", price: "120 MT", desc: "Cerveja preta." },
              { name: "Manica", price: "150 MT", desc: "Cerveja Manica." },
              { name: "Castle Lite", price: "120 MT", desc: "Castle Lite." },
              { name: "Lite Mini", price: "200 MT", desc: "Lite mini." },
              { name: "Stella Artois", price: "200 MT", desc: "Stella Artois." },
              { name: "Heineken Mini (210ml)", price: "180 MT", desc: "Heineken mini." },
              { name: "Heineken Zero", price: "200 MT", desc: "Heineken sem álcool." },
              { name: "Heineken Silver", price: "120 MT", desc: "Heineken Silver." },
              { name: "Txillar Garrafa", price: "180 MT", desc: "Txillar em garrafa." },
              { name: "Txillar Lata", price: "180 MT", desc: "Txillar em lata." },
              { name: "Super Bock", price: "180 MT", desc: "Super Bock." },
              { name: "Double Malt", price: "180 MT", desc: "Double Malt." },
            ]
          },
          {
            name: "À Pressão",
            items: [
              { name: "2M / Preta / Lite — Lambreta (250ml)", price: "100 MT", desc: "Copo lambreta." },
              { name: "2M / Preta / Lite — Copo (300ml)", price: "130 MT", desc: "Copo 300ml." },
              { name: "2M / Preta / Lite — Caneca (500ml)", price: "200 MT", desc: "Caneca 500ml." },
              { name: "Stella Artois Copo (350ml)", price: "200 MT", desc: "Stella Artois em copo." },
              { name: "Stella Artois Caneca (500ml)", price: "290 MT", desc: "Stella Artois em caneca." },
              { name: "Torre 2M", price: "1.300 MT", desc: "Torre de 2M à pressão." },
              { name: "Torre Stella", price: "1.800 MT", desc: "Torre de Stella Artois à pressão." },
            ]
          }
        ]
      },
      {
        name: "Cidras",
        items: [
          { name: "Brutal", price: "180 MT", desc: "Cidra Brutal." },
          { name: "Spin", price: "180 MT", desc: "Cidra Spin." },
          { name: "Flying Fish", price: "180 MT", desc: "Flying Fish." },
          { name: "Savana", price: "180 MT", desc: "Cidra Savana." },
          { name: "Savana Lemon", price: "180 MT", desc: "Cidra Savana sabor limão." },
          { name: "Hunter's Gold", price: "180 MT", desc: "Hunter's Gold." },
          { name: "Bernini", price: "180 MT", desc: "Bernini." },
          { name: "Black Crown", price: "180 MT", desc: "Black Crown." },
        ]
      },
      {
        name: "Cocktails",
        subcategories: [
          {
            name: "Cocktails",
            items: [
              { name: "Caipirinha de Frutos Vermelhos", price: "450 MT", desc: "Cachaça, frutos vermelhos, xarope de açúcar, gelo triturado." },
              { name: "Caipirinha/Caipirosca de Lima", price: "420 MT", desc: "Cachaça/vodka, lima, xarope de açúcar, gelo triturado." },
              { name: "Caipirinha/Caipirosca de Maracujá", price: "420 MT", desc: "Cachaça/vodka, maracujá, xarope de açúcar, gelo triturado." },
              { name: "Caipirinha/Caipirosca de Ananás", price: "420 MT", desc: "Cachaça/vodka, ananás, xarope de açúcar, gelo triturado." },
              { name: "Caipirinha/Caipirosca de Morango", price: "420 MT", desc: "Cachaça/vodka, morango, xarope de açúcar, gelo triturado." },
              { name: "Mojito de Lima", price: "480 MT", desc: "Rum, lima, xarope de açúcar, hortelã, soda, gelo triturado." },
              { name: "Mojito de Maracujá", price: "480 MT", desc: "Rum, maracujá, xarope de açúcar, hortelã, soda, gelo triturado." },
              { name: "Mojito de Morango", price: "480 MT", desc: "Rum, morango, xarope de açúcar, hortelã, soda, gelo triturado." },
              { name: "Mojito de Ananás", price: "480 MT", desc: "Rum, ananás, xarope de açúcar, hortelã, soda, gelo triturado." },
              { name: "Mojito de Frutos Vermelhos", price: "480 MT", desc: "Rum, frutos vermelhos, xarope de açúcar, hortelã, soda, gelo triturado." },
              { name: "Margarita", price: "450 MT", desc: "Tequila, cointreau, sumo fresco de lima, xarope de açúcar, gelo em cubos." },
              { name: "Pina Colada", price: "480 MT", desc: "Rum, malibu, crème de coco, sumo de ananás, gelo em cubos." },
              { name: "Sex on the Beach", price: "450 MT", desc: "Vodka, licor de pêssego, sumo de laranja, grenadine, gelo em cubos." },
              { name: "Blue Hawaii", price: "450 MT", desc: "Vodka, malibu, sumo de ananás, blue corazon, gelo em cubos." },
              { name: "Cocktail Tropical à Iypson", price: "450 MT", desc: "Rum, gin, sumo de ananás, água de coco, gelo em cubos." },
              { name: "Negroni", price: "550 MT", desc: "Gin, vermouth rosso, campari." },
              { name: "Blue Lagoon", price: "420 MT", desc: "Vodka, blue corazon, sprite, gelo em cubos." },
              { name: "Long Island Ice Tea", price: "650 MT", desc: "Vodka, rum, gin, tequila, triple sec, sumo fresco de lima, xarope de açúcar, coca cola, gelo em cubos." },
              { name: "Miami Beach Ice and Tea", price: "650 MT", desc: "Vodka, rum, gin, tequila, blue corazon, xarope de açúcar, limonada, gelo em cubos." },
              { name: "Beverly Hills Ice Tea", price: "650 MT", desc: "Vodka, rum, gin, tequila, triple sec, sumo fresco de lima, xarope de lima, xarope de açúcar, espumante branco, gelo em cubos." },
              { name: "Frozen Strawberry Daiquiri", price: "550 MT", desc: "Rum, sumo fresco de lima, xarope de açúcar, sour mix, morangos." },
              { name: "Frozen à Iypson", price: "550 MT", desc: "Rum, gin, creme de morango, morangos, sour mix, raspas de coco ralado." },
              { name: "Frozen Pina Colada", price: "550 MT", desc: "Rum, creme de coco, sumo fresco de lima, sumo de ananás." },
              { name: "Frozen Margarita", price: "550 MT", desc: "Tequila, sumo fresco de lima, triple sec, creme de margarita, xarope de açúcar." },
              { name: "Frutos Vermelhos Extra", price: "150 MT", desc: "Extra de frutos vermelhos em qualquer cocktail." },
            ]
          },
          {
            name: "Mocktails (Sem Álcool)",
            items: [
              { name: "Virgem Caipirinha de Lima", price: "350 MT", desc: "Sumo fresco de lima, rodelas de lima, xarope de açúcar, gelo triturado." },
              { name: "Virgem Caipirinha de Frutos Vermelhos", price: "350 MT", desc: "Morangos, framboesas, amoras, xarope de groselha, xarope de açúcar, gelo triturado." },
              { name: "Virgem Caipirinha do Fruto da Época", price: "350 MT", desc: "Fruto da época, xarope de açúcar, creme de fruto da época, sumo de fruto da época, gelo triturado." },
              { name: "Virgem Mojito", price: "350 MT", desc: "Rodelas de lima, xarope de açúcar, hortelã, sumo fresco de lima." },
              { name: "Virgem Sex on the Beach", price: "350 MT", desc: "Sumo de lima, grenadine, gelo." },
              { name: "Virgem à Iypson", price: "350 MT", desc: "Sumo de ananás, sumo de laranja, grenadine, ginger ale." },
              { name: "Virgem Frozen Strawberry Daiquiri", price: "350 MT", desc: "Sumo fresco de lima, xarope de açúcar, sour mix, morangos." },
            ]
          }
        ]
      },
      {
        name: "Bebidas Naturais & Refrigerantes",
        items: [
          { name: "Sumo de Laranja", price: "350 MT", desc: "Sumo de laranja natural." },
          { name: "Limonada", price: "350 MT", desc: "Limonada natural." },
          { name: "Sumo de Ananás", price: "350 MT", desc: "Sumo de ananás natural." },
          { name: "Sumo de Ananás, Laranja e Cenoura", price: "400 MT", desc: "Mistura energizante de ananás, laranja e cenoura." },
          { name: "Água 0.5L", price: "80 MT", desc: "Água mineral 500ml." },
          { name: "Água 1.5L", price: "180 MT", desc: "Água mineral 1.5L." },
          { name: "Água das Pedras", price: "150 MT", desc: "Água com gás." },
          { name: "Cappy", price: "120 MT", desc: "Sumo Cappy." },
          { name: "Sumo 1L", price: "250 MT", desc: "Sumo de pacote 1L." },
          { name: "Refrescos", price: "120 MT", desc: "Coca-Cola, Pepsi, Fanta, etc." },
          { name: "Mixer's (Tónica/Dry Lemon/Ginger Ale/Soda)", price: "120 MT", desc: "Selecção de mixers." },
          { name: "Energéticos (Red Bull/Monster)", price: "180 MT", desc: "Bebida energética à escolha." },
        ]
      },
      {
        name: "Gins",
        items: [
          { name: "Beefeater Pink (dose)", price: "200 MT", desc: "Gin Beefeater Pink." },
          { name: "Beefeater Pink (garrafa)", price: "3.500 MT", desc: "Garrafa de Beefeater Pink." },
          { name: "Beefeater Orange (dose)", price: "200 MT", desc: "Gin Beefeater Orange." },
          { name: "Beefeater Orange (garrafa)", price: "3.500 MT", desc: "Garrafa de Beefeater Orange." },
          { name: "Beefeater Dry (dose)", price: "200 MT", desc: "Gin Beefeater Dry." },
          { name: "Beefeater Dry (garrafa)", price: "3.500 MT", desc: "Garrafa de Beefeater Dry." },
          { name: "Beefeater 24 (dose)", price: "200 MT", desc: "Gin Beefeater 24." },
          { name: "Malfy (dose)", price: "200 MT", desc: "Gin Malfy." },
          { name: "Malfy (garrafa)", price: "3.500 MT", desc: "Garrafa de Malfy Gin." },
          { name: "Inverroche (dose)", price: "200 MT", desc: "Gin Inverroche." },
          { name: "Inverroche (garrafa)", price: "3.500 MT", desc: "Garrafa de Inverroche Gin." },
          { name: "Tanqueray (dose)", price: "200 MT", desc: "Gin Tanqueray." },
          { name: "Bombay (dose)", price: "200 MT", desc: "Gin Bombay." },
          { name: "Bombay (garrafa)", price: "3.500 MT", desc: "Garrafa de Bombay Gin." },
          { name: "Bull Dog (dose)", price: "200 MT", desc: "Bull Dog Gin." },
          { name: "Bull Dog (garrafa)", price: "3.500 MT", desc: "Garrafa de Bull Dog Gin." },
          { name: "Hendrick's (dose)", price: "200 MT", desc: "Gin Hendrick's." },
          { name: "Hendrick's (garrafa)", price: "3.500 MT", desc: "Garrafa de Hendrick's Gin." },
        ]
      },
      {
        name: "Espirituosas & Vinhos",
        subcategories: [
          {
            name: "Rum & Aguardentes",
            items: [
              { name: "Martel Blue Swift (dose)", price: "300 MT", desc: "Cognac Martel Blue Swift." },
              { name: "Martel Blue Swift (garrafa)", price: "8.900 MT", desc: "Garrafa de Martel Blue Swift." },
              { name: "Martel VS (dose)", price: "300 MT", desc: "Cognac Martel VS." },
              { name: "Martel VS (garrafa)", price: "6.500 MT", desc: "Garrafa de Martel VS." },
              { name: "Bumbu (dose)", price: "300 MT", desc: "Rum Bumbu." },
              { name: "Bumbu (garrafa)", price: "5.900 MT", desc: "Garrafa de Rum Bumbu." },
              { name: "Bumbu XO (dose)", price: "400 MT", desc: "Rum Bumbu XO." },
              { name: "Bumbu XO (garrafa)", price: "6.900 MT", desc: "Garrafa de Bumbu XO." },
              { name: "Havana Club 3", price: "200 MT", desc: "Rum Havana Club 3 anos." },
              { name: "1920", price: "200 MT", desc: "Rum 1920." },
              { name: "São Domingos", price: "200 MT", desc: "Rum São Domingos." },
              { name: "Bacardi (dose)", price: "200 MT", desc: "Rum Bacardi." },
              { name: "Bacardi (garrafa)", price: "3.500 MT", desc: "Garrafa de Bacardi." },
              { name: "Captain Morgan Spice Gold (dose)", price: "200 MT", desc: "Captain Morgan Spice Gold." },
              { name: "Captain Morgan Spice Gold (garrafa)", price: "3.500 MT", desc: "Garrafa de Captain Morgan Spice Gold." },
              { name: "Captain Morgan Dark Rum", price: "200 MT", desc: "Captain Morgan Dark Rum." },
              { name: "Tia Maria", price: "200 MT", desc: "Licor Tia Maria." },
            ]
          },
          {
            name: "Vinhos Tintos",
            items: [
              { name: "Quinta da Bolota Prestige (PT)", price: "2.800 MT", desc: "Vinho tinto português." },
              { name: "The Chocolate Block (SA)", price: "2.900 MT", desc: "Vinho tinto sul-africano." },
              { name: "Silk e Spice (FR)", price: "2.900 MT", desc: "Vinho tinto francês." },
              { name: "Segredos de São Miguel (PT)", price: "2.500 MT", desc: "Vinho tinto português." },
              { name: "Fat Bastard (FR)", price: "1.900 MT", desc: "Vinho tinto francês." },
              { name: "Cabriz Tinto (PT)", price: "1.990 MT", desc: "Vinho tinto Cabriz." },
              { name: "Portada (PT)", price: "1.500 MT", desc: "Vinho tinto Portada." },
              { name: "Casa da Malta 250ml (PT)", price: "1.700 MT", desc: "Vinho tinto em garrafa pequena." },
              { name: "Groot Constantia (SA)", price: "2.900 MT", desc: "Vinho tinto sul-africano." },
              { name: "Casa da Insua (FR)", price: "2.900 MT", desc: "Vinho tinto francês." },
              { name: "Esporão Reserve (PT)", price: "4.200 MT", desc: "Vinho tinto Esporão Reserva." },
              { name: "Mucho Más (ESP)", price: "3.200 MT", desc: "Vinho tinto espanhol." },
            ]
          },
          {
            name: "Vinhos Brancos",
            items: [
              { name: "Spier Sauvignon (FR)", price: "1.700 MT", desc: "Vinho branco Sauvignon." },
              { name: "Aveleda Branco (PT)", price: "1.800 MT", desc: "Vinho branco Aveleda." },
              { name: "Cabriz Branco (PT)", price: "1.900 MT", desc: "Vinho branco Cabriz." },
              { name: "Fat Bastard Blanc (FR)", price: "1.900 MT", desc: "Vinho branco francês." },
              { name: "Fleur de Cap (SA)", price: "1.500 MT", desc: "Vinho branco sul-africano." },
              { name: "Boschendal 1685 Sauvignon Blanc", price: "1.900 MT", desc: "Vinho branco Sauvignon Blanc." },
              { name: "Boschendal 1685 Chardonnay", price: "1.700 MT", desc: "Vinho branco Chardonnay." },
              { name: "Gatão (PT)", price: "1.500 MT", desc: "Vinho verde Gatão." },
              { name: "Aveleda Vinho Verde (PT)", price: "1.500 MT", desc: "Vinho verde Aveleda." },
              { name: "Casal Garcia (PT)", price: "1.800 MT", desc: "Vinho verde Casal Garcia." },
            ]
          },
          {
            name: "Vinhos à Copo",
            items: [
              { name: "Vale Romoes Tinto", price: "350 MT", desc: "Copo de vinho tinto." },
              { name: "Vale Romoes Branco", price: "420 MT", desc: "Copo de vinho branco." },
              { name: "Encostas do Bairro", price: "420 MT", desc: "Copo de vinho." },
              { name: "Vinho à Copo (selecção)", price: "450 MT", desc: "Copo de vinho da selecção do dia." },
              { name: "Vinho Branco à Copo", price: "390 MT", desc: "Copo de vinho branco." },
            ]
          },
          {
            name: "Espumantes & Sangrias",
            items: [
              { name: "Belaire Luxe", price: "5.500 MT", desc: "Espumante Belaire Luxe." },
              { name: "Belaire Rose", price: "5.500 MT", desc: "Espumante Belaire Rosé." },
              { name: "Belaire Bleu", price: "5.500 MT", desc: "Espumante Belaire Bleu." },
              { name: "Belaire Gold", price: "5.900 MT", desc: "Espumante Belaire Gold." },
              { name: "Moët Ice", price: "8.900 MT", desc: "Champagne Moët Ice." },
              { name: "Moët Imperial", price: "7.200 MT", desc: "Champagne Moët Imperial." },
              { name: "Veuve Rich", price: "10.900 MT", desc: "Champagne Veuve Clicquot Rich." },
              { name: "Tosti", price: "2.500 MT", desc: "Espumante Tosti." },
              { name: "J.C Le Roux", price: "2.200 MT", desc: "Espumante J.C Le Roux." },
              { name: "Pongracz Noble Néctar", price: "2.800 MT", desc: "Espumante Pongracz Noble Néctar." },
              { name: "Sangria de Frutos Vermelhos", price: "2.500 MT", desc: "Sangria de frutos vermelhos." },
              { name: "Sangria de Espumante", price: "2.200 MT", desc: "Sangria de espumante (sai com a garrafa de espumante)." },
              { name: "Sangria de Vinho Tinto", price: "1.990 MT", desc: "Sangria de vinho tinto." },
              { name: "Sangria de Vinho Branco", price: "1.990 MT", desc: "Sangria de vinho branco." },
              { name: "Sangria de Espumante Sem Álcool", price: "1.900 MT", desc: "Sangria de espumante sem álcool (sai com a garrafa de espumante)." },
            ]
          },
          {
            name: "Aperitivos",
            items: [
              { name: "Martini Bianco", price: "200 MT", desc: "Aperitivo Martini Bianco." },
              { name: "Martini Tinto", price: "200 MT", desc: "Aperitivo Martini Tinto." },
              { name: "Vinho do Porto", price: "200 MT", desc: "Vinho do Porto." },
              { name: "Amarula", price: "200 MT", desc: "Licor Amarula." },
            ]
          }
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
          { name: "Espetada de Camarão", price: "850 MT", desc: "Camarão tigre with butter, garlic, and herbs." }
        ]
      },
      {
        name: "Carnes",
        items: [
          { name: "Picanha na Brasa", price: "1.200 MT", desc: "Grilled picanha with rock salt." },
          { name: "Costelas de Vaca", price: "950 MT", desc: "Beef ribs with house barbecue sauce." },
          { name: "Frango Inteiro Grelhado", price: "880 MT", desc: "Whole chicken grilled over charcoal." }
        ]
      },
      {
        name: "Acompanhamentos",
        items: [
          { name: "Funge de Mandioca", price: "80 MT", desc: "Traditional cassava side dish." },
          { name: "Batata Frita", price: "120 MT", desc: "Crispy fries seasoned with garlic and parsley." },
          { name: "Salada Mista", price: "100 MT", desc: "Mixed salad with lettuce, tomato, cucumber." }
        ]
      },
      {
        name: "Bebidas",
        items: [
          { name: "Cerveja 2M", price: "80 MT", desc: "National beer of Mozambique." },
          { name: "Sumo de Maracujá", price: "100 MT", desc: "Fresh passion fruit juice." }
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
    name: "O Cantinho do Gato",
    tagline: "Sabor Tradicional",
    desc: "A autêntica experiência da gastronomia moçambicana. Venha provar o melhor da nossa terra.",
    price: "",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/cantinho-do-gato"
  },
  {
    id: 2,
    name: "Pátio do Luís",
    tagline: "Requinte e Tradição",
    desc: "O melhor da cozinha portuguesa com um toque moderno. Pratos premium para momentos especiais.",
    price: "",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/patio-luis"
  },
  {
    id: 3,
    name: "Sabor do Mar",
    tagline: "Frescura Absoluta",
    desc: "Mariscos frescos da baía de Maputo direto para a sua mesa. O destino número 1 para amantes do mar.",
    price: "",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1200&auto=format&fit=crop",
    link: "/restaurante/sabor-do-mar"
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    slug: "matapa-maputo",
    title: "Onde encontrar a melhor Matapa em Maputo?",
    excerpt: "Descubra os segredos deste prato icónico moçambicano e os lugares onde a tradição é sagrada.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    date: "24 Fev, 2026",
    author: "Equipa MenusMOZ",
    category: "Cultura",
    content: "A Matapa é um dos pratos mais emblemáticos de Moçambique, feita a partir de folhas de mandioca piladas, coco e amendoim. Em Maputo, a busca pela matapa perfeita pode levá-lo de mercados populares a restaurantes de alta gastronomia.\n\nRestaurantes como o Cantinho do Gato preservam a receita tradicional com o sabor autêntico do litoral. Já outros espaços modernos começam a experimentar com novas apresentações, mantendo sempre a base rica e cremosa que todos adoramos.\n\nNão deixe de provar as versões com camarão ou caranguejo, que elevam este prato a um nível de sofisticação único. O segredo está no tempo de refogado das folhas e na cremosidade do leite de coco fresco."
  },
  {
    id: 2,
    slug: "marisco-fresco-avenida-marginal",
    title: "Marisco Fresco: Do mar para o prato na Avenida Marginal",
    excerpt: "Uma volta pelos restaurantes que servem o camarão e a lagosta mais frescos da capital.",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=800&auto=format&fit=crop",
    date: "20 Fev, 2026",
    author: "Sofia Mucavele",
    category: "Notícias",
    content: "A Avenida Marginal em Maputo continua a ser o epicentro para os amantes de marisco. Com a brisa do mar como acompanhamento, diversos estabelecimentos oferecem o que há de mais fresco no Oceano Índico.\n\nFomos visitar o Sabor do Mar, onde o camarão tigre é grelhado no momento com o ponto perfeito de sal e alho. Outros espaços como o Baía Lounge oferecem tábuas de marisco que são um verdadeiro festim para os sentidos, combinando lagosta, lulas e amêijoas.\n\nO segredo destes espaços reside na relação direta com os pescadores locais, garantindo que o produto chega à mesa poucas horas depois de sair das águas moçambicanas."
  },
  {
    id: 3,
    slug: "mercado-28-street-food",
    title: "Review: Mercado 28 e a revolução da Street Food",
    excerpt: "Fomos provar os burgers de picanha e os cocktails que estão a dar que falar em Maputo.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    date: "15 Fev, 2026",
    author: "Carlos Langa",
    category: "Reviews",
    content: "O Mercado 28 não é apenas um local para comer; é uma experiência urbana no coração de Maputo. Este moderno pátio de street food reuniu alguns dos conceitos gastronómicos mais inovadores da cidade num ambiente cosmopolita.\n\nO destaque vai para o Brasa Viva, onde os burgers de picanha redefinem o conceito de hambúrguer gourmet. Carne suculenta, queijo derretido e pão brioche artesanal fazem desta uma das melhores opções de almoço rápido na capital.\n\nPara acompanhar, a carta de cocktails é vasta e criativa, usando frutas locais como o maphilwa e a litchi. É o ponto de encontro perfeito para um sunset com amigos ao som de boa música moçambicana."
  }
];
