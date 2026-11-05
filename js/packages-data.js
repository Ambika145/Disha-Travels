/* Disha Travel Services — Travel packages from client itineraries.
   Sources (Nov 2026): Europe PDF, Egypt / South Africa / Vietnam DOCX.
   More domestic & international packages will be added as itineraries arrive.
   Price notes: figures are starting rates in USD per person as quoted; final INR
   quotes, GST/TCS and high-season surcharges are confirmed at enquiry. */
window.DISHA_PKGS = (function () {
  'use strict';

  var regions = [
    { id: 'europe', name: 'Europe & the UK' },
    { id: 'africa', name: 'Africa' },
    { id: 'se-asia', name: 'South East Asia' }
  ];

  /* the filter offers the same four trip types as Destinations, plus food */
  var types = [
    ['hm', 'Couples'],
    ['fam', 'Family'],
    ['sen', 'Senior citizens'],
    ['grp', 'Friends']
  ];

  var lengths = [
    ['s', 'Up to 5 nights', 0, 5],
    ['m', '6–8 nights', 6, 8],
    ['l', '9–11 nights', 9, 11],
    ['xl', '12+ nights', 12, 99]
  ];

  var list = [
    {
      id: 'europe-paris-amsterdam-london',
      name: 'Paris · Amsterdam · London',
      dest: 'Europe',
      destId: 'europe',
      r: 'europe',
      days: 12,
      nights: 11,
      dur: '12 Days / 11 Nights',
      price: null,
      priceNote: 'Price on enquiry',
      cities: 'Paris · Amsterdam · London',
      line: 'Three capitals, one classic first Europe holiday.',
      about: 'Discover the charm of Paris, the canals of Amsterdam, and the landmarks of London. A blend of sightseeing, leisure and countryside excursions across France, the Netherlands and the United Kingdom.',
      best: 'April – June · September – October',
      m: '4-6,9-10',
      t: ['fam', 'hm', 'grp', 'sen', 'cul'],
      img: 'assets/images/destinations/paris.jpg',
      alt: 'The Seine and the Eiffel Tower, Paris',
      highlights: [
        'Paris city tour, Louvre Museum and Seine River cruise',
        'Full-day Disneyland Paris excursion',
        'Amsterdam canal cruise and Zaanse Schans windmills',
        'London hop-on hop-off, Madame Tussauds and London Eye',
        'Windsor · Oxford · Stonehenge full-day excursion'
      ],
      daysPlan: [
        { d: 1, t: 'Arrival in Paris', s: 'Airport arrival, hotel check-in and leisure.' },
        { d: 2, t: 'Paris city tour', s: 'Panoramic tour, Louvre Museum and Seine River cruise.' },
        { d: 3, t: 'Disneyland Paris', s: 'Full-day theme-park excursion; return to Paris.' },
        { d: 4, t: 'Paris to Amsterdam', s: 'Train to Amsterdam; hotel check-in and leisure.' },
        { d: 5, t: 'Amsterdam experience', s: 'Canal cruise (~75 min) and Heineken Experience.' },
        { d: 6, t: 'Zaanse Schans', s: 'Traditional Dutch windmills, wooden houses and crafts.' },
        { d: 7, t: 'Amsterdam leisure', s: 'Free day; optional museums subject to booking.' },
        { d: 8, t: 'Amsterdam to London', s: 'Transfer to London; hotel check-in and leisure.' },
        { d: 9, t: 'London sightseeing', s: 'Hop-on hop-off bus, Madame Tussauds and London Eye.' },
        { d: 10, t: 'Windsor · Oxford · Stonehenge', s: 'Full-day countryside and heritage excursion.' },
        { d: 11, t: 'London at leisure', s: 'Independent exploration: museums, shopping or West End.' },
        { d: 12, t: 'Departure', s: 'Check-out and transfer for the flight to Hyderabad.' }
      ],
      source: '12 Days 11 Nights Europe Holiday Itinerary.pdf'
    },

    {
      id: 'egypt-cairo-nile-hurghada',
      name: 'Cairo · Nile Cruise · Hurghada',
      dest: 'Egypt',
      destId: 'egypt',
      r: 'africa',
      days: 9,
      nights: 8,
      dur: '9 Days / 8 Nights',
      price: 1799,
      priceNote: 'Starting from USD 1,799 pp (4★ basis)',
      cities: 'Cairo & Giza · Aswan–Luxor · Hurghada',
      line: 'Pyramids, a Nile cruise, and a Red Sea finish.',
      about: 'Nine days covering Cairo and Giza, a 5★ Nile cruise from Aswan to Luxor, and two nights all-inclusive in Hurghada. Built for two adults; other group sizes quoted on enquiry.',
      best: 'October – April',
      m: '10-4',
      t: ['fam', 'hm', 'grp', 'sen', 'cul', 'bch'],
      img: '',
      alt: 'The pyramids, the Nile and the Red Sea',
      highlights: [
        'Great Pyramids, Sphinx and Grand Egyptian Museum',
        'Alexandria day trip from Cairo',
        '3 nights 5★ Nile cruise, full board',
        'Kom Ombo, Edfu, Karnak, Luxor and Valley of the Kings',
        '2 nights Hurghada on all-inclusive'
      ],
      daysPlan: [
        { d: 1, t: 'Arrival in Cairo', s: 'Meet & assist; hotel check-in and briefing.' },
        { d: 2, t: 'Pyramids · Sphinx · GEM', s: 'Giza Necropolis and Grand Egyptian Museum; lunch included.' },
        { d: 3, t: 'Alexandria day trip', s: 'Catacombs, Pompey’s Pillar, Bibliotheca and Qaitbay Citadel.' },
        { d: 4, t: 'Fly to Aswan · cruise', s: 'Embark Nile cruise; High Dam, Philae Temple, Unfinished Obelisk.' },
        { d: 5, t: 'Kom Ombo · Edfu', s: 'Temple visits while sailing toward Luxor.' },
        { d: 6, t: 'Edfu · Karnak · Luxor', s: 'Temple of Horus, Karnak and Luxor Temple.' },
        { d: 7, t: 'West Bank · Hurghada', s: 'Valley of the Kings, Hatshepsut, Colossi; drive to Hurghada.' },
        { d: 8, t: 'Hurghada leisure', s: 'Resort day; optional diving or snorkelling.' },
        { d: 9, t: 'Departure', s: 'Transfer to Hurghada Airport (domestic link to Cairo as arranged).' }
      ],
      includes: [
        'Cairo 3N B&B · Nile cruise 3N full board · Hurghada 2N all-inclusive',
        'Domestic flights Cairo–Aswan and Hurghada–Cairo',
        'Guided sightseeing with entrance fees as listed',
        'AC transfers and English-speaking guide'
      ],
      excludes: ['GST & TCS', 'International flights', 'Egypt entry visa (~USD 40)', 'Travel insurance', 'Optional tours and tipping'],
      source: 'Egypt Package.docx'
    },

    {
      id: 'south-africa-11d',
      name: 'South Africa Safari & Coast',
      dest: 'South Africa',
      destId: 'south-africa',
      r: 'africa',
      days: 11,
      nights: 10,
      dur: '11 Days / 10 Nights',
      price: 1900,
      priceNote: 'Starting from USD 1,900 pp',
      cities: 'Pilanesberg · Mossel Bay · Knysna · Hermanus · Cape Town',
      line: 'Big Five game drives, Garden Route and Cape Town.',
      about: 'Safari at Pilanesberg, the Garden Route via Mossel Bay and Knysna, Hermanus, then Cape Town with peninsula highlights, Table Mountain, helicopter and sunset cruise.',
      best: 'May – September',
      m: '5-9',
      t: ['fam', 'hm', 'grp', 'safari', 'adv'],
      img: '',
      alt: 'South Africa safari and coastline',
      highlights: [
        'Pilanesberg game drives at Bakubung Bush Lodge',
        'Cango Caves, ostrich farm and wildlife ranch',
        'Knysna, Elephant Park and Garden Route scenery',
        'Full-day Cape Peninsula: Cape Point, penguins, Seal Island',
        'Table Mountain cable car, helicopter ride and sunset cruise'
      ],
      daysPlan: [
        { d: 1, t: 'Arrive · Pilanesberg', s: 'JNB arrival; lodge check-in; afternoon game drive.' },
        { d: 2, t: 'Pilanesberg safari', s: 'Morning and evening game drives; lodge stay.' },
        { d: 3, t: 'Fly to Garden Route', s: 'Morning drive; flight to George; Mossel Bay hotel.' },
        { d: 4, t: 'Oudtshoorn', s: 'Cango Caves, ostrich farm and wildlife ranch.' },
        { d: 5, t: 'Knysna', s: 'Knysna Heads, waterfront and Elephant Park.' },
        { d: 6, t: 'To Hermanus', s: 'Scenic Garden Route drive; overnight Hermanus.' },
        { d: 7, t: 'Cape Town', s: 'Transfer to Cape Town; leisure on arrival.' },
        { d: 8, t: 'Cape Peninsula', s: 'Maidens Cove, Seal Island, Cape Point, Boulders penguins.' },
        { d: 9, t: 'Table Mountain · city', s: 'Cable car, orientation tour, V&A or Canal Walk.' },
        { d: 10, t: 'Cape Town leisure', s: 'Free day; helicopter (~12 min) and sunset cruise included.' },
        { d: 11, t: 'Departure', s: 'Transfer to Cape Town International Airport.' }
      ],
      includes: [
        'Hotels / lodge as per itinerary (Cape Town hotel as arranged)',
        'Daily breakfast and 3 packed lunches',
        'Private point-to-point transport with English-speaking driver-guide',
        'Listed entrances, Table Mountain, Cape Point funicular, Seal Island, helicopter, sunset cruise',
        'Tourist visa assistance as quoted'
      ],
      excludes: ['GST & TCS', 'International & domestic flights (unless stated)', 'Most meals', 'Insurance', 'Tips and personal expenses'],
      source: 'South Africa Package.docx'
    },

    {
      id: 'vietnam-phu-quoc-5d',
      name: 'Phu Quoc Island Escape',
      dest: 'Vietnam',
      destId: 'vietnam',
      r: 'se-asia',
      days: 5,
      nights: 4,
      dur: '5 Days / 4 Nights',
      price: 695,
      priceNote: 'Starting from USD 695 pp',
      cities: 'Phu Quoc',
      line: 'Beaches, safari, VinWonders and the Hon Thom cable car.',
      about: 'A short Vietnam island holiday: Sunset Town, Kiss of the Sea show, Vinpearl Safari, Grand World, VinWonders, southern island-hopping and the over-sea cable car.',
      best: 'October – April',
      m: '10-4',
      t: ['fam', 'hm', 'grp', 'bch', 'adv'],
      img: 'assets/images/destinations/tropical-beach.jpg',
      alt: 'A tropical beach on Phu Quoc island',
      highlights: [
        'Sunset Town and Kiss of the Sea show',
        'Vinpearl Safari Phu Quoc',
        'Grand World with gondola boat',
        'VinWonders theme park',
        'Island hopping by speedboat and Hon Thom cable car'
      ],
      daysPlan: [
        { d: 1, t: 'Arrival · Sunset Town', s: 'Hotel check-in; Sunset Town and Kiss of the Sea show.' },
        { d: 2, t: 'Safari · Grand World', s: 'Vinpearl Safari and Grand World gondola experience.' },
        { d: 3, t: 'VinWonders', s: 'Full day at VinWonders Phu Quoc.' },
        { d: 4, t: 'Island hopping · cable car', s: 'Southern islets by speedboat; Hon Thom over-sea cable car.' },
        { d: 5, t: 'Departure', s: 'Hotel check-out and airport transfer.' }
      ],
      source: 'Vietnam Itenaries.docx · Option 01'
    },

    {
      id: 'vietnam-classic-10d',
      name: 'Vietnam Classic · Island to Highlands',
      dest: 'Vietnam',
      destId: 'vietnam',
      r: 'se-asia',
      days: 10,
      nights: 9,
      dur: '10 Days / 9 Nights',
      price: 990,
      priceNote: 'Starting from USD 990 pp (4★)',
      cities: 'Phu Quoc · Da Nang · Hoi An · Hanoi · Ha Long · Sapa',
      line: 'Phu Quoc, Ba Na Hills, Ha Long day cruise and Fansipan.',
      about: 'A fuller Vietnam circuit: three nights on Phu Quoc, Da Nang and Hoi An with Ba Na Hills and the Golden Bridge, Hanoi, a Ha Long day cruise, then Sapa with the glass bridge and Fansipan.',
      best: 'October – April',
      m: '10-4',
      t: ['fam', 'hm', 'grp', 'cul', 'adv', 'bch'],
      img: 'assets/images/destinations/vietnam-ha-long-bay.jpg',
      alt: 'Ha Long Bay, Vietnam',
      highlights: [
        'Phu Quoc: Grand World, island hopping, safari and VinWonders',
        'Hoi An ancient town and coconut village basket boat',
        'Ba Na Hills and Golden Bridge',
        'Ha Long Bay day cruise with kayaking',
        'Sapa glass bridge and Fansipan cable car'
      ],
      daysPlan: [
        { d: 1, t: 'Phu Quoc arrival', s: 'Grand World with Venice-style boat ride.' },
        { d: 2, t: 'Island hopping', s: 'Speedboat islets and Hon Thom cable car.' },
        { d: 3, t: 'Safari · VinWonders', s: 'Vinpearl Safari and VinWonders Phu Quoc.' },
        { d: 4, t: 'Fly to Da Nang', s: 'Coconut village basket boat and Hoi An lantern cruise.' },
        { d: 5, t: 'Ba Na Hills', s: 'Cable cars, Golden Bridge and Fantasy Park.' },
        { d: 6, t: 'Fly to Hanoi', s: 'Half-day Hanoi city tour; Old Quarter.' },
        { d: 7, t: 'Ha Long day cruise', s: 'Surprising Cave, Titop Island and Luon Cave kayaking.' },
        { d: 8, t: 'Transfer to Sapa', s: 'Drive to Sapa; Rong May Glass Bridge.' },
        { d: 9, t: 'Fansipan · Cat Cat', s: 'Fansipan cable car and Cat Cat village trek.' },
        { d: 10, t: 'Departure', s: 'Return to Hanoi airport for onward flight.' }
      ],
      source: 'Vietnam Itenaries.docx · Option 02'
    },

    {
      id: 'vietnam-danang-saigon-5d',
      name: 'Da Nang · Hoi An · Ho Chi Minh',
      dest: 'Vietnam',
      destId: 'vietnam',
      r: 'se-asia',
      days: 5,
      nights: 4,
      dur: '5 Days / 4 Nights',
      price: 500,
      priceNote: 'Starting from USD 500 pp',
      cities: 'Da Nang · Hoi An · Ho Chi Minh City · Mekong',
      line: 'Central Vietnam highlights plus Saigon and the Mekong, with pure veg Indian meals.',
      about: 'Compact private tour: Da Nang city and Son Tra, Marble Mountain, Hoi An, Ba Na Hills Golden Bridge, then Ho Chi Minh City and a Mekong Delta day. Lunch and dinner at pure veg Indian restaurants as listed.',
      best: 'October – April',
      m: '10-4',
      t: ['fam', 'hm', 'grp', 'veg', 'cul'],
      img: 'assets/images/destinations/vietnam.jpg',
      alt: 'Golden Bridge at Ba Na Hills, Vietnam',
      highlights: [
        'Da Nang city tour and Lady Buddha',
        'Marble Mountain, Hoi An and coconut village',
        'Ba Na Hills and Golden Bridge',
        'Mekong Delta boat day from Ho Chi Minh City',
        'Pure veg Indian restaurant meals as per programme'
      ],
      daysPlan: [
        { d: 1, t: 'Da Nang arrival · city', s: 'Dragon Bridge, Son Tra, Lady Buddha; veg Indian meals.' },
        { d: 2, t: 'Marble Mountain · Hoi An', s: 'Hoi An old town, basket boat and lantern boat ride.' },
        { d: 3, t: 'Ba Na Hills · fly HCMC', s: 'Golden Bridge and Fantasy Park; evening transfer to Ho Chi Minh.' },
        { d: 4, t: 'Mekong Delta', s: 'Boat ride, coconut candy and local fruit tasting.' },
        { d: 5, t: 'Departure', s: 'Hotel check-out and airport transfer.' }
      ],
      source: 'Vietnam Itenaries.docx · Option 03'
    }
  ];

  return { regions: regions, types: types, lengths: lengths, list: list };
})();
