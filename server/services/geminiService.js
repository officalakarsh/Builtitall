const { GoogleGenAI } = require('@google/generative-ai');

// Generate Mock Content in case of missing API Key or API error
const getMockBusinessData = (businessName, category, address, phone) => {
  const categoryClean = category.toLowerCase();
  
  const mockImages = {
    hotel: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    ],
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
    ],
    'sweet-shop': [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    salon: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80'
    ],
    gym: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const images = mockImages[categoryClean] || mockImages['hotel'];

  const details = {
    hotel: {
      theme: { primaryColor: '#1E3A8A', secondaryColor: '#D97706', backgroundColor: '#F8FAFC', textColor: '#0F172A' },
      hero: {
        title: `Welcome to ${businessName}`,
        subtitle: 'Experience luxurious stays, premium hospitality, and breathtaking views right in the heart of the city.',
        ctaText: 'Book Your Stay Now',
        imageUrl: images[0]
      },
      about: {
        title: 'Where Comfort Meets Elegance',
        story: `${businessName} was founded with a single mission: to redefine premium lodging and personalized guest experiences. Every room is designed to blend contemporary design with ultimate relaxation, ensuring your visit is nothing short of exceptional.`,
        imageUrl: images[1]
      },
      services: [
        { name: 'Deluxe Room Stay', description: 'Spacious king-size bedroom with ocean view, workspace, high-speed Wi-Fi, and smart TV.', price: '$120 / night', duration: 'Check-in 2:00 PM' },
        { name: 'Executive Suite', description: 'Ultimate luxury with separate lounge area, jacuzzi, complimentary minibar, and dining spaces.', price: '$220 / night', duration: 'Check-in 2:00 PM' },
        { name: 'Rooftop Fine Dining', description: 'Multi-cuisine restaurant offering local gourmet menus, premium wine tastings, and live music.', price: 'Menu prices vary', duration: 'Open daily 6:00 PM - 11:00 PM' }
      ],
      faqs: [
        { question: 'What are the check-in and check-out timings?', answer: 'Check-in is from 2:00 PM onwards, and check-out is by 11:00 AM. Early check-in or late check-out can be requested, subject to availability.' },
        { question: 'Is breakfast included in the booking rate?', answer: 'Yes, all our room bookings include a complimentary buffet breakfast at our lobby café.' }
      ]
    },
    restaurant: {
      theme: { primaryColor: '#B91C1C', secondaryColor: '#F59E0B', backgroundColor: '#FFFDFB', textColor: '#111827' },
      hero: {
        title: `Savor Exquisite Flavors at ${businessName}`,
        subtitle: 'Indulge in a curated collection of local culinary treasures, crafted with love and fresh ingredients by our master chefs.',
        ctaText: 'Reserve a Table',
        imageUrl: images[0]
      },
      about: {
        title: 'A Culinary Journey Like No Other',
        story: `At ${businessName}, we believe food is an art form. Established in 2018, we have quickly become the community's favorite gathering spot, focusing on organic, farm-to-table ingredients and traditional cooking techniques that bring bold, delicious flavors to your plate.`,
        imageUrl: images[1]
      },
      services: [
        { name: 'Chef\'s Special Multi-Course Dinner', description: 'A signature 5-course degustation menu highlighting seasonal inputs and paired wines.', price: '$65 / person', duration: 'approx. 2 hours' },
        { name: 'Private Table Reservation', description: 'Reserve our premium corner or window tables for celebrations, including welcome drinks.', price: '$15 deposit', duration: 'Allocated for 2.5 hours' },
        { name: 'Weekend Family Brunch', description: 'An all-you-can-eat spread with bottomless fresh mocktails, dessert bar, and live stations.', price: '$35 / person', duration: 'Saturdays & Sundays 11:00 AM' }
      ],
      faqs: [
        { question: 'Do you offer vegan and gluten-free alternatives?', answer: 'Yes! Our menu has clear labels for vegan, vegetarian, and gluten-free items. You can also request custom modifications.' },
        { question: 'Can we book the entire restaurant for private events?', answer: 'Absolutely. We host corporate dinners, birthday parties, and wedding receptions. Contact our manager for booking rates.' }
      ]
    },
    'sweet-shop': {
      theme: { primaryColor: '#DB2777', secondaryColor: '#F43F5E', backgroundColor: '#FFF5F7', textColor: '#374151' },
      hero: {
        title: `Sweeten Every Moment with ${businessName}`,
        subtitle: 'Delight in authentic traditional Indian sweets, customized celebratory cakes, and artisanal handmade chocolates.',
        ctaText: 'Place Custom Order',
        imageUrl: images[0]
      },
      about: {
        title: 'Crafting Sweets with Legacy',
        story: `For generations, ${businessName} has been the cornerstone of sweetness and celebrations in town. We use high-quality pure ghee, fresh milk, and premium saffron to handcraft recipes passed down through families, keeping authenticity alive in every bite.`,
        imageUrl: images[1]
      },
      services: [
        { name: 'Assorted Premium Sweet Box', description: 'Custom selection box containing Kaju Katli, Motichoor Ladoo, Pista Mawa Roll, and Kesar Peda.', price: '$25 / kg', duration: 'Freshly packed' },
        { name: 'Custom Celebratory Cakes', description: 'Handcrafted multi-tier cakes for birthdays, weddings, and anniversaries. Order 2 days in advance.', price: 'From $40', duration: 'Made to order' },
        { name: 'Festival Gift Hampers', description: 'Beautifully decorated boxes containing sweets, dry fruits, chocolates, and celebratory items.', price: '$35 onwards', duration: 'Available during holidays' }
      ],
      faqs: [
        { question: 'Do you offer sugar-free options?', answer: 'Yes, we have a dedicated section of sugar-free sweets made with natural sweeteners like stevia, including sugar-free dry fruit ladoos.' },
        { question: 'Do you ship sweets out of state?', answer: 'Yes, we offer premium airtight packaging that preserves freshness for nationwide courier deliveries.' }
      ]
    },
    salon: {
      theme: { primaryColor: '#EC4899', secondaryColor: '#8B5CF6', backgroundColor: '#FAF5FF', textColor: '#1F2937' },
      hero: {
        title: `Reinvent Your Style at ${businessName}`,
        subtitle: 'Step into a world of pampering and visual transformation. Expert haircuts, glowing facials, and professional styling.',
        ctaText: 'Book an Appointment',
        imageUrl: images[0]
      },
      about: {
        title: 'Where Beauty Meets Science & Style',
        story: `At ${businessName}, we believe self-care is a necessity, not a luxury. Our team of certified hair stylists, beauticians, and skin experts curate personalized packages to bring out your natural glow and complement your unique personality.`,
        imageUrl: images[1]
      },
      services: [
        { name: 'Signature Haircut & Blowdry', description: 'Detailed hair consultation, premium wash, custom cut, and styled blowout finish by senior stylist.', price: '$55', duration: '60 mins' },
        { name: 'Hydra-Facial Therapy', description: 'Deep exfoliation, hydration therapy, skin-nourishing serums, and relaxing face massage.', price: '$85', duration: '75 mins' },
        { name: 'Bridal Makeover & Styling', description: 'Complete bridal hair design, HD makeup, and nail extensions. Trial session included.', price: '$250', duration: '3 hours' }
      ],
      faqs: [
        { question: 'Do you allow walk-in appointments?', answer: 'While we try to accommodate walk-ins, we highly recommend booking in advance to avoid waiting, especially on weekends.' },
        { question: 'What beauty product brands do you use?', answer: 'We use premium, dermatologically tested, organic, and cruelty-free brands like L\'Oréal Professional, Estée Lauder, and Dermalogica.' }
      ]
    },
    gym: {
      theme: { primaryColor: '#111827', secondaryColor: '#10B981', backgroundColor: '#F9FAFB', textColor: '#111827' },
      hero: {
        title: `Unleash Your Strength at ${businessName}`,
        subtitle: 'State-of-the-art training gear, expert coaches, and energetic group workout formats designed to help you smash fitness goals.',
        ctaText: 'Join the Gym Today',
        imageUrl: images[0]
      },
      about: {
        title: 'Build A Healthier, Stronger You',
        story: `${businessName} isn't just a gym; it is a community of driven individuals committed to healthy lifestyles. With custom workout schemes, custom diet charts, and motivating trainers, we support you through every single lift and mile.`,
        imageUrl: images[1]
      },
      services: [
        { name: 'All-Access Monthly Membership', description: 'Unlimited entry to gym floor, cardio zone, lockers, steam rooms, and orientation training session.', price: '$49 / month', duration: '1 month' },
        { name: '1-on-1 Personal Coaching', description: 'Personalized workout planning, posture analysis, bi-weekly progress check, and customized meal schemes.', price: '$150 / month', duration: '12 sessions' },
        { name: 'High-Intensity Group HIIT/Yoga Class', description: 'Energetic group workouts including cardio, weight drills, flexibility, and core exercises.', price: '$15 / session', duration: '45 mins' }
      ],
      faqs: [
        { question: 'Is there a trial class available?', answer: 'Yes! We offer a free 1-day pass for local residents so you can tour the gym and try any group workout.' },
        { question: 'Are there personal trainers available during all hours?', answer: 'Yes, certified floor trainers are always present on the floor during operational hours (5:00 AM - 10:00 PM).' }
      ]
    }
  };

  const selected = details[categoryClean] || details['hotel'];

  return {
    theme: selected.theme,
    content: {
      hero: selected.hero,
      about: selected.about,
      services: selected.services,
      faqs: selected.faqs,
      contact: {
        email: `contact@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone,
        address,
        mapsUrl: 'https://maps.google.com'
      }
    },
    seo: {
      title: `${businessName} | Best ${category} in Town`,
      metaDescription: `Discover the best local ${category} services at ${businessName}. Find contact info, book appointments, and check reviews online.`,
      keywords: [businessName, category, 'local business', 'booking', address],
      openGraph: {
        title: `${businessName} - Generated Website`,
        description: `Explore services and book directly at ${businessName}.`,
        image: selected.hero.imageUrl
      }
    }
  };
};

// Main function to query Gemini and parse structured JSON
exports.generateAIWebsiteData = async (businessName, category, address, phone, description) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Using fallback mock generation.');
    return getMockBusinessData(businessName, category, address, phone);
  }

  try {
    // Initialize Google Gen AI with the new API schema
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert copywriter, SEO specialist, and UI designer helper.
Generate a comprehensive website structure, visual theme, and SEO metadata in valid JSON format for a local business with the details below.

Business Name: ${businessName}
Category: ${category} (Allowed: hotel, restaurant, sweet-shop, salon, gym)
Address: ${address}
Phone: ${phone}
Additional Business Description: ${description || 'A premium service offering maximum client satisfaction.'}

Your response must be a single, strict, valid JSON object matching the JSON schema below. DO NOT output markdown blocks or backticks, just raw JSON.

JSON Schema structure:
{
  "theme": {
    "primaryColor": "A premium HEX color code that perfectly fits the business category. E.g., elegant navy/gold for hotel, red/amber for restaurant, pink/rose for sweets/salons, dark slate/emerald for gyms",
    "secondaryColor": "A complementary HEX color code",
    "backgroundColor": "A very light, premium background HEX color code (close to white or dark charcoal if dark theme matches better)",
    "textColor": "A readable contrasting dark or light HEX color code"
  },
  "content": {
    "hero": {
      "title": "A catchy, modern, customer-attracting headline for the hero section",
      "subtitle": "A persuasive 1-2 sentence description explaining the key value proposition",
      "ctaText": "Call to action button text (e.g., 'Book Now', 'Explore Rooms', 'Order Sweets')",
      "imageUrl": "Choose a high-quality Unsplash image URL that matches the category. Choose a realistic standard URL from:
                   - Hotel: https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80
                   - Restaurant: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80
                   - Sweet Shop: https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80
                   - Salon: https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80
                   - Gym: https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
    },
    "about": {
      "title": "A beautiful story header (e.g., 'Crafting Excellence Since ...')",
      "story": "A highly professional, warm 3-4 sentence background story of the business, its core philosophy, values, and quality assurance.",
      "imageUrl": "Another high-quality Unsplash image URL matching the category. Choose a realistic standard URL from:
                   - Hotel: https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80
                   - Restaurant: https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80
                   - Sweet Shop: https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80
                   - Salon: https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80
                   - Gym: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    },
    "services": [
      {
        "name": "Service/Product 1 Name (specific and realistic to the category)",
        "description": "Short, details-oriented description of what this includes.",
        "price": "Realistic pricing including symbol (e.g., $99, ₹250, $15/hr)",
        "duration": "Duration info if applicable (e.g., 45 mins, 1 night, per order)"
      },
      {
        "name": "Service/Product 2 Name",
        "description": "Short description.",
        "price": "Price",
        "duration": "Duration"
      },
      {
        "name": "Service/Product 3 Name",
        "description": "Short description.",
        "price": "Price",
        "duration": "Duration"
      }
    ],
    "faqs": [
      {
        "question": "A typical question customer might ask about this specific business category?",
        "answer": "A reassuring, informative response to the question."
      },
      {
        "question": "Another relevant question?",
        "answer": "Another detailed response."
      }
    ],
    "contact": {
      "email": "A realistic business email address based on name",
      "phone": "${phone}",
      "address": "${address}",
      "mapsUrl": "https://maps.google.com"
    }
  },
  "seo": {
    "title": "A search-engine-optimized, click-worthy meta title tags containing the business name and keywords (under 60 chars)",
    "metaDescription": "A compelling, keyword-rich search snippet explaining services, booking ease, and locations (under 160 chars)",
    "keywords": ["List", "of", "4-6", "relevant", "seo", "search", "keywords"],
    "openGraph": {
      "title": "Open Graph Title for Social Shares",
      "description": "Brief Open Graph Description",
      "image": "Choose one of the hero image URLs above"
    }
  }
}
`;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.response.text();
    // Parse response as JSON
    const parsedData = JSON.parse(text);
    return parsedData;

  } catch (error) {
    console.error('Error invoking Gemini API. Using fallback mock generation.', error);
    return getMockBusinessData(businessName, category, address, phone);
  }
};
