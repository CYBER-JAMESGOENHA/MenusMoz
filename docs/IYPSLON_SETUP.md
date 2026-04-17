# Iypslon Setup

Este projeto nao precisa de `admin page` nem `dashboard` interno para gerir o primeiro restaurante. A configuracao pode ser feita diretamente no `Supabase`, que neste momento e a opcao mais simples e mais segura para voces.

## 1. Aplicar a migration nova

Depois de correr as migrations `001` ate `007`, aplique tambem:

- `supabase/migrations/008_restaurant_media_storage.sql`

Ela faz 3 coisas importantes:

- adiciona `cover_url`, `hero_image_url`, `logo_url` e `gallery` na tabela `restaurants`
- cria a tabela `owner_applications`, que ja e usada pela pagina `/proprietarios`
- cria o bucket `restaurant-media` no `Supabase Storage`

## 2. Criar a estrutura de imagens do Iypslon

No `Supabase Dashboard`:

1. Abra `Storage`
2. Entre no bucket `restaurant-media`
3. Crie a pasta `restaurants/iypslon`
4. Suba os ficheiros reais, por exemplo:

- `restaurants/iypslon/logo.png`
- `restaurants/iypslon/cover.jpg`
- `restaurants/iypslon/hero.jpg`
- `restaurants/iypslon/gallery-1.jpg`
- `restaurants/iypslon/gallery-2.jpg`

Recomendacoes:

- `logo`: PNG quadrado, fundo transparente se possivel, `600x600`
- `cover`: imagem horizontal para cards, `1600x900`
- `hero`: imagem horizontal ampla, `2000x1200`
- tamanho maximo por ficheiro: `10 MB`

## 3. Obter as URLs publicas

Com o bucket publico, cada imagem tera uma URL deste formato:

```text
https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/logo.png
```

Repita isso para `cover.jpg`, `hero.jpg` e as imagens da galeria.

## 4. Criar ou atualizar o restaurante Iypslon

No `Table Editor`, abra `restaurants`.

Se o restaurante ainda nao existir, pode usar algo deste genero:

```sql
insert into public.restaurants (
  slug,
  name,
  cuisine,
  description,
  location,
  address,
  whatsapp,
  phone,
  price_level,
  delivery_time,
  image_url,
  cover_url,
  hero_image_url,
  logo_url,
  identity_text,
  tags,
  is_active
) values (
  'iypslon',
  'Iypslon',
  'Contemporary Dining',
  'Experiencia gastronomica premium em Maputo.',
  'Maputo',
  'Maputo, Mocambique',
  '+258840000000',
  '+258840000000',
  '$$$',
  '30-45 min',
  'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/cover.jpg',
  'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/cover.jpg',
  'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/hero.jpg',
  'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/logo.png',
  'Fine dining com identidade visual real e conteudo gerido internamente.',
  array['fine-dining', 'maputo', 'signature'],
  true
);
```

Se ele ja existir, o mais normal sera fazer apenas:

```sql
update public.restaurants
set
  cover_url = 'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/cover.jpg',
  hero_image_url = 'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/hero.jpg',
  logo_url = 'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/logo.png',
  gallery = jsonb_build_array(
    jsonb_build_object(
      'type', 'image',
      'url', 'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/gallery-1.jpg',
      'title', 'Sala principal'
    ),
    jsonb_build_object(
      'type', 'image',
      'url', 'https://SEU-PROJECT-REF.supabase.co/storage/v1/object/public/restaurant-media/restaurants/iypslon/gallery-2.jpg',
      'title', 'Assinatura da casa'
    )
  )
where slug = 'iypslon';
```

## 5. Campos que o frontend usa hoje

O frontend ja esta preparado para ler:

- `logo_url`: logo pequeno circular no detalhe do restaurante
- `hero_image_url`: banner grande do topo
- `cover_url`: imagem principal dos cards e listagens
- `gallery`: galeria na seccao de ambiente

## 6. Quando a imagem nao aparece

Se uma imagem nao carregar, normalmente o problema e um destes:

- a migration `008` ainda nao foi aplicada
- o ficheiro foi colocado noutro bucket
- a URL publica esta errada
- o bucket nao ficou publico
- o restaurante ainda esta a apontar para imagens antigas em `image_url`

## 7. Fluxo recomendado daqui para frente

Como voces vao gerir tudo manualmente por enquanto, o fluxo mais leve e:

1. subir imagens reais para `Storage`
2. copiar a URL publica
3. colar essa URL nos campos da tabela `restaurants`
4. confirmar no site

Nao ha necessidade de construir `admin dashboard` para o `Iypslon` agora.
