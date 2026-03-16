## Design System: MenusMoz

### Pattern
- **Name:** Hero-Centric + Conversion
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Vibrant & Block-based
- **Keywords:** Bold, energetic, playful, block layout, geometric shapes, high color contrast, duotone, modern, energetic
- **Best For:** Startups, creative agencies, gaming, social media, youth-focused, entertainment, consumer
- **Performance:** ΓÜí Good | **Accessibility:** ΓùÉ Ensure WCAG

### Colors
| Role | Hex |
|------|-----|
| Primary | #DC2626 |
| Secondary | #F87171 |
| CTA | #CA8A04 |
| Background | #FEF2F2 |
| Text | #450A0A |

*Notes: Warm colors (Orange Red Brown) + appetizing imagery*

### Typography
- **Heading:** Playfair Display SC
- **Body:** Karla
- **Mood:** restaurant, menu, culinary, elegant, foodie, hospitality
- **Best For:** Restaurants, cafes, food blogs, culinary, hospitality
- **Google Fonts:** https://fonts.google.com/share?selection.family=Karla:wght@300;400;500;600;700|Playfair+Display+SC:wght@400;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&family=Playfair+Display+SC:wght@400;700&display=swap');
```

### Key Effects
Large sections (48px+ gaps), animated patterns, bold hover (color shift), scroll-snap, large type (32px+), 200-300ms

### Avoid (Anti-patterns)
- Low-quality imagery
- Outdated hours

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

