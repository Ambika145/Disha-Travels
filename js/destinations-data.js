/* Disha Travel Services, Destinations content.
   Source of truth: disha-destinations-content-final.md. Copy is kept as
   written there (light typographic fixes only).

   Field key
     id      URL hash / slug          r     region id
     sp      Disha Specialist         line  tile line
     about   intro paragraph          does  "What you'll do"
     best    best time (display)      m     best months, e.g. "4-10" or "12-3,5-9"
     dur     ideal duration (display) n     [min, max] nights, for the trip-length filter
     good    "Good for"               also  extra note line
     worth   "Worth knowing"
     t       trip-type tags           a     activity tags
     veg     easy for vegetarians (only where the copy says so)
     img/alt photograph, only where it genuinely shows the place
   Tags are derived from each entry's own copy and are for the client to
   review, as the content document asks. */
window.DISHA_DEST = (function () {
  'use strict';

  var regions = [
    { id: 'se-asia', scope: 'intl', name: 'South East Asia', line: 'Short flights, long memories, and the best value in international travel.',
      pins: [[104, 12]], hero: { src: 'assets/images/destinations/thailand.jpg', cap: 'Railay Beach, Krabi · Thailand' } },
    { id: 'islands', scope: 'intl', name: 'Islands & the Indian Ocean', line: 'Where the itinerary is a beach, and the beach is the itinerary.',
      pins: [[67, -6]], hero: { src: 'assets/images/destinations/maldives.jpg', cap: 'The Maldives' } },
    { id: 'middle-east', scope: 'intl', name: 'The Middle East', line: 'Four hours from Hyderabad. A different world at the other end.',
      pins: [[48, 25]], hero: { src: 'assets/images/destinations/dubai-burj-khalifa.jpg', cap: 'Burj Khalifa · Dubai' } },
    { id: 'europe', scope: 'intl', name: 'Europe & the UK', line: 'The trip most people save up for. Worth every rupee of the saving.',
      pins: [[8, 48]], hero: { src: 'assets/images/destinations/switzerland.jpg', cap: 'Lauterbrunnen · Switzerland' } },
    { id: 'far-north', scope: 'intl', name: 'The Far North', line: 'Northern lights, midnight sun, and winters worth flying into.',
      pins: [[18, 66]] },
    { id: 'east-asia', scope: 'intl', name: 'East Asia', line: 'Bullet trains, cherry blossom, and cities that run like clockwork.',
      pins: [[124, 36]] },
    { id: 'central-asia', scope: 'intl', name: 'Central Asia & the Caucasus', line: 'The Silk Road: visa-light, short-haul, and startlingly good value.',
      pins: [[62, 42]] },
    { id: 'africa', scope: 'intl', name: 'Africa', line: 'Safari plains and pyramids: same continent, nothing alike.',
      pins: [[29, -6]] },
    { id: 'long-haul', scope: 'intl', name: 'The Long Haul', line: 'Fourteen hours in the air. Three weeks you’ll never stop describing.',
      pins: [[-98, 39], [150, -30]] },

    { id: 'himalayas', scope: 'india', name: 'The Himalayas & the North', line: 'Snow, switchbacks and monasteries above the cloud line.' },
    { id: 'west', scope: 'india', name: 'Rajasthan & the West', line: 'Forts, desert, and a coastline that never takes itself seriously.' },
    { id: 'south', scope: 'india', name: 'The South', line: 'Backwaters, temple towns and the greenest weeks of the year.' },
    { id: 'east-ne', scope: 'india', name: 'The East & North East', line: 'India’s least-crowded corner, and its most surprising.' },
    { id: 'india-islands', scope: 'india', name: 'The Islands', line: 'Two archipelagos, and the clearest water in the country.' },
    { id: 'around', scope: 'india', name: 'Around India', line: 'Nepal and Bhutan: no visa queue, no long-haul flight, all of the Himalayas.' }
  ];

  /* the hero's eleventh pin: everything in India & Around */
  var indiaPin = { id: 'india', name: 'India & Around', line: 'Closer to home, and no less worth the trip.', pins: [[79, 22]] };

  /* the four trip types offered in the filter */
  var types = [['hm', 'Couples'], ['fam', 'Family'], ['sen', 'Senior citizens'], ['grp', 'Friends']];
  var acts = [
    ['beach', 'Beaches & lagoons'], ['snork', 'Snorkelling & diving'], ['safari', 'Safari & wildlife'],
    ['snow', 'Snow & mountains'], ['aurora', 'Northern lights'], ['trek', 'Trekking & hiking'],
    ['temple', 'Temples & monasteries'], ['heritage', 'Forts, palaces & heritage'], ['boat', 'Boat & cruise days'],
    ['rail', 'Scenic rail journeys'], ['theme', 'Theme parks'], ['desert', 'Desert experiences'],
    ['houseboat', 'Houseboats'], ['balloon', 'Hot-air balloons'], ['market', 'Markets & shopping'],
    ['city', 'City sightseeing']
  ];
  var lengths = [['s', 'Up to 4 nights', 0, 4], ['m', '5–7 nights', 5, 7], ['l', '8–10 nights', 8, 10], ['xl', '11+ nights', 11, 99]];

  var d = [
    /* ---------------- SOUTH EAST ASIA ---------------- */
    { id: 'bali', name: 'Bali', r: 'se-asia', sp: true,
      line: 'Rice terraces at sunrise, a villa with nobody else in it.',
      about: 'Bali does two things at once and does both well. There is the Bali of Seminyak beach clubs and infinity pools over the Ayung gorge, and there is the Bali of 5am walks through the Tegallalang terraces before the tour buses arrive, of Balinese offerings left on doorsteps, of a boat to Nusa Penida where the cliffs drop straight into water the colour of bottle glass. Most first-timers try to do both and end up rushing. We’d rather you split the island properly: a few nights in Ubud among the paddies, a few on the coast.',
      does: ['Sunrise trek up Mount Batur, breakfast cooked in volcanic steam at the summit', 'Tegallalang and Jatiluwih rice terraces, early enough to have them to yourself', 'Uluwatu clifftop temple at dusk, with the kecak fire dance after', 'Snorkelling or diving off Nusa Penida and Nusa Lembongan', 'A Balinese cooking class, starting at the morning market'],
      best: 'April – October', m: '4-10', dur: '5–7 nights', n: [5, 7],
      good: 'Honeymooners, couples, first-time international travellers, families with older children',
      worth: 'Ubud and the south coast are about ninety minutes apart. Split your nights between them, so you aren’t in a car every morning.',
      t: ['hm', 'fam', 'bch', 'adv', 'cul'], a: ['trek', 'temple', 'snork', 'beach', 'market'],
      img: 'assets/images/destinations/bali.jpg', alt: 'Rice terraces in Bali' },

    { id: 'vietnam', name: 'Vietnam', r: 'se-asia', sp: true,
      line: 'Limestone bays, lantern-lit lanes, and a coastline that keeps going.',
      about: 'Three of our six five-star traveller reviews are Vietnam trips, which tells you something. It’s the trip our travellers come back most animated about. The country runs 1,600 kilometres north to south and changes completely along the way: Hanoi’s old quarter and the karst islands of Ha Long in the north, Hoi An’s tailors and lantern-lit river in the centre, the Mekong Delta and Ho Chi Minh City’s traffic in the south. Fifteen days does it justice. Seven does the north.',
      does: ['Overnight cruise through Ha Long or the quieter Lan Ha Bay', 'Hoi An old town after dark, when the lanterns come on and the traffic stops', 'Hue’s imperial citadel and the tombs along the Perfume River', 'Cu Chi tunnels and the War Remnants Museum outside Ho Chi Minh City', 'Sapa’s terraced valleys, if you have the extra days for the north'],
      best: 'October – April', m: '10-4', dur: '7–15 nights', n: [7, 15],
      good: 'Families, groups of friends, culture-first travellers, anyone wanting long-haul value',
      worth: 'Fish sauce goes into dishes that look entirely vegetable. Vegetarian routes lean on Buddhist <em>chay</em> kitchens, where there’s none in the building, and every hotel gets the brief in writing.',
      t: ['fam', 'grp', 'cul'], a: ['boat', 'heritage', 'city'],
      img: 'assets/images/destinations/vietnam-ha-long-bay.jpg', alt: 'Limestone islands in Ha Long Bay, Vietnam' },

    { id: 'thailand', name: 'Thailand', r: 'se-asia',
      line: 'Temples by morning, a longtail boat by afternoon, a night market by dark.',
      about: 'Thailand is the short international trip that suits almost everyone: families, honeymooners and a group of friends each find their own version. The mistake is the classic Bangkok–Pattaya–Phuket triangle squeezed into five nights. Give Bangkok two nights for the Grand Palace, Wat Arun and a floating market. Then pick one coast: Pattaya for an easy family trip, Phuket or Krabi for the limestone islands and the clearer water.',
      does: ['The Grand Palace and Wat Pho, early, before the heat and the crowds', 'A floating market at Damnoen Saduak by long-tail boat', 'Phi Phi or James Bond Island by speedboat', 'Railay Beach in Krabi, reached only by boat', 'A night market with a vegetarian stall list we’ve already vetted'],
      best: 'November – March', m: '11-3', dur: '5–7 nights', n: [5, 7],
      good: 'Friends, couples, families, budget-conscious first trips',
      worth: 'Thai kitchens reach for fish sauce and shrimp paste by reflex. Vegetarian (<em>jay</em>) restaurants, marked by yellow flags, are the safe bet, and we build meals around them.',
      t: ['grp', 'hm', 'fam', 'bch'], a: ['temple', 'boat', 'beach', 'market', 'city'],
      img: 'assets/images/destinations/thailand.jpg', alt: 'A long-tail boat at Railay Beach, Krabi' },

    { id: 'singapore', name: 'Singapore', r: 'se-asia', veg: true,
      line: 'A city you can cross in an afternoon and still not finish.',
      about: 'Singapore is the easiest international trip an Indian family can take: four and a half hours, no language barrier, and everything works. It’s also the one most people under-plan, treating it as two nights bolted onto Malaysia. Give it four and you get Gardens by the Bay at the light show, hawker centres where a Michelin-starred stall costs less than a coffee, Pulau Ubin’s rubber plantations, and the Night Safari, which is the best zoo experience in Asia by a distance.',
      does: ['Gardens by the Bay and the Cloud Forest dome, timed for the 7.45pm Garden Rhapsody', 'Hawker dinners at Lau Pa Sat, Maxwell or Old Airport Road', 'Universal Studios and S.E.A. Aquarium on Sentosa', 'Night Safari and River Wonders', 'Little India and Kampong Glam on foot, early morning'],
      best: 'Year-round · driest February – April', m: '1-12', dur: '3–4 nights', n: [3, 4],
      good: 'Families with children, first-time international travellers, short-break travellers',
      worth: 'The easiest vegetarian eating abroad, with Little India a short ride from anywhere. The risk here is over-scheduling, not under-feeding: Sentosa and Universal Studios are a full day each.',
      t: ['fam', 'short'], a: ['theme', 'city', 'market'] },

    { id: 'malaysia', name: 'Malaysia', r: 'se-asia', veg: true,
      line: 'Skyscrapers, rainforest and islands, within a day of each other.',
      about: 'Malaysia usually gets paired with Singapore, and the pairing works, but Malaysia carries a longer trip on its own. Kuala Lumpur for the towers and the street food, the Cameron Highlands for tea estates and cool air, Penang for what is arguably the best food in South East Asia, and Langkawi when you want the sea. It’s also the most comfortable destination on this list for vegetarian travellers, which matters more than most itineraries admit.',
      does: ['Petronas Towers skybridge and the Batu Caves at the edge of the city', 'Penang’s George Town: street art, clan jetties, and a hawker dinner on Chulia Street', 'Cameron Highlands tea estates and strawberry farms', 'Langkawi island-hopping and the SkyCab cable car', 'Taman Negara rainforest canopy walk, for the extra days'],
      best: 'Year-round · driest February – April', m: '1-12', dur: '5–6 nights', n: [5, 6],
      good: 'Families, pure veg groups, first-time international travellers',
      worth: 'Penang is where the food is. Kuala Lumpur is where the flights are. Give Penang at least two nights, or you’ve only seen the airport city.',
      t: ['fam', 'grp', 'bch'], a: ['city', 'temple', 'beach', 'market'] },

    { id: 'cambodia', name: 'Cambodia', r: 'se-asia',
      line: 'A thousand temples, and one sunrise everybody plans a trip around.',
      about: 'Most people come to Cambodia for Angkor and leave surprised by how much else there was. Angkor Wat at sunrise deserves its reputation, but Ta Prohm with the strangler figs growing through the stonework and Bayon’s face-towers are what tend to stay with people. Phnom Penh is a harder, more necessary day: the Killing Fields and Tuol Sleng are difficult and we’ll tell you honestly whether they’re right for your group. Usually paired with Vietnam.',
      does: ['Angkor Wat at sunrise, then Bayon and Ta Prohm before the heat', 'Banteay Srei’s pink sandstone carving, an hour out of Siem Reap', 'Tonlé Sap floating villages by boat', 'Phnom Penh’s Royal Palace and Silver Pagoda', 'Old Market and Pub Street in Siem Reap after dark'],
      best: 'November – March', m: '11-3', dur: '4–5 nights, or paired with Vietnam', n: [4, 5],
      good: 'Culture-first travellers, couples, photographers',
      worth: 'Angkor is best at 5am and hardest at noon, when the stone holds the heat. We start early and have you back at the hotel by lunch, which matters if grandparents are coming.',
      t: ['cul', 'hm'], a: ['temple', 'heritage', 'boat', 'market'] },

    { id: 'philippines', name: 'Philippines', r: 'se-asia',
      line: 'Seven thousand islands, and you only need two of them.',
      about: 'The Philippines is the least-travelled destination on this list from Hyderabad and the one with the best beaches on it. Palawan (El Nido and Coron) has limestone lagoons that people compare to Ha Long Bay and then admit are better. Bohol has the Chocolate Hills and tarsiers. Boracay’s White Beach is genuinely the finest stretch of sand in Asia. It takes a connection to get there and it is worth the connection.',
      does: ['El Nido island-hopping: Big Lagoon, Secret Lagoon, Snake Island sandbar', 'Wreck diving or snorkelling over the Japanese fleet at Coron', 'Chocolate Hills and the Loboc River in Bohol', 'White Beach sunset sailing at Boracay', 'Underground River at Puerto Princesa'],
      best: 'November – April', m: '11-4', dur: '6–8 nights', n: [6, 8],
      good: 'Couples, honeymooners, divers, travellers who’ve already done the obvious',
      worth: 'The islands are joined by small flights and boats, and weather can cancel a boat. We leave a spare day before your flight home. That’s cheaper than a missed connection.',
      t: ['hm', 'bch', 'adv'], a: ['beach', 'snork', 'boat'] },

    /* ---------------- ISLANDS & THE INDIAN OCEAN ---------------- */
    { id: 'maldives', name: 'Maldives', r: 'islands', sp: true,
      line: 'Where the floor of your room is the sea.',
      about: 'The Maldives is the shortest flight to the biggest change of scene available from India: under four hours, and you’re on an atoll where the only sound is water. The real decision isn’t which island, it’s which board basis and which transfer. A seaplane at sunset is a memory in itself; a speedboat costs a third as much. Overwater villas photograph better; beach villas with a pool are often the better stay. We’ll tell you which resorts actually deliver and which are coasting on a name.',
      does: ['Snorkel the house reef straight off your deck', 'Swim with whale sharks or manta rays at South Ari Atoll', 'Sunset dolphin cruise', 'A sandbank dinner with nobody else on it', 'Sunrise seaplane transfer, if the budget allows it'],
      best: 'November – April', m: '11-4', dur: '4–5 nights', n: [4, 5],
      good: 'Honeymooners, couples, anniversary trips, families wanting one resort and no packing',
      worth: 'The resort decides everything. Arriving by speedboat or by seaplane moves the price more than the room category does, so we show you both before you choose.',
      t: ['hm', 'fam', 'bch'], a: ['beach', 'snork', 'boat'],
      img: 'assets/images/destinations/maldives.jpg', alt: 'Overwater villas in the Maldives' },

    { id: 'sri-lanka', name: 'Sri Lanka', r: 'islands', veg: true,
      line: 'Tea country, temple towns and leopards, in a country you can drive across.',
      about: 'Sri Lanka packs more variety into a small island than anywhere else on this list. In a week you get the cultural triangle at Sigiriya and Dambulla, the hill country around Nuwara Eliya reached on the Kandy train, which is a genuine highlight and not just a transfer, Yala for leopards, and the south coast for beaches. The driving distances are short. The food is excellent and vegetarian-friendly. It’s the trip we recommend most often to people who say they want “somewhere different but not difficult”.',
      does: ['Climb Sigiriya rock fortress early, before the heat', 'The Kandy to Ella train through the tea estates', 'Temple of the Tooth in Kandy at evening puja', 'Yala or Wilpattu safari for leopard and elephant', 'Galle Fort at sunset, and the stilt fishermen at Koggala'],
      best: 'December – March (west & south) · May – September (east)', m: '12-3,5-9', dur: '6–8 nights', n: [6, 8],
      good: 'Families, couples, first-time long-drive travellers, wildlife interest',
      worth: 'Short drives and food that vegetarians find easy. It’s the trip we suggest when grandparents are coming. The two coasts have opposite monsoons, so the month decides which side you stay on.',
      t: ['fam', 'hm', 'wild', 'sen', 'cul'], a: ['heritage', 'rail', 'temple', 'safari', 'beach'],
      img: 'assets/images/destinations/sri-lanka-ella-train.jpg', alt: 'A blue train crossing the Nine Arches Bridge near Ella' },

    { id: 'mauritius', name: 'Mauritius', r: 'islands', veg: true,
      line: 'A volcano in the middle, sugarcane all around, reef the whole way out.',
      about: 'Mauritius is what people choose when the Maldives feels too still. There’s an actual island to explore: Black River Gorges, the seven-coloured earths at Chamarel, Port Louis market, a botanical garden with lily pads you could sit on, and the resorts sit on lagoons protected by one of the longest continuous reefs anywhere. It also happens to have the largest Indian-origin population outside India, which means the food is familiar in the best way and pure vegetarian is never a negotiation.',
      does: ['Chamarel’s seven-coloured earths and waterfall', 'Île aux Cerfs by catamaran, with lunch on board', 'Black River Gorges walk and the Grand Bassin sacred lake', 'Port Louis central market and the Aapravasi Ghat', 'Underwater sea walk or a submarine descent at Trou aux Biches'],
      best: 'April – June · September – December', m: '4-6,9-12', dur: '6–7 nights', n: [6, 7],
      good: 'Honeymooners, families, pure veg travellers, multi-generation groups',
      worth: 'June to August is winter there: cooler, and windier on the east coast. For lagoon days, go in the shoulder months.',
      t: ['hm', 'fam', 'sen', 'bch'], a: ['beach', 'boat', 'snork', 'market'] },

    { id: 'seychelles', name: 'Seychelles', r: 'islands',
      line: 'Granite boulders, no crowds, and the sea an unreasonable colour.',
      about: 'Seychelles is the quietest of the four and the most striking to look at. The granite boulders at Anse Source d’Argent on La Digue are the most photographed beach in the world and still somehow not busy. Praslin’s Vallée de Mai has coco de mer palms found nowhere else on earth. It costs more than Mauritius and it is a different kind of trip: less resort, more island. Three islands in a week, moving by ferry, is the way to do it.',
      does: ['Anse Source d’Argent on La Digue, reached by bicycle', 'Vallée de Mai on Praslin, a UNESCO site of prehistoric palm forest', 'Anse Lazio and Anse Georgette beaches', 'Giant tortoises on Curieuse Island', 'Morne Seychellois hike above Victoria on Mahé'],
      best: 'April – May · October – November', m: '4-5,10-11', dur: '6–7 nights', n: [6, 7],
      good: 'Honeymooners, couples, photographers, travellers who want quiet over facilities',
      worth: 'Indian vegetarian food is thinner on the ground here than in Mauritius. We arrange meals with each resort before you land, not after.',
      t: ['hm', 'bch', 'wild'], a: ['beach', 'trek'] },

    /* ---------------- THE MIDDLE EAST ---------------- */
    { id: 'dubai', name: 'Dubai', r: 'middle-east', sp: true,
      line: 'Desert one evening, skyline the next.',
      about: 'Dubai is the most reliable family trip in international travel: short flight, no jet lag, everything indoors and air-conditioned when it needs to be, and enough on the itinerary that nobody in a group of nine is bored. It’s also a city that rewards going slightly off-script: the abra across Dubai Creek for one dirham, the gold and spice souks in Deira, Al Fahidi’s wind-tower houses. One of our travellers celebrated a birthday on a decorated yacht here and still leads with that when she describes the trip.',
      does: ['Burj Khalifa observation deck, booked for sunset', 'Desert safari with dune bashing, camel ride and a Bedouin-camp dinner', 'Dubai Frame, Miracle Garden and Global Village in season', 'Abra across the Creek to the gold and spice souks', 'Day trip to Abu Dhabi for the Sheikh Zayed Grand Mosque and Ferrari World'],
      best: 'November – March', m: '11-3', dur: '4–5 nights', n: [4, 5],
      good: 'Families, large groups, first-time international travellers, short breaks',
      worth: 'The desert-camp dinner defaults to a grill. We arrange a vegetarian spread before you arrive, so no one is left at the salad counter.',
      t: ['fam', 'grp', 'short'], a: ['desert', 'city', 'theme', 'market', 'boat'],
      img: 'assets/images/destinations/dubai-burj-khalifa.jpg', alt: 'The Burj Khalifa above the Dubai skyline' },

    { id: 'oman', name: 'Oman', r: 'middle-east',
      line: 'The Gulf before the skyscrapers: wadis, forts and empty sand.',
      about: 'Oman is what people book when they’ve done Dubai and want the landscape instead of the mall. Wadi Shab is a swim through a canyon to a waterfall inside a cave. The Wahiba Sands are proper dunes with camps that switch the generator off so you can see the stars. Nizwa’s fort and its Friday goat market are the real thing, not a reconstruction. Muscat itself is low-rise, white, and quietly one of the most attractive cities in the region.',
      does: ['Wadi Shab and Wadi Bani Khalid: swim, don’t just photograph', 'A night under canvas in the Wahiba Sands', 'Nizwa Fort and the Friday livestock souk', 'Sultan Qaboos Grand Mosque in Muscat', 'Turtle watching at Ras al Jinz, in season'],
      best: 'November – March', m: '11-3', dur: '5–6 nights', n: [5, 6],
      good: 'Couples, photographers, adventure travellers, families with teenagers',
      worth: 'Muscat, Nizwa and the Wahiba Sands are long drives apart, and real heat outside November to March. We keep it to one or two bases, not a new hotel every night.',
      t: ['hm', 'adv', 'fam'], a: ['desert', 'heritage', 'market'] },

    { id: 'saudi-arabia', name: 'Saudi Arabia', r: 'middle-east',
      line: 'A country that spent decades closed, now open and startling.',
      about: 'Saudi only opened to leisure travel recently, and AlUla is the reason to go. Hegra is a Nabataean city carved into sandstone: the same civilisation as Petra, a fraction of the visitors. Elephant Rock at sunset, the old mudbrick town of AlUla, the Edge of the World escarpment outside Riyadh. We also arrange Umrah and pilgrimage travel to Makkah and Madinah, which is a different service with different documentation, and we handle both.',
      does: ['Hegra’s carved tombs at AlUla, with a licensed rawi guide', 'Elephant Rock and Maraya, the mirrored concert hall in the desert', 'AlUla old town and the oasis walk', 'Edge of the World day trip from Riyadh', 'Diriyah, the restored first Saudi capital'],
      best: 'November – March', m: '11-3', dur: '5–7 nights', n: [5, 7],
      good: 'Cultural travellers, photographers', also: 'Umrah and pilgrimage travel arranged separately',
      worth: 'Dress codes and prayer-time closures shape the day, so we plan around them rather than into them. Umrah is a separate process with its own paperwork.',
      t: ['cul', 'pil'], a: ['heritage', 'desert'] },

    /* ---------------- EUROPE & THE UK ---------------- */
    { id: 'europe', name: 'Europe', note: 'multi-country', r: 'europe',
      line: 'Everything you’ve seen a thousand times, and none of it prepares you.',
      about: 'The classic first Europe trip runs Paris, Switzerland and Italy in about twelve days, and there is a reason it’s classic: it works. Paris for the obvious, and for the fact that the Eiffel Tower at night still stops people mid-sentence. Switzerland for Jungfraujoch, Interlaken and the train ride that is itself the attraction. Italy for Rome, Venice and Florence. We build it as a rail itinerary wherever we can: European trains put you in city centres, not airports, and the journeys are half the experience. Schengen visas are filed and tracked in-house.',
      does: ['Eiffel Tower and a Seine cruise; Louvre if you have the morning', 'Jungfraujoch, the Top of Europe, and the Glacier Express or GoldenPass line', 'Rome’s Colosseum, Vatican Museums and the Sistine Chapel', 'Venice by vaporetto, and Murano glassblowing', 'Swiss Alps paragliding at Interlaken, for the ones who want it'],
      best: 'May – September · December for the Christmas markets', m: '5-9,12', dur: '10–14 nights', n: [10, 14],
      good: 'Families, honeymooners, first Europe trips, multi-generation groups',
      worth: 'In summer the Schengen appointment is the real bottleneck, not the approval. We’ll tell you the week to start, and we won’t promise a slot, because nobody honestly can. Lunches on long coach days are booked ahead, so the group isn’t hunting for food at 2pm.',
      t: ['fam', 'hm', 'sen', 'cul'], a: ['city', 'snow', 'rail', 'boat', 'heritage'] },

    { id: 'paris', name: 'Paris', r: 'europe',
      line: 'The tower at night, the Seine by boat, and Montmartre before it wakes up.',
      about: 'Paris on its own is a different trip from Paris as two nights inside a twelve-day coach tour. You get the Louvre without rushing it, Versailles on a day that isn’t also a transfer day, a Seine cruise after dark, and Montmartre in the morning before it fills. Add Disneyland Paris if children are coming.',
      does: ['The Eiffel Tower summit, on a timed ticket booked in advance', 'A Seine cruise after dark', 'The Louvre and the Musée d’Orsay, one each, not both in a day', 'Versailles, the palace and the gardens, with a full day to spare', 'Disneyland Paris for families'],
      best: 'April – June · September – October', m: '4-6,9-10', dur: '4–5 nights', n: [4, 5],
      good: 'Honeymooners, families with children, anyone who has done Paris in a rush once',
      worth: 'Versailles and the Eiffel Tower summit run on timed tickets that sell out. We book them with your hotel, not on the morning, so nobody ends up waiting in the garden.',
      t: ['hm', 'fam', 'cul'], a: ['city', 'boat', 'theme', 'heritage'],
      img: 'assets/images/destinations/paris.jpg', alt: 'The Seine and the Eiffel Tower, Paris' },

    { id: 'switzerland', name: 'Switzerland', r: 'europe', sp: true,
      line: 'Lakes you can see the bottom of, and a train to the top of Europe.',
      about: 'More Indians apply for Swiss visas than for any other Schengen country, and it isn’t hard to see why. It works best slowly: Lucerne on its lake, Interlaken between two, Jungfraujoch by cog railway, and at least one panoramic train, the Glacier Express or the GoldenPass line, as a day in itself. On a Swiss Travel Pass, most trains, boats and city transport are covered.',
      does: ['Jungfraujoch, the highest railway station in Europe', 'Mount Titlis by rotating cable car, and the glacier cave at the top', 'A Lake Lucerne cruise and the Chapel Bridge', 'The Glacier Express or the GoldenPass panoramic line', 'Zermatt under the Matterhorn, for those with an extra night'],
      best: 'May – September · December for snow', m: '5-9,12', dur: '6–8 nights', n: [6, 8],
      good: 'Honeymooners, families, older travellers who prefer trains to coaches',
      worth: 'Swiss trips are priced by the rail pass as much as by the hotel. Your quote shows both, line by line.',
      t: ['hm', 'fam', 'sen'], a: ['snow', 'rail', 'boat'],
      img: 'assets/images/destinations/switzerland-alps.jpg', alt: 'Snow-capped peaks in the Swiss Alps' },

    { id: 'united-kingdom', name: 'United Kingdom', r: 'europe',
      line: 'Three countries, one small island, and a lot of weather.',
      about: 'The UK is a good trip and an underrated one from India. London is obvious and enormous. But it’s Edinburgh: the castle on its rock, the Royal Mile, a whisky distillery in the Highlands, and the Lake District and the Cotswolds that people come home talking about. Scotland by train is the best rail journey in Britain. Visas take time and rejection rates are unforgiving; we file these carefully and we’ll tell you honestly what your file looks like before you pay for anything.',
      does: ['Tower of London, Westminster and a West End show', 'Edinburgh Castle and the Royal Mile', 'Stonehenge and the Roman baths at Bath', 'Lake District: Windermere by boat', 'Warner Bros. Studio Tour, if there are children'],
      best: 'May – September', m: '5-9', dur: '7–9 nights', n: [7, 9],
      good: 'Families, culture travellers, visiting relatives',
      worth: 'The UK visa is a separate application from Schengen, and a demanding one. We’ll tell you frankly how your file reads before you pay a fee.',
      t: ['fam', 'cul'], a: ['city', 'heritage', 'boat', 'rail'] },

    { id: 'spain-portugal', name: 'Spain & Portugal', r: 'europe',
      line: 'Moorish palaces, Atlantic tiles, and dinner at ten at night.',
      about: 'Iberia is the Europe trip for people who’ve already done Paris and Rome. Granada’s Alhambra is the single most beautiful building most travellers will ever walk through. Barcelona has Gaudí, which photographs do not prepare you for. Seville in spring, with orange blossom in the streets. Then west into Portugal: Lisbon’s tiled hills and trams, Sintra’s painted palaces, Porto and the port lodges across the river. It’s warmer, cheaper and slower than northern Europe.',
      does: ['Alhambra and the Generalife gardens in Granada, booked months out', 'Sagrada Família and Park Güell in Barcelona', 'Seville’s Alcázar and a flamenco tablao', 'Sintra’s Pena Palace and the Quinta da Regaleira', 'Douro Valley wine terraces from Porto'],
      best: 'April – June · September – October', m: '4-6,9-10', dur: '9–11 nights', n: [9, 11],
      good: 'Couples, second-time Europe travellers, food and architecture interest',
      worth: 'Dinner in Spain starts around 9pm. When the group wants to eat at Indian hours, we book vegetarian tables that open earlier.',
      t: ['hm', 'cul'], a: ['heritage', 'city'] },

    { id: 'turkey', name: 'Turkey', r: 'europe', veg: true, cross: 'Cross-listed under The Middle East.',
      line: 'Two continents, one country, and a balloon ride at dawn.',
      about: 'Turkey is the best value in Europe and the most photogenic country on this list. Cappadocia at sunrise, with a hundred balloons rising over the fairy chimneys, is the shot everybody wants and it lives up to it. Istanbul straddles Europe and Asia: Hagia Sophia, the Blue Mosque, the Grand Bazaar, a Bosphorus ferry at dusk. Pamukkale’s white travertine terraces look computer-generated. The food is outstanding and vegetarians do well.',
      does: ['Hot-air balloon over Cappadocia at sunrise', 'Hagia Sophia, Blue Mosque, Topkapı Palace and the Basilica Cistern', 'Bosphorus cruise between the two continents', 'Pamukkale travertines and the ruins at Hierapolis', 'Ephesus, and the Library of Celsus'],
      best: 'April – June · September – November', m: '4-6,9-11', dur: '7–9 nights', n: [7, 9],
      good: 'Families, honeymooners, photographers, value-conscious Europe travellers',
      worth: 'Cappadocia’s balloon flights are weather-dependent and cancel often. We build in a spare morning, so one windy day doesn’t cost you the shot you came for.',
      t: ['fam', 'hm', 'cul'], a: ['balloon', 'heritage', 'boat', 'market', 'city'] },

    /* ---------------- THE FAR NORTH ---------------- */
    { id: 'iceland', name: 'Iceland', r: 'far-north',
      line: 'Fire, ice, and a road that loops around both.',
      about: 'Iceland is not a relaxing holiday and nobody who goes wants it to be. You drive, and every forty minutes something absurd appears: a waterfall you can walk behind, a black sand beach with basalt columns, a glacier lagoon with icebergs drifting to sea. In summer the light never fully goes. In winter you chase the aurora and soak in geothermal water while it snows on your head. It is expensive and it is unlike anywhere else.',
      does: ['Golden Circle: Þingvellir, Geysir, Gullfoss', 'Jökulsárlón glacier lagoon and the Diamond Beach', 'Seljalandsfoss and Skógafoss on the south coast', 'Blue Lagoon or the quieter Sky Lagoon', 'Northern lights hunting, September to March'],
      best: 'June – August (midnight sun) · September – March (aurora)', m: '6-8,9-3', dur: '6–8 nights', n: [6, 8],
      good: 'Couples, photographers, self-drive travellers, honeymooners wanting something unusual',
      worth: 'The aurora is never guaranteed, and anyone who promises it is selling something. We put you there on the nights with the best odds, somewhere dark enough to see it.',
      t: ['hm', 'adv', 'wild'], a: ['aurora', 'snow'] },

    { id: 'finland', name: 'Finland', r: 'far-north',
      line: 'Lapland in December: reindeer, husky sleds, and a glass roof to watch the sky through.',
      about: 'Finland in winter is the most complete family trip on this list and the one children remember for life. Rovaniemi is officially Santa’s hometown and leans into it entirely. You sleep in a glass igloo watching for the aurora, ride a husky sled through forest, meet reindeer herders, and cross the Arctic Circle. It is properly cold (minus twenty is normal), and every operator kits you out for it. Summer is a different country: lakes, midnight sun, and cabins.',
      does: ['Glass igloo or aurora cabin stay', 'Husky sledding and a reindeer sleigh ride', 'Santa Claus Village and the Arctic Circle crossing', 'Snowmobile safari and ice fishing', 'Finnish smoke sauna, then the ice hole, if you’re brave'],
      best: 'December – March (aurora & winter) · June – August (lakes & midnight sun)', m: '12-3,6-8', dur: '4–6 nights', n: [4, 6],
      good: 'Families with children, honeymooners, aurora hunters',
      worth: 'In December, Lapland gets only a few hours of daylight. That’s the point for aurora and Santa’s village, but plan the day around it. The aurora is never guaranteed.',
      t: ['fam', 'hm'], a: ['aurora', 'snow'] },

    { id: 'norway-sweden', name: 'Norway & Sweden', r: 'far-north',
      line: 'Fjords that go on for miles, and cities that know what to do with a winter.',
      about: 'Scandinavia’s draw is the fjord country: Geiranger, Nærøyfjord, the Flåm railway dropping through a thousand metres of mountainside. Bergen’s wooden wharf, Tromsø above the Arctic Circle for aurora and whales. Sweden adds Stockholm across fourteen islands, and the Icehotel at Jukkasjärvi, rebuilt from the river every winter. It’s a longer, costlier trip than Finland and a more scenic one. Best done as one itinerary rather than two.',
      does: ['Flåm Railway and a Nærøyfjord cruise', 'Geirangerfjord and the Trollstigen road', 'Bergen’s Bryggen wharf and the Fløibanen funicular', 'Tromsø for aurora, whale watching and the Arctic Cathedral', 'Stockholm’s Gamla Stan and the Vasa Museum'],
      best: 'June – August (fjords) · September – March (aurora)', m: '6-8,9-3', dur: '8–10 nights', n: [8, 10],
      good: 'Couples, photographers, second-time Europe travellers',
      worth: 'Among the most expensive countries in Europe, meals especially. Your quote shows food costs honestly, rather than leaving them for the trip.',
      t: ['hm', 'wild'], a: ['boat', 'rail', 'aurora', 'city'] },

    /* ---------------- EAST ASIA ---------------- */
    { id: 'japan', name: 'Japan', r: 'east-asia',
      line: 'A country that runs to the second, and still finds time for a thousand-year-old garden.',
      about: 'Japan is the most rewarding and most misunderstood destination on this list. It is not difficult: the trains are flawless, the signage is in English, and a Japan Rail Pass makes the whole country accessible. Tokyo is six cities pretending to be one. Kyoto has more temples than you can see in a month, and the bamboo grove at Arashiyama at 7am is worth the early start. Cherry blossom in late March is spectacular and books out a year ahead; autumn in November is nearly as good and far easier to arrange.',
      does: ['Senso-ji, Shibuya crossing and teamLab in Tokyo', 'Shinkansen to Kyoto: Fushimi Inari’s torii gates at dawn', 'Arashiyama bamboo grove and the Kinkaku-ji golden pavilion', 'Hiroshima Peace Memorial and the floating torii at Miyajima', 'Mount Fuji from Hakone, and an onsen afterwards'],
      best: 'March – April (blossom) · October – November (autumn)', m: '3-4,10-11', dur: '8–10 nights', n: [8, 10],
      good: 'Couples, culture travellers, families with teenagers, repeat international travellers',
      worth: 'Harder for vegetarians than it looks: fish stock (dashi) is in most broths. We plan every meal around it, with temple cooking in Kyoto as a highlight rather than a workaround.',
      t: ['hm', 'cul', 'fam'], a: ['temple', 'rail', 'city'] },

    { id: 'south-korea', name: 'South Korea', r: 'east-asia',
      line: 'Palaces, night markets, and a border you can stand on.',
      about: 'Korea has arrived as a destination on the back of its music and television, and the country underneath is better than the reason most people come. Seoul’s Gyeongbokgung palace with the guard-changing ceremony, Bukchon’s hanok lanes, Myeongdong after dark. The DMZ tour is genuinely sobering. Jeju Island for volcanic craters and waterfalls. Autumn foliage in November is as good as Japan’s and a third of the crowd.',
      does: ['Gyeongbokgung Palace and the changing of the guard', 'Bukchon Hanok Village and Insadong’s tea houses', 'DMZ and the Third Infiltration Tunnel', 'Nami Island and Petite France', 'Jeju’s Seongsan Ilchulbong crater at sunrise'],
      best: 'April – June · September – November', m: '4-6,9-11', dur: '6–7 nights', n: [6, 7],
      good: 'Young travellers, families with teenagers, culture and food interest',
      worth: 'Kimchi and many soups use fish sauce or anchovy stock. Seoul’s temple cuisine is the exception, and it’s worth a meal on its own.',
      t: ['fam', 'cul', 'grp'], a: ['heritage', 'market', 'city'] },

    { id: 'china', name: 'China', r: 'east-asia',
      line: 'Four thousand years, and a bullet train between all of it.',
      about: 'China is a scale you cannot picture until you’re standing in it. The Great Wall at Mutianyu rather than Badaling, because you can walk it without a queue. The Terracotta Army at Xi’an, eight thousand figures with individual faces. Shanghai’s Bund facing a skyline that didn’t exist thirty years ago. Guilin’s karst hills along the Li River. Visas are involved and we handle them; internal travel is by high-speed rail and it is superb.',
      does: ['Great Wall at Mutianyu, by cable car up and toboggan down', 'Forbidden City and Tiananmen Square', 'Terracotta Warriors and Xi’an’s city wall by bicycle', 'Li River cruise from Guilin to Yangshuo', 'The Bund and Yu Garden in Shanghai'],
      best: 'April – May · September – October', m: '4-5,9-10', dur: '8–10 nights', n: [8, 10],
      good: 'Culture travellers, history interest, groups',
      worth: 'Google, WhatsApp and most Indian cards don’t work there. We set you up with the right apps and payment options before you fly, not at the airport.',
      t: ['cul', 'grp'], a: ['heritage', 'boat', 'city'] },

    /* ---------------- CENTRAL ASIA & THE CAUCASUS ---------------- */
    { id: 'azerbaijan', name: 'Azerbaijan', place: 'Baku', r: 'central-asia',
      line: 'Flame towers over a walled old city, and mud volcanoes an hour out.',
      about: 'Baku is the short international break most Indian travellers haven’t thought of yet, and the ones who go are evangelical about it. A UNESCO-listed walled old city sits directly beneath three flame-shaped towers. An hour outside are the Gobustan petroglyphs and a field of bubbling mud volcanoes: Azerbaijan has more of them than anywhere on earth. Visa is straightforward, the flight is short, and it costs a fraction of Europe.',
      does: ['Icherisheher, the walled old city, and the Maiden Tower', 'Flame Towers and Highland Park at night', 'Gobustan rock art and the mud volcanoes', 'Ateshgah fire temple and Yanar Dag, the burning hillside', 'Day trip to Gabala or Shahdag in the mountains'],
      best: 'April – June · September – October', m: '4-6,9-10', dur: '4–5 nights', n: [4, 5],
      good: 'Short international breaks, couples, first-time travellers, value seekers',
      worth: 'Four nights is enough: longer and you start repeating. If you want more, pair it with Georgia.',
      t: ['short', 'hm'], a: ['heritage', 'city'] },

    { id: 'kazakhstan', name: 'Kazakhstan', place: 'Almaty', r: 'central-asia',
      line: 'Mountains at the end of every street, and a lake the colour of turquoise.',
      about: 'Almaty sits against the Tian Shan mountains, and you can be on a ski slope or at a mountain lake within an hour of the city centre. Big Almaty Lake is an improbable turquoise at 2,500 metres. Charyn Canyon is a smaller, emptier Grand Canyon. Kolsai and Kaindy (the sunken forest, with spruce trunks still standing underwater) are a full day out and worth it. Visa-free for Indian nationals on short stays, which makes it one of the cheapest international trips available.',
      does: ['Big Almaty Lake and the Kok-Tobe cable car', 'Charyn Canyon’s Valley of Castles', 'Kolsai Lakes and the sunken forest at Kaindy', 'Shymbulak ski resort and Medeu skating rink', 'Green Bazaar and the Zenkov Cathedral'],
      best: 'April – June · September – October', m: '4-6,9-10', dur: '4–5 nights', n: [4, 5],
      good: 'Adventure travellers, photographers, short breaks, budget-conscious international trips',
      worth: 'Charyn Canyon and the Kolsai lakes are long day-drives from the city. We split them across days, so no one spends two days in a row mostly in a car.',
      t: ['adv', 'short', 'wild'], a: ['snow', 'market', 'city'] },

    { id: 'uzbekistan', name: 'Uzbekistan', place: 'Tashkent', r: 'central-asia',
      line: 'Samarkand and Bukhara: the Silk Road, still standing.',
      about: 'Uzbekistan is the Silk Road proper. Samarkand’s Registan Square, three madrasas facing each other in blue tilework, is one of the great sights of the world and almost nobody from India has seen it. Bukhara is a living medieval town. Khiva is a walled city you can circle in an afternoon. It’s visa-free, cheap, deeply hospitable, and the food is meat-heavy; we brief vegetarian travellers carefully and arrange accordingly.',
      does: ['The Registan at Samarkand, floodlit after dark', 'Shah-i-Zinda necropolis and the Bibi-Khanym mosque', 'Bukhara’s Poi Kalyan complex and the trading domes', 'Khiva’s walled Itchan Kala', 'Chorsu Bazaar in Tashkent'],
      best: 'April – June · September – October', m: '4-6,9-10', dur: '6–7 nights', n: [6, 7],
      good: 'Culture and history travellers, photographers, groups',
      worth: 'The food is meat-heavy, so vegetarian travellers need a careful brief, and we write one. The fast train to Samarkand and Bukhara sells out, so we book it with your flights.',
      t: ['cul', 'grp'], a: ['heritage', 'market'] },

    { id: 'georgia', name: 'Georgia', r: 'central-asia',
      line: 'Caucasus peaks, cave cities, and eight thousand years of winemaking.',
      about: 'Georgia is the one travellers come back most surprised by. Tbilisi’s old town is sulphur baths and balconied houses under a hilltop fortress. Kazbegi’s Gergeti Trinity Church stands alone on a ridge with a 5,000-metre peak behind it. Uplistsikhe is a city carved into rock. Kakheti has been making wine in clay qvevri for eight thousand years. Visa-free, short flight, and the most generous hospitality on this list.',
      does: ['Tbilisi old town, the sulphur baths and Narikala fortress', 'Gergeti Trinity Church at Kazbegi, up the Georgian Military Highway', 'Uplistsikhe cave city and Mtskheta’s Jvari monastery', 'Kakheti wine route and a supra feast', 'Cable car to Chiatura or the Prometheus caves'],
      best: 'May – June · September – October', m: '5-6,9-10', dur: '5–6 nights', n: [5, 6],
      good: 'Couples, food and wine interest, adventure travellers, value seekers',
      worth: 'The mountain road to Kazbegi slows or closes in winter. May–June and September–October are the reliable windows.',
      t: ['hm', 'adv'], a: ['heritage', 'snow', 'city', 'temple'] },

    /* ---------------- AFRICA ---------------- */
    { id: 'south-africa', name: 'South Africa', r: 'africa', sp: true,
      line: 'A safari and a coastline, in one country, in one trip.',
      about: 'South Africa does something no other destination manages: Big Five game viewing and a world-class coastal city in the same ten days. Kruger or a private reserve for the safari, then Cape Town: Table Mountain, the Cape peninsula drive to the Cape of Good Hope, penguins at Boulders Beach, the winelands at Stellenbosch. One of our travellers honeymooned here and it’s a good instinct: it’s romantic, dramatic, and easier to arrange than East Africa.',
      does: ['Big Five game drives at Kruger or a private reserve', 'Table Mountain cable car and Cape Point', 'Boulders Beach penguins and Chapman’s Peak drive', 'Stellenbosch and Franschhoek winelands', 'Robben Island, and the Garden Route if you have the days'],
      best: 'May – September (safari) · November – March (coast)', m: '5-9,11-3', dur: '8–10 nights', n: [8, 10],
      good: 'Honeymooners, families with older children, wildlife interest, once-in-a-lifetime trips',
      worth: 'Families can keep the safari in malaria-free reserves. One honeymooning couple came to us for the visa and bookings and chose South Africa: <a href="about-us.html">their review is on our About page</a>.',
      t: ['hm', 'fam', 'wild'], a: ['safari', 'beach', 'city'] },

    { id: 'kenya', name: 'Kenya', r: 'africa', sp: true, veg: true,
      line: 'The Mara at dawn, the migration on the move, and Kilimanjaro on the horizon.',
      about: 'Kenya is safari in its classic form: the open grassland of the Masai Mara, the Great Migration crossing the Mara River, and Amboseli’s elephants with Kilimanjaro behind them. Nairobi’s long-settled Indian community means vegetarian food is easier here than on most safari routes. Finish on the Indian Ocean at Diani if there’s time.',
      does: ['Game drives across the Masai Mara, morning and late afternoon', 'A hot-air balloon over the Mara at dawn', 'Amboseli’s elephant herds, with Kilimanjaro on a clear day', 'Lake Nakuru’s rhino sanctuary', 'Diani Beach on the coast to finish'],
      best: 'July – October (migration) · January – February', m: '7-10,1-2', dur: '6–8 nights', n: [6, 8],
      good: 'Honeymooners, families with older children, wildlife interest, once-in-a-lifetime trips',
      worth: 'The Great Migration usually reaches the Mara between July and October, but the herds keep their own calendar. No one can honestly promise a river crossing on a given day, and we won’t.',
      t: ['hm', 'fam', 'wild'], a: ['safari', 'balloon', 'beach'] },

    { id: 'egypt', name: 'Egypt', r: 'africa',
      line: 'Five thousand years, and a river that explains all of it.',
      about: 'Egypt is best understood from the water. A Nile cruise between Luxor and Aswan takes you past temples you’d otherwise drive hours to reach (Edfu, Kom Ombo, Philae) and does the travelling while you sleep. Giza and the Sphinx are on the edge of Cairo, closer to the city than photographs suggest. The Grand Egyptian Museum now holds the complete Tutankhamun collection. Abu Simbel, carved into a cliff and moved stone by stone in the 1960s, is the one people underestimate.',
      does: ['Pyramids of Giza, the Sphinx, and the Grand Egyptian Museum', 'Nile cruise, Luxor to Aswan, three or four nights', 'Valley of the Kings and Hatshepsut’s temple', 'Abu Simbel at sunrise', 'Khan el-Khalili bazaar in old Cairo'],
      best: 'October – April', m: '10-4', dur: '7–8 nights', n: [7, 8],
      good: 'History travellers, families, groups, multi-generation trips',
      worth: 'Luxor and Aswan heat is serious outside October to April, especially for older travellers. Nile-cruise meals are buffets, so we confirm vegetarian options with the boat in advance.',
      t: ['cul', 'fam', 'grp', 'sen'], a: ['heritage', 'boat', 'market', 'temple'] },

    /* ---------------- THE LONG HAUL ---------------- */
    { id: 'usa', name: 'USA', r: 'long-haul',
      line: 'Too big for one trip. Pick a coast and do it properly.',
      about: 'The mistake with America is trying to see it. Pick a region. East coast: New York, Washington, Niagara, Boston. West coast: California from San Francisco down Highway 1 to Los Angeles and San Diego, with Las Vegas and the Grand Canyon out east. Florida if it’s a theme-park trip with children. The visa is the hard part and the interview is unforgiving: we prepare files properly and we’ll tell you frankly how yours reads before you book anything.',
      does: ['<b>East:</b> Statue of Liberty, Times Square, the Smithsonian, Niagara Falls', '<b>West:</b> Golden Gate, Highway 1, Yosemite, Universal Studios', '<b>Southwest:</b> Grand Canyon, Las Vegas, Antelope Canyon and Horseshoe Bend', '<b>Florida:</b> Walt Disney World, Kennedy Space Center, Miami and the Keys', 'Baseball or basketball, if the season lines up'],
      best: 'Varies by region: ask us', m: '', dur: '10–14 nights', n: [10, 14],
      good: 'Families, visiting relatives, theme-park trips, second-time long-haul travellers',
      worth: 'Visa interview waits in India can run long. Check the wait before you fix dates. We’ll read your file first and tell you honestly how it looks.',
      t: ['fam'], a: ['city', 'theme'] },

    { id: 'australia', name: 'Australia', r: 'long-haul',
      line: 'Reef, rock and three cities that don’t feel like each other.',
      about: 'Australia is a long way and rewards a long stay. Sydney for the harbour, the bridge climb and Bondi. The Great Barrier Reef from Cairns, which is genuinely one of the natural wonders and is changing, so sooner is better. Uluru at sunset, which photographs never get right. Melbourne for laneways and coffee, and the Great Ocean Road to the Twelve Apostles. Add New Zealand if you’re already going that far.',
      does: ['Sydney Opera House, Harbour Bridge climb and Bondi to Coogee walk', 'Great Barrier Reef snorkel or dive from Cairns', 'Uluru at sunset and the Field of Light', 'Great Ocean Road and the Twelve Apostles', 'Kangaroos and koalas at a wildlife sanctuary'],
      best: 'September – November · March – May', m: '9-11,3-5', dur: '10–12 nights', n: [10, 12],
      good: 'Families, honeymooners, once-in-a-lifetime trips, visiting relatives',
      worth: 'It’s bigger than it looks: Sydney to Cairns is a three-hour flight. Pick two regions, not four, and you’ll actually see them.',
      t: ['fam', 'hm', 'bch'], a: ['snork', 'city', 'beach'] },

    { id: 'new-zealand', name: 'New Zealand', r: 'long-haul', sp: true,
      line: 'Two islands, a hundred landscapes, and a road between all of them.',
      about: 'New Zealand is a driving country and that’s the point. The South Island in particular: Queenstown for adrenaline, Milford Sound in the rain, which is when it’s at its best, Franz Josef glacier, Aoraki Mount Cook, and Tekapo’s lake under some of the darkest skies on earth. The North Island has Rotorua’s geothermal fields, Waitomo’s glow-worm caves and Hobbiton. Twelve nights minimum. Anything less and you’re just driving.',
      does: ['Milford Sound cruise through Fiordland', 'Queenstown: bungy, jet boat, or just the gondola', 'Franz Josef or Fox Glacier heli-hike', 'Waitomo glow-worm caves and Hobbiton', 'Rotorua geothermal parks and a Māori hāngī evening'],
      best: 'November – April', m: '11-4', dur: '10–14 nights', n: [10, 14],
      good: 'Honeymooners, self-drive travellers, adventure interest, photographers',
      worth: 'Distances look small on the map and aren’t. Best done as a self-drive with fewer, longer stops, or a driver if nobody wants the wheel.',
      t: ['hm', 'adv', 'wild'], a: ['boat', 'snow', 'trek'] },

    /* ================= INDIA & AROUND ================= */
    /* The Himalayas & the North */
    { id: 'kashmir', name: 'Kashmir', r: 'himalayas',
      line: 'Shikaras on the Dal, meadows at Gulmarg, and a houseboat with a wood stove.',
      about: 'Srinagar’s houseboats, the Mughal gardens, Gulmarg’s gondola, the highest cable car in the world, and Pahalgam’s Betaab Valley. Tulip season in April is short and spectacular.',
      best: 'March – October', m: '3-10', dur: '6–7 nights', n: [6, 7],
      worth: 'Tulip season is only a few weeks in April, and houseboats on the Dal fill months ahead. Book early.',
      t: ['hm', 'wild'], a: ['houseboat', 'boat', 'snow'] },
    { id: 'ladakh', name: 'Ladakh', r: 'himalayas',
      line: 'Thin air, Pangong blue, and roads that shouldn’t exist.',
      about: 'Leh, Nubra Valley over Khardung La, Pangong Tso, and the monasteries at Thiksey and Hemis. Needs two days of acclimatisation and we build them in.',
      best: 'June – September', m: '6-9', dur: '6–8 nights', n: [6, 8],
      worth: 'Flying straight into 3,500 metres needs rest. The two acclimatisation days aren’t padding; they’re what keeps the rest of the trip possible.',
      t: ['adv'], a: ['snow', 'temple'] },
    { id: 'himachal-pradesh', name: 'Himachal Pradesh', r: 'himalayas',
      line: 'Deodar forest, colonial hill stations, and the road to Spiti.',
      about: 'Shimla, Manali, Dharamshala and McLeod Ganj, Kasol and Spiti for those going further.',
      best: 'March – June · September – November', m: '3-6,9-11', dur: '5–7 nights', n: [5, 7],
      worth: 'Rohtang Pass needs a permit and closes in bad weather. We apply for it in advance and keep a plan B for the day.',
      t: ['fam', 'adv'], a: ['snow'] },
    { id: 'uttarakhand', name: 'Uttarakhand', r: 'himalayas',
      line: 'Char Dham, Corbett, and the Valley of Flowers.',
      about: 'Rishikesh and Haridwar for the Ganga aarti, Nainital and Mussoorie, Jim Corbett for tigers, and the Char Dham circuit in season.',
      best: 'March – June · September – November', m: '3-6,9-11', dur: '5–8 nights', n: [5, 8],
      worth: 'Char Dham pilgrims must register before travelling, and slots fill in peak season. We handle the registration with the bookings.',
      t: ['pil', 'wild'], a: ['temple', 'safari'],
      img: 'assets/images/destinations/uttarakhand-kedarnath.jpg', alt: 'Kedarnath temple below snow-covered Himalayan peaks' },
    { id: 'punjab-amritsar', name: 'Punjab & Amritsar', r: 'himalayas',
      line: 'The Golden Temple at 4am, and the border at sunset.',
      about: 'Harmandir Sahib, langar at the world’s largest community kitchen, Jallianwala Bagh, and the Wagah border ceremony.',
      best: 'October – March', m: '10-3', dur: '2–3 nights', n: [2, 3],
      worth: 'The Wagah ceremony draws crowds. We get you there early enough for a seat, not a view of the back of someone’s head.',
      t: ['pil', 'cul', 'short'], a: ['temple', 'heritage'],
      img: 'assets/images/destinations/amritsar-golden-temple.png', alt: 'The Golden Temple reflected in the sacred pool, Amritsar' },
    { id: 'golden-triangle', name: 'Delhi & the Golden Triangle', r: 'himalayas',
      line: 'Three cities, three centuries, one week.',
      about: 'Delhi, Agra’s Taj Mahal at sunrise, and Jaipur’s forts and palaces. The trip every first-time visitor to India takes, and rightly.',
      best: 'October – March', m: '10-3', dur: '5–6 nights', n: [5, 6],
      worth: 'Arrive at the Taj Mahal at sunrise, before the crowds and the heat. It’s closed on Fridays, and we plan around that.',
      t: ['cul'], a: ['heritage', 'city'] },

    /* Rajasthan & the West */
    { id: 'rajasthan', name: 'Rajasthan', r: 'west',
      line: 'Nine forts, two lakes, one desert, and more colour than seems reasonable.',
      about: 'Jaipur, Udaipur’s lake palaces, Jodhpur’s blue city under Mehrangarh, Jaisalmer’s living fort and a night in the Thar dunes, Pushkar’s ghats.',
      best: 'October – March', m: '10-3', dur: '8–10 nights', n: [8, 10],
      worth: 'The forts are hours apart by road. We cap the car time per day, so the trip isn’t mostly highway.',
      t: ['cul'], a: ['heritage', 'desert'] },
    { id: 'gujarat', name: 'Gujarat & the Rann', r: 'west', veg: true,
      line: 'White salt to the horizon, and a full moon over it.',
      about: 'The Rann Utsav at Dhordo, Gir for Asiatic lions, Somnath and Dwarka, and the stepwells at Patan and Adalaj.',
      best: 'November – February', m: '11-2', dur: '5–7 nights', n: [5, 7],
      worth: 'The Rann Utsav tents book out months ahead of the full-moon nights. Pure vegetarian and Jain food is the norm here, not a request.',
      t: ['cul', 'wild', 'pil'], a: ['safari', 'desert', 'temple', 'heritage'] },
    { id: 'goa', name: 'Goa', r: 'west',
      line: 'Two coasts, one attitude, and the best sunsets on the west side.',
      about: 'North Goa for the beaches and markets, South Goa for the quiet, Old Goa’s basilicas, and a Mandovi cruise.',
      best: 'November – February', m: '11-2', dur: '3–5 nights', n: [3, 5],
      worth: 'North and South Goa are an hour or more apart. Pick the side that suits your group rather than commuting between them.',
      t: ['bch', 'grp', 'short'], a: ['beach', 'boat', 'market'] },
    { id: 'maharashtra', name: 'Maharashtra', r: 'west',
      line: 'Cave temples cut from cliffs, and hill stations built for the monsoon.',
      about: 'Ajanta and Ellora, Mumbai’s Gateway and Elephanta, Lonavala and Mahabaleshwar, Shirdi and Nashik.',
      best: 'October – March', m: '10-3', dur: '4–6 nights', n: [4, 6],
      worth: 'Ajanta is closed on Mondays and Ellora on Tuesdays. We schedule around it so no one arrives at a locked gate.',
      t: ['cul', 'pil'], a: ['heritage', 'temple', 'city'] },

    /* The South */
    { id: 'kerala', name: 'Kerala', r: 'south',
      line: 'A houseboat, a hill station and a beach, in that order.',
      about: 'Alleppey backwaters, Munnar’s tea estates, Thekkady’s spice plantations, Kochi’s Chinese fishing nets and Fort Kochi, Kovalam or Varkala to finish.',
      best: 'September – March', m: '9-3', dur: '6–8 nights', n: [6, 8],
      worth: 'One houseboat night is the classic. More than two and the backwaters start to repeat: we’d rather give you a night in Munnar.',
      t: ['bch', 'wild'], a: ['houseboat', 'beach', 'boat'] },
    { id: 'tamil-nadu', name: 'Tamil Nadu', r: 'south',
      line: 'Gopurams, French shutters and the blue mountains.',
      about: 'Madurai’s Meenakshi temple, Thanjavur and Mahabalipuram, Pondicherry’s French quarter, Ooty and Coonoor on the Nilgiri mountain railway.',
      best: 'October – March', m: '10-3', dur: '6–8 nights', n: [6, 8],
      worth: 'Temple dress codes and darshan timings shape the day. We plan around them rather than into them.',
      t: ['cul', 'pil'], a: ['temple', 'rail', 'heritage'] },
    { id: 'karnataka', name: 'Karnataka', r: 'south',
      line: 'Boulder fields at Hampi, and palaces lit up in Mysuru.',
      about: 'Hampi’s ruined Vijayanagara capital, Mysuru Palace, Coorg’s coffee estates, Gokarna’s beaches and Bandipur for wildlife.',
      best: 'October – March', m: '10-3', dur: '5–7 nights', n: [5, 7],
      worth: 'Hampi covers a lot of ground in the heat. Two nights and an early start beat one rushed day.',
      t: ['cul', 'wild', 'bch'], a: ['heritage', 'safari', 'beach'] },
    { id: 'andhra-telangana', name: 'Andhra Pradesh & Telangana', r: 'south',
      line: 'Home ground, and better than most locals give it credit for.',
      about: 'Tirupati, Araku Valley and Vizag’s beaches, Hyderabad’s Charminar and Golconda, Ramoji Film City, and Belum Caves.',
      best: 'October – March', m: '10-3', dur: '3–5 nights', n: [3, 5],
      worth: 'Tirupati darshan slots are booked online and fill fast. We book them with the trip, not after.',
      t: ['pil', 'short', 'fam'], a: ['temple', 'beach', 'theme', 'heritage'] },

    /* The East & North East */
    { id: 'sikkim-darjeeling', name: 'Sikkim & Darjeeling', r: 'east-ne',
      line: 'Kanchenjunga at dawn from a hilltop, and a toy train up to it.',
      about: 'Gangtok, Tsomgo Lake and Nathula, the Darjeeling Himalayan Railway, Tiger Hill at sunrise and the tea estates below.',
      best: 'March – May · October – December', m: '3-5,10-12', dur: '6–7 nights', n: [6, 7],
      worth: 'Tsomgo Lake and Nathula need permits, and Nathula closes on certain days. We apply in advance and plan around the closures.',
      t: ['wild', 'fam'], a: ['rail', 'snow'] },
    { id: 'meghalaya', name: 'Meghalaya', r: 'east-ne',
      line: 'Living root bridges, and the wettest place on earth.',
      about: 'Shillong, Cherrapunji and Mawsynram, the double-decker root bridge at Nongriat, Dawki’s glass-clear river and Mawlynnong village.',
      best: 'October – May', m: '10-5', dur: '5–6 nights', n: [5, 6],
      worth: 'The double-decker root bridge is roughly 3,500 steps down, and the same back up. We’ll tell you honestly who in your group should do it.',
      t: ['adv', 'wild'], a: ['trek', 'boat'] },
    { id: 'assam', name: 'Assam', r: 'east-ne',
      line: 'One-horned rhinos, and tea gardens to the horizon.',
      about: 'Kaziranga for rhino and elephant safari, Majuli river island, Kamakhya temple and the Brahmaputra at Guwahati.',
      best: 'November – April', m: '11-4', dur: '4–5 nights', n: [4, 5],
      worth: 'Kaziranga closes to safaris through the monsoon months. Plan for November to April.',
      t: ['wild', 'pil'], a: ['safari', 'temple', 'boat'] },
    { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', r: 'east-ne',
      line: 'Tawang monastery, a high pass, and almost no one else.',
      about: 'Tawang, Sela Pass, Bomdila and the Ziro valley. Inner Line Permits required: we arrange them.',
      best: 'March – October', m: '3-10', dur: '6–8 nights', n: [6, 8],
      worth: 'Inner Line Permits are required and we arrange them. Sela Pass can snow over, so we build a buffer day into winter trips.',
      t: ['adv'], a: ['temple', 'snow'] },
    { id: 'odisha', name: 'Odisha', r: 'east-ne',
      line: 'A sun temple shaped like a chariot, and beaches nobody’s found.',
      about: 'Konark, Puri’s Jagannath temple, Bhubaneswar’s old temples, Chilika Lake for dolphins.',
      best: 'October – March', m: '10-3', dur: '4–5 nights', n: [4, 5],
      worth: 'Puri’s Jagannath temple admits Hindus only. We plan the day so no one in a mixed group is left waiting outside without a plan.',
      t: ['pil', 'cul', 'bch'], a: ['temple', 'beach', 'boat'] },

    /* The Islands */
    { id: 'andaman-nicobar', name: 'Andaman & Nicobar', r: 'india-islands',
      line: 'Radhanagar at sunset, and a reef fifteen minutes offshore.',
      about: 'Port Blair and the Cellular Jail light-and-sound show, Havelock’s Radhanagar Beach, Neil Island, scuba at Elephant Beach, and the Ross Island ruins.',
      best: 'October – May', m: '10-5', dur: '5–6 nights', n: [5, 6],
      worth: 'Ferries to Havelock and Neil sell out and depend on the weather. We book them together with your flights, with a buffer day before you fly out.',
      t: ['bch', 'hm'], a: ['beach', 'snork', 'heritage'] },
    { id: 'lakshadweep', name: 'Lakshadweep', r: 'india-islands',
      line: 'India’s own atolls, with permits and almost no crowds.',
      about: 'Agatti, Bangaram and Kavaratti: lagoons, kayaking and some of the best diving in India. Entry permits required and arranged in advance.',
      best: 'October – April', m: '10-4', dur: '4–5 nights', n: [4, 5],
      worth: 'Entry permits and a police clearance are required. Apply weeks ahead: we handle the paperwork.',
      t: ['bch'], a: ['beach', 'snork'] },

    /* Around India */
    { id: 'nepal', name: 'Nepal', r: 'around',
      line: 'Everest from an aeroplane window, and a stupa older than most countries.',
      about: 'Kathmandu’s Durbar Squares, Pashupatinath and Boudhanath, Pokhara under the Annapurnas, Chitwan for rhino safari, and a mountain flight past Everest. Muktinath for pilgrims. No visa needed for Indian nationals.',
      best: 'October – April', m: '10-4', dur: '5–7 nights', n: [5, 7],
      worth: 'No visa for Indian nationals, but carry your passport or voter ID. The Everest mountain flight depends on the weather, so we book it early in the trip, leaving room to retry.',
      t: ['pil', 'wild', 'adv'], a: ['temple', 'safari', 'snow'] },
    { id: 'bhutan', name: 'Bhutan', r: 'around',
      line: 'Tiger’s Nest on a cliff face, and a country that measures happiness.',
      about: 'Paro’s Taktsang monastery clinging to a 900-metre cliff, Thimphu’s dzong and giant Buddha, Punakha’s river-fork fortress, and Dochula Pass on a clear morning. Entry by permit at Phuentsholing or by air to Paro.',
      best: 'March – May · September – November', m: '3-5,9-11', dur: '5–6 nights', n: [5, 6],
      worth: 'A per-night Sustainable Development Fee applies to every visitor. It goes into your quote from the start, so it isn’t a surprise at the border.',
      t: ['cul', 'adv'], a: ['temple', 'trek', 'heritage'] }
  ];

  /* A–Z aliases from the content document's index */
  var aliases = [
    ['Almaty', 'kazakhstan'], ['Baku', 'azerbaijan'], ['Darjeeling', 'sikkim-darjeeling'], ['Delhi', 'golden-triangle'],
    ['Norway', 'norway-sweden'], ['Sweden', 'norway-sweden'], ['Spain', 'spain-portugal'], ['Portugal', 'spain-portugal'],
    ['Punjab', 'punjab-amritsar'], ['Tashkent', 'uzbekistan'], ['Telangana', 'andhra-telangana'], ['Andhra Pradesh', 'andhra-telangana'],
    ['Sikkim', 'sikkim-darjeeling'], ['Gujarat', 'gujarat']
  ];

  /* "Tell us the month", each item links to a destination or a region */
  var calendar = [
    { when: 'January – February', months: [1, 2], go: [['Maldives', 'maldives'], ['Kenya', 'kenya'], ['Vietnam', 'vietnam'], ['Cambodia', 'cambodia'], ['Philippines', 'philippines'], ['Dubai', 'dubai'], ['Oman', 'oman'], ['Egypt', 'egypt'], ['New Zealand', 'new-zealand'], ['Finland', 'finland', 'aurora'], ['Sri Lanka', 'sri-lanka'], ['Rajasthan', 'rajasthan'], ['Kerala', 'kerala']] },
    { when: 'March – April', months: [3, 4], go: [['Japan', 'japan', 'cherry blossom'], ['Bali', 'bali'], ['South Korea', 'south-korea'], ['Spain & Portugal', 'spain-portugal'], ['Turkey', 'turkey'], ['Central Asia', 'r:central-asia'], ['Australia', 'australia'], ['Kashmir', 'kashmir', 'tulips'], ['Bhutan', 'bhutan']] },
    { when: 'May – June', months: [5, 6], go: [['Europe', 'europe'], ['Switzerland', 'switzerland'], ['Paris', 'paris'], ['United Kingdom', 'united-kingdom'], ['Iceland', 'iceland'], ['Norway & Sweden', 'norway-sweden'], ['Mauritius', 'mauritius'], ['South Africa', 'south-africa', 'safari'], ['Georgia', 'georgia'], ['Ladakh', 'ladakh'], ['Sikkim', 'sikkim-darjeeling']] },
    { when: 'July – August', months: [7, 8], go: [['Kenya', 'kenya', 'migration'], ['Europe', 'europe'], ['United Kingdom', 'united-kingdom'], ['Iceland', 'iceland', 'midnight sun'], ['Bali', 'bali'], ['Singapore', 'singapore'], ['Malaysia', 'malaysia'], ['Ladakh', 'ladakh'], ['Spiti', 'himachal-pradesh'], ['Kashmir', 'kashmir']] },
    { when: 'September – October', months: [9, 10], go: [['Europe', 'europe'], ['Japan', 'japan', 'autumn'], ['China', 'china'], ['South Korea', 'south-korea'], ['Turkey', 'turkey'], ['Central Asia', 'r:central-asia'], ['Australia', 'australia'], ['Seychelles', 'seychelles'], ['Nepal', 'nepal'], ['North East India', 'r:east-ne']] },
    { when: 'November – December', months: [11, 12], go: [['Maldives', 'maldives'], ['Dubai', 'dubai'], ['Thailand', 'thailand'], ['Egypt', 'egypt'], ['Vietnam', 'vietnam'], ['Cambodia', 'cambodia'], ['Finland', 'finland'], ['New Zealand', 'new-zealand'], ['Seychelles', 'seychelles'], ['Rajasthan', 'rajasthan'], ['Kerala', 'kerala'], ['Rann of Kutch', 'gujarat']] }
  ];

  /* expand "11-3,6-8" into a sorted list of month numbers */
  function months(spec) {
    var out = [];
    if (!spec) return out;
    spec.split(',').forEach(function (part) {
      var ab = part.split('-').map(Number), a = ab[0], b = ab.length > 1 ? ab[1] : ab[0];
      for (var i = a; ; i = i % 12 + 1) {
        if (out.indexOf(i) < 0) out.push(i);
        if (i === b) break;
      }
    });
    return out.sort(function (x, y) { return x - y; });
  }
  /* Every destination keeps its original tags; the four filter types are
     also derived from them so no destination drops out of the filter.
     Senior picks follow the Senior Citizens' collection (Holidays page). */
  var derive = { bch: ['hm'], adv: ['grp'], short: ['grp'], cul: ['fam'], wild: ['fam'], pil: ['sen', 'fam'] };
  var seniorIdeas = ['sri-lanka', 'kerala', 'switzerland', 'golden-triangle'];
  d.forEach(function (x) {
    x.months = months(x.m);
    x.t.slice().forEach(function (t) { (derive[t] || []).forEach(function (n) { if (x.t.indexOf(n) < 0) x.t.push(n); }); });
    if (seniorIdeas.indexOf(x.id) > -1 && x.t.indexOf('sen') < 0) x.t.push('sen');
    x.lens = lengths.filter(function (l) { return x.n[0] <= l[3] && x.n[1] >= l[2]; }).map(function (l) { return l[0]; });
  });

  return { regions: regions, indiaPin: indiaPin, types: types, acts: acts, lengths: lengths,
           list: d, aliases: aliases, calendar: calendar };
})();
