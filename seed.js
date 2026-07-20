const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

// Hand-crafted seed products (kept for high quality / featured items)
const initialProducts = [
  // ═══════════════════════════════════════
  // PERIPHERALS (10 products)
  // ═══════════════════════════════════════
  {
    title: 'Razer Huntsman V3 Pro Keyboard',
    description: 'Analog optical switches with adjustable actuation, magnetic wrist rest, and per-key RGB lighting for competitive gaming.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Logitech G Pro X Superlight 2',
    description: 'Ultra-lightweight 60g wireless gaming mouse with HERO 2 sensor, 44+ hour battery, and 5 programmable buttons.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'SteelSeries QcK Heavy XXL Mousepad',
    description: 'Extra-thick 6mm micro-woven cloth surface, non-slip rubber base, 900x400mm full-desk coverage.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1616353071588-708dcff912e2?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Xbox Elite Wireless Controller Series 3',
    description: 'Adjustable-tension thumbsticks, wraparound rubberized grip, 40-hour rechargeable battery, and 4 rear paddles.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Razer Kiyo Pro Ultra Webcam',
    description: '4K 30fps / 1080p 60fps streaming camera with adaptive light sensor and AI noise cancelling.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Corsair K100 RGB Mechanical Keyboard',
    description: 'OPX optical-mechanical switches, iCUE control wheel, 44-zone LightEdge, and 8MB onboard storage.',
    price: 229.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Razer DeathAdder V3 HyperSpeed',
    description: 'Ergonomic wireless gaming mouse with Focus Pro 35K sensor, 90-hour battery, and HyperSpeed wireless.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'SteelSeries Apex Pro TKL Wireless',
    description: 'Tenkeyless form factor with OmniPoint 2.0 adjustable switches, OLED smart display, and dual wireless.',
    price: 269.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'Elgato Stream Deck MK.2',
    description: '15 customizable LCD keys for live streaming and content creation with drag-and-drop setup.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236571?w=500&q=80',
    category: 'Peripherals',
  },
  {
    title: 'DualSense Edge Wireless Controller',
    description: 'Pro-level PS5 controller with remappable buttons, adjustable triggers, swappable stick caps, and carrying case.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80',
    category: 'Peripherals',
  },

  // ═══════════════════════════════════════
  // HARDWARE (10 products)
  // ═══════════════════════════════════════
  {
    title: 'NVIDIA GeForce RTX 4090 Founders Edition',
    description: 'Ada Lovelace architecture, 24GB GDDR6X, 16384 CUDA cores, ray tracing 3rd gen, DLSS 3 frame generation.',
    price: 1599.99,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'AMD Ryzen 9 7950X3D Processor',
    description: '16-core, 32-thread CPU with 3D V-Cache technology, 5.7GHz max boost, and 128MB L3 cache for gaming dominance.',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'Corsair Dominator Platinum RGB 64GB DDR5',
    description: '64GB (2x32GB) DDR5-6000MHz with patented DHX cooling, iCUE-controlled Capellix LEDs, XMP 3.0.',
    price: 329.99,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'Samsung 990 Pro 4TB NVMe SSD',
    description: 'PCIe 4.0 x4, sequential read up to 7,450 MB/s, write up to 6,900 MB/s, RGB heat sink included.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'Corsair RM1000x SHIFT 1000W PSU',
    description: '80 PLUS Gold certified, fully modular with side-mounted connectors, zero RPM fan mode, 10-year warranty.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'ASUS ROG Strix X670E-E Gaming Motherboard',
    description: 'AMD AM5 socket, DDR5, PCIe 5.0, WiFi 6E, Aura Sync RGB, dual M.2 with heatsinks.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'NZXT Kraken X73 RGB AIO Cooler',
    description: '360mm AIO liquid cooler with 2.36" LCD display, Asetek 7th gen pump, and customizable screen animations.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'AMD Radeon RX 7900 XTX',
    description: 'RDNA 3 architecture, 24GB GDDR6, 96 compute units, hardware ray tracing, and DisplayPort 2.1.',
    price: 949.99,
    image: 'https://images.unsplash.com/photo-1555618254-5e16e1b2f68b?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'Lian Li O11 Dynamic EVO Gaming Case',
    description: 'Dual-chamber ATX mid-tower, tempered glass panels, modular I/O, supports up to 360mm radiators on 3 sides.',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&q=80',
    category: 'Hardware',
  },
  {
    title: 'Seagate FireCuda 530 2TB NVMe SSD',
    description: 'PCIe Gen4 ×4, 7300 MB/s read, 6900 MB/s write, PS5 compatible with heatsink, 2550 TBW endurance.',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80',
    category: 'Hardware',
  },

  // ═══════════════════════════════════════
  // DISPLAYS (10 products)
  // ═══════════════════════════════════════
  {
    title: 'ASUS ROG Swift PG32UQX 32" 4K Monitor',
    description: '4K 144Hz IPS, Mini-LED backlight with 1400 nits peak brightness, HDMI 2.1, G-Sync Ultimate.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'Samsung Odyssey G9 49" Curved Monitor',
    description: '49-inch DQHD 5120x1440, 240Hz, 1ms GtG, Quantum Mini-LED, 1000R curvature, HDR2000.',
    price: 1799.99,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'LG 27GP950-B 27" 4K UltraGear Monitor',
    description: '4K Nano IPS, 160Hz, 1ms GtG, HDMI 2.1, FreeSync Premium Pro, DCI-P3 98%, VESA DisplayHDR 600.',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'Alienware AW3423DWF 34" QD-OLED Monitor',
    description: '34-inch QD-OLED curved ultrawide, 3440x1440, 165Hz, 0.1ms, FreeSync Premium Pro, infinite contrast.',
    price: 1099.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'BenQ ZOWIE XL2546K 24.5" Esports Monitor',
    description: '240Hz DyAc+ for blur reduction, 0.5ms GtG, S-Switch controller, Shield for focus. Tournament standard.',
    price: 549.99,
    image: 'https://images.unsplash.com/photo-1616763355548-1b11cea07948?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'MSI MEG 342C QD-OLED 34" Monitor',
    description: '34-inch QD-OLED ultrawide, 175Hz, 0.03ms GtG, USB-C 90W PD, KVM switch, and console mode.',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'Gigabyte M28U 28" 4K Gaming Monitor',
    description: '28-inch 4K 144Hz SS IPS, HDMI 2.1, KVM, FreeSync Premium Pro, 2ms GtG, HBR3 DisplayPort.',
    price: 649.99,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'ASUS ROG Swift 360Hz PG259QN Monitor',
    description: '24.5-inch Full HD, 360Hz refresh rate, 1ms GtG, NVIDIA Reflex Latency Analyzer, G-Sync Esports.',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1609081219571-761b6a833646?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'LG 48GQ900-B 48" 4K OLED Gaming Monitor',
    description: '48-inch OLED 4K 120Hz with anti-glare coating, 0.1ms GtG, FreeSync Premium, webOS smart features.',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&q=80',
    category: 'Displays',
  },
  {
    title: 'AOC AGON AG274QZM 27" Gaming Monitor',
    description: '27-inch QHD 240Hz, Mini-LED 576 zones, DisplayHDR 1000, 1ms GtG, HDMI 2.1 for PC and console.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&q=80',
    category: 'Displays',
  },

  // ═══════════════════════════════════════
  // AUDIO (10 products)
  // ═══════════════════════════════════════
  {
    title: 'SteelSeries Arctis Nova Pro Wireless Headset',
    description: 'Active noise cancelling, hot-swappable battery system, hi-res audio DAC, 360° spatial audio, retractable mic.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'HyperX Cloud III Wireless Gaming Headset',
    description: 'DTS:X Spatial Audio, 53mm drivers, up to 120-hour battery, detachable noise-cancelling mic, memory foam.',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Razer Seiren V3 Chroma USB Microphone',
    description: 'Condenser mic with tap-to-mute, Chroma RGB ring, built-in shock absorber, cardioid pickup pattern.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Creative Sound Blaster X5 Hi-Res DAC/Amp',
    description: 'Dual-DAC XMOS XU316, 32-bit/384kHz playback, Dolby Digital Live, dedicated headphone amp up to 600Ω.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Razer Leviathan V2 Pro Soundbar',
    description: 'THX Spatial Audio with head-tracking camera, Dolby Audio, wireless subwoofer, and Chroma RGB underglow.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Astro A50 X Wireless Gaming Headset',
    description: 'Cross-platform wireless headset (PC/Xbox/PS5), Dolby Atmos, 24-hour battery, magnetic charging dock.',
    price: 379.99,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Blue Yeti X Professional USB Microphone',
    description: '4-capsule condenser array, Blue VO!CE software, hi-res metering, 48kHz sample rate, multi-pattern.',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'JBL Quantum 910 Wireless Headset',
    description: 'Head-tracking spatial sound, ANC, dual wireless (2.4GHz + BT), 39-hour battery, flip-up boom mic.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Corsair Virtuoso RGB Wireless XT Headset',
    description: 'Hi-Fi audio, Dolby Atmos on PC, slipstream wireless + Bluetooth, broadcast-grade detachable mic.',
    price: 269.99,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
    category: 'Audio',
  },
  {
    title: 'Rode NT-USB Mini Studio Microphone',
    description: 'Studio-grade condenser with integrated pop filter, headphone amplifier, and magnetic desk stand.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1567596275753-92607c3c0d5d?w=500&q=80',
    category: 'Audio',
  },

  // ═══════════════════════════════════════
  // CONSOLES (10 products)
  // ═══════════════════════════════════════
  {
    title: 'PlayStation 5 Pro Console',
    description: 'Enhanced GPU with 67% more compute units, 2TB SSD, Wi-Fi 7, 8K output support, and ray tracing boost.',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Xbox Series X Console',
    description: '12 teraflops GPU, 1TB custom NVMe SSD, 4K@120fps, Quick Resume, Xbox Game Pass compatible.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Nintendo Switch OLED Model',
    description: '7-inch OLED screen, wide adjustable stand, 64GB internal storage, enhanced audio, wired LAN port.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Steam Deck OLED 1TB',
    description: '7.4-inch HDR OLED, AMD APU with RDNA 2, 1TB NVMe SSD, Wi-Fi 6E, 30-50% more battery life.',
    price: 649.99,
    image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'ASUS ROG Ally X Handheld',
    description: 'AMD Ryzen Z1 Extreme, 7-inch 120Hz FHD, 24GB LPDDR5X, 1TB SSD, 80Wh battery, Windows 11.',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'PlayStation 5 Digital Edition Slim',
    description: 'Slim design, 1TB SSD, 4K HDR gaming, DualSense controller included, disc drive sold separately.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Xbox Series S – 1TB Carbon Black',
    description: 'All-digital 1TB console, 1440p@120fps, Variable Refresh Rate, Quick Resume, smallest Xbox ever.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Analogue Pocket Retro Handheld',
    description: 'Plays Game Boy, Game Boy Color, and Game Boy Advance cartridges natively. 3.5-inch 615 PPI LCD, USB-C.',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'Lenovo Legion Go Handheld Console',
    description: '8.8-inch QHD+ 144Hz, AMD Ryzen Z1 Extreme, detachable controllers, FPS mode with built-in kickstand.',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80',
    category: 'Consoles',
  },
  {
    title: 'MSI Claw A1M Handheld Gaming PC',
    description: 'Intel Core Ultra 7, 7-inch FHD 120Hz IPS, 16GB LPDDR5, Thunderbolt 4, Windows 11 handheld.',
    price: 749.99,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80',
    category: 'Consoles',
  },
];

// Fallback high-quality Unsplash gaming images per category for generated products
const CATEGORY_IMAGES = {
  Peripherals: [
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
  ],
  Hardware: [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80',
  ],
  Displays: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500&q=80',
  ],
  Audio: [
    'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  ],
  Consoles: [
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&q=80',
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80',
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80',
  ],
};

const CATEGORIES = ['Peripherals', 'Hardware', 'Displays', 'Audio', 'Consoles'];

// Helper to generate a dynamic gaming product title matching categories
function generateProductTitle(category) {
  const brand = faker.company.name().split(' ')[0];
  const modelCode = faker.string.alphanumeric({ length: 4, casing: 'upper' });

  switch (category) {
    case 'Hardware':
      return `${brand} ${faker.helpers.arrayElement(['RTX', 'RX', 'Core i9', 'Ryzen 7'])} ${modelCode} Ultra Component`;
    case 'Displays':
      return `${brand} ${faker.number.int({ min: 24, max: 49 })}" ${faker.helpers.arrayElement(['4K', 'QHD', 'OLED'])} ${faker.number.int({ min: 144, max: 360 })}Hz Gaming Monitor`;
    case 'Audio':
      return `${brand} ${faker.helpers.arrayElement(['Pro', 'Apex', 'Cloud', 'Nova'])} ${modelCode} Wireless Headset`;
    case 'Consoles':
      return `${brand} Gaming Station ${modelCode} ${faker.helpers.arrayElement(['Pro', 'Slim', 'Edition'])}`;
    case 'Peripherals':
    default:
      return `${brand} ${faker.helpers.arrayElement(['Pro', 'Elite', 'Chroma'])} ${faker.helpers.arrayElement(['Keyboard', 'Mouse', 'Controller', 'Webcam'])}`;
  }
}

// Generate rest of the products up to target limit
function generateMockProducts(targetTotal, existingArray) {
  const generated = [];
  const needed = targetTotal - existingArray.length;

  for (let i = 0; i < needed; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES);
    const categoryImage = faker.helpers.arrayElement(CATEGORY_IMAGES[category]);

    generated.push({
      title: generateProductTitle(category),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 15, max: 1500, dec: 2 })),
      image: categoryImage,
      category: category,
    });
  }

  return [...existingArray, ...generated];
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log(' Cleared existing products');

    // Combine 50 initial products with 9,950 generated ones
    const TOTAL_TARGET = 10000;
    const allProducts = generateMockProducts(TOTAL_TARGET, initialProducts);

    console.log(` Generating & inserting ${allProducts.length} products in batches...`);

    // Insert in batches of 1,000 for high efficiency
    const BATCH_SIZE = 1000;
    for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
      const batch = allProducts.slice(i, i + BATCH_SIZE);
      await Product.insertMany(batch);
      console.log(`   Inserted ${Math.min(i + BATCH_SIZE, allProducts.length)} / ${allProducts.length} products...`);
    }

    console.log(`🌱 Seeded total ${allProducts.length} products successfully!\n`);

    // Print summary by category
    for (const cat of CATEGORIES) {
      const count = await Product.countDocuments({ category: cat });
      console.log(`    ${cat}: ${count} products`);
    }

    // Create a default admin user if one doesn't exist
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: 'admin@gaminghub.com',
        password: 'admin123',
        role: 'admin',
        active: true,
        walletBalance: 99999,
      });
      console.log('\n Created default admin user:');
      console.log('   Email: admin@gaminghub.com');
      console.log('   Password: admin123');
    } else {
      console.log('\n Admin user already exists');
    }

    console.log('\n Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();