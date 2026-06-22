/* Markhor — English ⇄ اردو. Dictionary + in-place text-node translator.
   Keys are the normalised (single-spaced, trimmed) English text of each node. */
(function () {
  const UR = {
    // nav
    "Markets": "بازار", "How it works": "یہ کیسے کام کرتا ہے", "For you": "آپ کے لیے", "Wallet": "والٹ", "FAQ": "عمومی سوالات", "Portfolio": "پورٹ فولیو",
    "Sign in": "سائن اِن", "Create account": "اکاؤنٹ بنائیں",
    // hero
    "Supervised under the joint PVARA–SECP sandbox": "مشترکہ PVARA–SECP سینڈ باکس کے تحت زیرِ نگرانی",
    "Own a share of Pakistani sport, story & song.": "پاکستانی کھیل، کہانی اور نغمے میں اپنا حصہ رکھیں۔",
    "Own a share of Pakistani": "پاکستانی", "sport, story & song.": "کھیل، کہانی اور نغمے میں اپنا حصہ رکھیں۔",
    "For decades, Pakistan's talent has lit up the world and brought little of it home — Olympic medals, four-billion-view dramas, songs streamed on every continent. Markhor lets the people who believe in them own a real share of the upside — regulated, and settled inside Pakistan.": "دہائیوں سے پاکستان کا ہنر دنیا کو روشن کرتا رہا اور ملک کو کم ہی ملا — اولمپک تمغے، چار ارب ویوز والے ڈرامے، ہر براعظم پر سنے جانے والے گیت۔ مارخور اُن لوگوں کو جو اِن پر یقین رکھتے ہیں اوپری منافع میں ایک حقیقی حصہ دیتا ہے — ریگولیٹڈ، اور پاکستان کے اندر سیٹل ہوتا ہے۔",
    "Create your account": "اپنا اکاؤنٹ بنائیں", "See what's listed": "دیکھیں کیا درج ہے",
    "or try the full demo as a guest — no sign-up →": "یا بطور مہمان پورا ڈیمو آزمائیں — سائن اَپ کی ضرورت نہیں ←",
    "Regulated instruments": "ریگولیٹڈ انسٹرومنٹس", "Diaspora jurisdictions": "بیرونِ ملک دائرہ کار", "Wallet for all of it": "سب کے لیے ایک والٹ",
    // device mockups
    "Ticket confirmed": "ٹکٹ تصدیق شدہ", "Hockey · group stage · Aug": "ہاکی · گروپ مرحلہ · اگست", "Royalty paid": "رائلٹی ادا ہوئی",
    "PKR 1,240 this month": "اس ماہ 1,240 روپے", "Diaspora wallet": "بیرونِ ملک والٹ", "Portfolio value": "پورٹ فولیو ویلیو", "PKR 248,900": "248,900 روپے",
    "▲ 6.2% earning on 3 of 4": "▲ 6.2% · 4 میں سے 3 پر منافع", "Your holdings": "آپ کی ملکیتیں",
    "Hockey Supporter Token": "ہاکی سپورٹر ٹوکن", "World Cup slate": "ورلڈ کپ سلیٹ", "Javelin Career Share": "جیولن کیریئر شیئر", "Escrowed": "ایسکرو میں",
    "Drama Royalty": "ڈرامہ رائلٹی", "Pays monthly": "ماہانہ ادائیگی", "earns": "کماتا ہے", "Group-stage ticket": "گروپ مرحلہ ٹکٹ", "Resale on-chain": "آن چین ری سیل", "held": "ملکیت",
    "Home": "ہوم", "You": "آپ",
    // segmentation
    "Start here": "یہاں سے شروع کریں", "What brings you to Markhor?": "آپ کو مارخور تک کیا لایا؟",
    "One tap to explore — no sign-up needed. Browse the whole platform as a guest.": "ایک ٹیپ پر دریافت کریں — سائن اَپ کی ضرورت نہیں۔ پورا پلیٹ فارم بطور مہمان دیکھیں۔",
    "I want to invest": "میں سرمایہ کاری کرنا چاہتا ہوں",
    "Own fan tokens, athlete shares, royalties and tickets. Browse the live markets and back what you love.": "فین ٹوکن، ایتھلیٹ شیئرز، رائلٹی اور ٹکٹ رکھیں۔ لائیو بازار دیکھیں اور جسے پسند کریں اُس کی پشت پناہی کریں۔",
    "Explore markets →": "بازار دیکھیں ←", "I'm a federation": "میں ایک فیڈریشن ہوں",
    "Raise capital, sell tickets, and publish your books on a live, public transparency ledger.": "سرمایہ اکٹھا کریں، ٹکٹ بیچیں، اور اپنے کھاتے ایک لائیو، عوامی شفافیت لیجر پر شائع کریں۔",
    "Open the issuer console →": "اِشورر کنسول کھولیں ←", "I'm an artist or athlete": "میں ایک فنکار یا کھلاڑی ہوں",
    "Turn fans into backers. Raise against your future and your royalties, on Pakistani rails.": "مداحوں کو سرمایہ کار بنائیں۔ اپنے مستقبل اور رائلٹی کے بدلے سرمایہ اکٹھا کریں، پاکستانی نظام پر۔",
    "Open the creator console →": "کری ایٹر کنسول کھولیں ←", "I'm in the diaspora": "میں بیرونِ ملک ہوں",
    "One regulated wallet, compliant wherever you live. Turn money sent home into ownership.": "ایک ریگولیٹڈ والٹ، جہاں بھی رہیں قواعد کے مطابق۔ گھر بھیجی رقم کو ملکیت میں بدلیں۔",
    "Open the wallet →": "والٹ کھولیں ←",
    // proof ticker
    "Hockey ·": "ہاکی ·", "4 World Cups won": "4 ورلڈ کپ جیتے", ", none since 2014": "، 2014 سے کوئی نہیں",
    "Arshad Nadeem ·": "ارشد ندیم ·", "Olympic gold": "اولمپک گولڈ", ", Paris": "، پیرس",
    "Tere Bin ·": "تیرے بِن ·", "4 billion views": "4 ارب ویوز", ", no Pakistani rail underneath": "، نیچے کوئی پاکستانی نظام نہیں",
    "Jahangir Khan ·": "جہانگیر خان ·", "555 unbeaten": "555 ناقابلِ شکست", "in squash": "اسکواش میں",
    "Coke Studio ·": "کوک اسٹوڈیو ·", "5B+ streams": "5 ارب+ اسٹریمز", ", 180 countries": "، 180 ممالک",
    "Diaspora ·": "بیرونِ ملک ·", "sent home a year": "سالانہ وطن بھیجے",
    // why we built this
    "Why we built this": "ہم نے یہ کیوں بنایا",
    "When you think of Pakistani sport, you think of cricket. The next decade will come from everywhere else, and almost none of it is owned at home.": "جب آپ پاکستانی کھیل کا سوچتے ہیں تو کرکٹ ذہن میں آتی ہے۔ اگلی دہائی ہر دوسری جگہ سے آئے گی، اور اُس میں سے تقریباً کچھ بھی ملک میں ملکیت میں نہیں۔",
    "For fifty years, the value Pakistani sport and culture create has flowed one way: outward. The athlete plays, the artist records, and a platform somewhere else keeps the rail. The talent stays here. The upside leaves.": "پچاس سال سے، پاکستانی کھیل اور ثقافت جو قدر پیدا کرتے ہیں وہ ایک ہی سمت بہی ہے: باہر کی طرف۔ کھلاڑی کھیلتا ہے، فنکار ریکارڈ کرتا ہے، اور کہیں اور کا کوئی پلیٹ فارم نظام اپنے پاس رکھتا ہے۔ ہنر یہیں رہتا ہے۔ منافع چلا جاتا ہے۔",
    "That's not a talent problem. It's a plumbing problem. The audience is already built; the way to capture and hold its value inside the country is not.": "یہ ہنر کا مسئلہ نہیں۔ یہ نظام کا مسئلہ ہے۔ سامعین پہلے سے موجود ہیں؛ ملک کے اندر اُن کی قدر کو سمیٹنے اور روکنے کا راستہ نہیں۔",
    "Markhor is that plumbing. We don't make the content or run an exchange. We issue, hold, clear and report the regulated instruments that let people own a piece of it, under one rulebook the regulator helped write.": "مارخور وہی نظام ہے۔ ہم نہ مواد بناتے ہیں نہ کوئی ایکسچینج چلاتے ہیں۔ ہم وہ ریگولیٹڈ انسٹرومنٹس جاری، محفوظ، کلیئر اور رپورٹ کرتے ہیں جو لوگوں کو اِس میں حصہ رکھنے دیتے ہیں، ایک ایسے ضابطے کے تحت جسے بنانے میں ریگولیٹر نے مدد دی۔",
    "The state writes the rules. We run the rails. You own the share. That's the whole idea.": "ریاست قواعد لکھتی ہے۔ ہم نظام چلاتے ہیں۔ آپ حصہ رکھتے ہیں۔ بس یہی پورا خیال ہے۔",
    "The National Operator · Pakistan": "دی نیشنل آپریٹر · پاکستان",
    // thesis / stories
    "The stories under the thesis": "تھیسس کے پیچھے کی کہانیاں", "The talent was never the problem.": "ہنر کبھی مسئلہ نہیں تھا۔",
    "Real names, real numbers. Every one a structural gap, not a shortage of ability. This is what the rails are for.": "اصل نام، اصل اعداد۔ ہر ایک ساختی خلا ہے، صلاحیت کی کمی نہیں۔ نظام اسی لیے ہیں۔",
    "See it for yourself — real footage, tap to play": "خود دیکھیں — اصل فوٹیج، چلانے کے لیے ٹیپ کریں",
    "Athletics": "ایتھلیٹکس", "The gold, and the buffalo.": "تمغہ، اور بھینس۔", "Arshad Nadeem · Olympic javelin gold": "ارشد ندیم · اولمپک جیولن گولڈ",
    "Music": "موسیقی", "Most-streamed, mostly offshore.": "سب سے زیادہ اسٹریم، زیادہ تر بیرونِ ملک۔", "Pasoori · Ali Sethi & Shae Gill · Coke Studio": "پسوری · علی سیٹھی اور شائے گِل · کوک اسٹوڈیو",
    "Drama": "ڈرامہ", "Four billion views, no rail.": "چار ارب ویوز، کوئی نظام نہیں۔", "Tere Bin · OST · Har Pal Geo": "تیرے بِن · او ایس ٹی · ہر پل جیو",
    "Hockey": "ہاکی", "Champions, once.": "کبھی چیمپئن تھے۔", "1994 World Cup Final · Pakistan v Netherlands · FIH": "1994 ورلڈ کپ فائنل · پاکستان بمقابلہ نیدرلینڈز · FIH",
    "Jahangir Khan's unbeaten run in squash, the longest winning streak in any sport. Pakistan ruled the game for a quarter-century. The demand never left; the funding rail did.": "جہانگیر خان کا اسکواش میں ناقابلِ شکست سلسلہ، کسی بھی کھیل میں سب سے طویل فتح کا سلسلہ۔ پاکستان نے ایک چوتھائی صدی تک اس کھیل پر راج کیا۔ طلب کبھی نہ گئی؛ فنڈنگ کا نظام چلا گیا۔",
    "1981–1986 · professional squash": "1981–1986 · پیشہ ورانہ اسکواش",
    "Four hockey World Cups won between 1971 and 1994. None qualified for since 2014. Not a collapse in talent. A collapse in capture.": "1971 اور 1994 کے درمیان چار ہاکی ورلڈ کپ جیتے۔ 2014 کے بعد کسی کے لیے کوالیفائی نہیں کیا۔ یہ ہنر کا زوال نہیں۔ یہ سمیٹنے کا زوال ہے۔",
    "FIH · Pakistan men's hockey": "FIH · پاکستان مردوں کی ہاکی",
    "Footage hosted on YouTube — loads only when you tap play. Demo; footage belongs to its respective owners.": "فوٹیج یوٹیوب پر میزبان ہے — صرف ٹیپ کرنے پر لوڈ ہوتی ہے۔ ڈیمو؛ فوٹیج اپنے متعلقہ مالکان کی ہے۔",
    // markets
    "What you can own.": "آپ کیا رکھ سکتے ہیں۔",
    "Each listing is a regulated instrument tied to something already happening. Capped, disclosed, escrowed, and settled in Pakistan.": "ہر اندراج ایک ریگولیٹڈ انسٹرومنٹ ہے جو پہلے سے ہو رہی کسی چیز سے جُڑا ہے۔ کیپڈ، ظاہر کردہ، ایسکرو شدہ، اور پاکستان میں سیٹل ہوتا ہے۔",
    "Open the markets app": "مارکیٹس ایپ کھولیں", "Federation": "فیڈریشن",
    "Back the national side's return to the World Cup. Proceeds ring-fenced to a published slate: prep, two junior academies, women's hockey.": "قومی ٹیم کی ورلڈ کپ میں واپسی کی پشت پناہی کریں۔ آمدنی ایک شائع کردہ سلیٹ کے لیے مختص: تیاری، دو جونیئر اکیڈمیاں، خواتین کی ہاکی۔",
    "PKR 62M": "6 کروڑ 20 لاکھ روپے", "of 100M": "10 کروڑ میں سے", "holders": "ہولڈرز",
    "Athlete share": "ایتھلیٹ شیئر",
    "A small, regulated share in an emerging track athlete's future earnings. Held in escrow, released against training milestones.": "ایک اُبھرتے ٹریک ایتھلیٹ کی مستقبل کی آمدنی میں ایک چھوٹا، ریگولیٹڈ حصہ۔ ایسکرو میں رکھا، تربیتی سنگِ میل پر جاری۔",
    "Funded": "فنڈڈ", "From": "سے", "PKR 1,000": "1,000 روپے", "Vesting, multi-year": "ویسٹنگ، کئی سال",
    "Cultural royalty": "ثقافتی رائلٹی",
    "Hold a slice of a serial's royalties. Splits run on-chain across writer, cast and backers, and pay you as it streams worldwide.": "کسی سیریل کی رائلٹی کا ایک حصہ رکھیں۔ تقسیم آن چین چلتی ہے — مصنف، کاسٹ اور بیکرز میں — اور دنیا بھر میں اسٹریم ہوتے ہی آپ کو ادا کرتی ہے۔",
    "Royalty share": "رائلٹی حصہ", "Monthly": "ماہانہ", "payouts": "ادائیگیاں", "IP held in Pakistan": "IP پاکستان میں محفوظ",
    "Ticketing": "ٹکٹنگ", "Hockey vs India, group stage": "ہاکی بمقابلہ بھارت، گروپ مرحلہ",
    "A programmable ticket with verifiable provenance. Resale rules and an anti-scalping cap are written into the contract itself.": "قابلِ توثیق اصل کے ساتھ ایک پروگرام ایبل ٹکٹ۔ ری سیل قواعد اور بلیک مارکیٹنگ کے خلاف حد خود کنٹریکٹ میں لکھی ہوتی ہے۔",
    "PKR 3,500": "3,500 روپے", "August": "اگست", "fixture": "میچ", "Settles in real time": "حقیقی وقت میں سیٹل",
    "Music royalty": "میوزک رائلٹی", "Single Royalty": "سنگل رائلٹی",
    "Own a share of a new release's streaming revenue. The split between artist, label and backers is enforced on-chain, not on paper.": "کسی نئی ریلیز کی اسٹریمنگ آمدنی کا حصہ رکھیں۔ فنکار، لیبل اور بیکرز کے درمیان تقسیم کاغذ پر نہیں، آن چین نافذ ہوتی ہے۔",
    "Revenue share": "آمدنی حصہ", "Global": "عالمی", "streaming": "اسٹریمنگ", "Artist-friendly": "فنکار دوست",
    "Next cohort": "اگلا گروہ", "Squash, wrestling, esports, more.": "اسکواش، کشتی، ای-اسپورٹس، اور بھی۔",
    "New federations and creators join every cohort. Get on the list and you're first in line when the next listing opens.": "ہر گروہ میں نئی فیڈریشنز اور تخلیق کار شامل ہوتے ہیں۔ فہرست میں آ جائیں اور اگلا اندراج کھلتے ہی آپ سب سے آگے ہوں گے۔",
    "Get early access": "ابتدائی رسائی حاصل کریں",
    "Illustrative launch preview. Listings shown are examples; every real issuance is capped, disclosed and escrowed under SECP rules. Nothing here is an offer or investment advice.": "تصویری لانچ پیش منظر۔ دکھائے گئے اندراج مثالیں ہیں؛ ہر اصل اجراء SECP قواعد کے تحت کیپڈ، ظاہر کردہ اور ایسکرو شدہ ہے۔ یہاں کچھ بھی کوئی پیشکش یا سرمایہ کاری مشورہ نہیں۔",
    // how it works
    "Three steps, a few minutes.": "تین مرحلے، چند منٹ۔", "Verify once": "ایک بار تصدیق",
    "Open an account with your CNIC at home, or your local ID abroad. One KYC, built for both, under one rulebook.": "گھر پر اپنے شناختی کارڈ (CNIC) سے، یا بیرونِ ملک اپنی مقامی شناخت سے اکاؤنٹ کھولیں۔ ایک KYC، دونوں کے لیے بنایا، ایک ہی ضابطے کے تحت۔",
    "Add funds": "رقم شامل کریں",
    "Top up in rupees through a licensed partner, or pay from the UK, UAE, US or Canada. A regulated ramp, coordinated with the State Bank.": "کسی لائسنس یافتہ پارٹنر کے ذریعے روپوں میں ٹاپ اپ کریں، یا برطانیہ، یو اے ای، امریکہ یا کینیڈا سے ادائیگی کریں۔ ایک ریگولیٹڈ رستہ، اسٹیٹ بینک کے ساتھ مربوط۔",
    "Own it": "اِسے رکھیں",
    "Hold tokens, shares, royalties and tickets in one wallet. Earnings and settlement land on-chain, on their own.": "ٹوکن، شیئرز، رائلٹی اور ٹکٹ ایک ہی والٹ میں رکھیں۔ کمائی اور سیٹلمنٹ خود بخود آن چین پہنچتی ہے۔",
    // instruments
    "The instruments": "انسٹرومنٹس", "Five regulated ways in.": "اندر آنے کے پانچ ریگولیٹڈ راستے۔",
    "One rulebook, one supervisor. Each is a regulated wrapper around something that already exists, now captured and held inside Pakistan.": "ایک ضابطہ، ایک نگران۔ ہر ایک کسی پہلے سے موجود چیز کے گرد ایک ریگولیٹڈ خول ہے، جو اب پاکستان کے اندر سمیٹا اور رکھا گیا ہے۔",
    "Federation rails": "فیڈریشن ریلز",
    "Supporter tokens and a public ledger. Federations raise capital and publish their books in real time, line by line.": "سپورٹر ٹوکن اور ایک عوامی لیجر۔ فیڈریشنز سرمایہ اکٹھا کرتی ہیں اور اپنے کھاتے حقیقی وقت میں، سطر بہ سطر شائع کرتی ہیں۔",
    "Athlete shares": "ایتھلیٹ شیئرز",
    "Career-share instruments under SECP crowdfunding rules. A balance sheet for talent at sixteen, not twenty-eight.": "SECP کراؤڈ فنڈنگ قواعد کے تحت کیریئر-شیئر انسٹرومنٹس۔ سولہ سال کی عمر میں ہنر کے لیے ایک بیلنس شیٹ، اٹھائیس میں نہیں۔",
    "Cultural royalties": "ثقافتی رائلٹیز",
    "Royalty rights for music, film and drama. Splits on-chain, compatible with global streaming, IP domiciled at home.": "موسیقی، فلم اور ڈرامے کے لیے رائلٹی حقوق۔ تقسیم آن چین، عالمی اسٹریمنگ کے ساتھ ہم آہنگ، IP وطن میں رکھا۔",
    "Programmable tickets with real provenance, resale rules in the contract, and settlement straight to the federation.": "حقیقی اصل کے ساتھ پروگرام ایبل ٹکٹ، کنٹریکٹ میں ری سیل قواعد، اور سیدھی فیڈریشن کو سیٹلمنٹ۔",
    "One verified wallet for 11 million Pakistanis abroad, compliant wherever they live, holding every instrument at once.": "بیرونِ ملک 1 کروڑ 10 لاکھ پاکستانیوں کے لیے ایک تصدیق شدہ والٹ، جہاں بھی رہیں قواعد کے مطابق، بیک وقت ہر انسٹرومنٹ رکھتا ہے۔",
    "Protection, by design": "تحفظ، بہ طرزِ تعمیر",
    "Issuance caps, cooling-off windows, escrow against milestones, per-person limits and an insurance pool, built into the rail.": "اجراء کی حدیں، کولنگ-آف کھڑکیاں، سنگِ میل کے بدلے ایسکرو، فی فرد حدیں اور ایک انشورنس پول، نظام میں شامل۔",
    // for you
    "Whichever side of the rail you're on.": "آپ نظام کے جس بھی طرف ہوں۔", "Fans": "مداح", "Federations": "فیڈریشنز", "Artists": "فنکار", "Diaspora": "بیرونِ ملک",
    "Own the thing you already follow.": "جسے آپ پہلے ہی فالو کرتے ہیں، اُسے رکھیں۔",
    "A token you can hold, a royalty that pays you, a ticket that can't be scalped. Real ownership of the sport, music and drama you'd watch anyway.": "ایک ٹوکن جو آپ رکھ سکیں، ایک رائلٹی جو آپ کو ادا کرے، ایک ٹکٹ جسے بلیک نہ کیا جا سکے۔ اُسی کھیل، موسیقی اور ڈرامے کی حقیقی ملکیت جو آپ ویسے بھی دیکھتے۔",
    "Start from as little as PKR 1,000": "صرف 1,000 روپے سے شروع کریں", "Earn as your royalties stream": "جیسے جیسے آپ کی رائلٹی اسٹریم ہو، کمائیں", "Tickets whose history you can see": "ایسے ٹکٹ جن کی تاریخ آپ دیکھ سکیں",
    "Held": "ملکیت",
    "Raise capital. Show your books.": "سرمایہ اکٹھا کریں۔ اپنے کھاتے دکھائیں۔",
    "Issue supporter tokens and tickets on regulated rails inside Pakistan. You own the token and the dashboard; we run the rulebook.": "پاکستان کے اندر ریگولیٹڈ نظام پر سپورٹر ٹوکن اور ٹکٹ جاری کریں۔ ٹوکن اور ڈیش بورڈ آپ کے، ضابطہ ہم چلاتے ہیں۔",
    "Proceeds ring-fenced to a published slate": "آمدنی ایک شائع کردہ سلیٹ کے لیے مختص", "A live, public transparency ledger": "ایک لائیو، عوامی شفافیت لیجر", "11 million in the diaspora, one wallet away": "بیرونِ ملک 1 کروڑ 10 لاکھ، ایک والٹ کی دوری پر",
    "See the federation offer": "فیڈریشن پیشکش دیکھیں", "Proceeds ledger": "آمدنی لیجر", "Public, on-chain, live": "عوامی، آن چین، لائیو",
    "Academies & women's hockey": "اکیڈمیاں اور خواتین کی ہاکی", "Ring-fenced": "مختص", "Tracked": "ٹریک شدہ", "Fixture ticketing": "میچ ٹکٹنگ", "Real-time settlement": "حقیقی وقت سیٹلمنٹ", "Live": "لائیو",
    "Get paid at home.": "وطن میں ادائیگی پائیں۔",
    "Route foreign-platform revenue through Pakistani IP rails. Friendly splits, real provenance, payouts that don't wait on a quarterly statement.": "غیر ملکی پلیٹ فارم کی آمدنی پاکستانی IP نظام سے گزاریں۔ منصفانہ تقسیم، حقیقی اصل، ایسی ادائیگیاں جو سہ ماہی گوشوارے کا انتظار نہ کریں۔",
    "Register your work on-chain": "اپنا کام آن چین رجسٹر کریں", "Splits across writers, cast and backers": "مصنفین، کاسٹ اور بیکرز میں تقسیم", "Fund the next release from your fans": "اگلی ریلیز اپنے مداحوں سے فنڈ کریں",
    "8% revenue share": "8% آمدنی حصہ", "On-chain": "آن چین", "Drama IP registry": "ڈرامہ IP رجسٹری", "Domiciled at home": "وطن میں مقیم", "Owned": "ملکیت", "Automatic payouts": "خودکار ادائیگیاں", "As it streams": "جیسے یہ اسٹریم ہو",
    "One wallet, every passport stamp.": "ایک والٹ، ہر پاسپورٹ مہر۔",
    "For 11 million Pakistanis abroad sending $38.3B home a year. One verification, one rulebook, compliant from London to Toronto.": "بیرونِ ملک 1 کروڑ 10 لاکھ پاکستانیوں کے لیے جو سالانہ 38.3 ارب ڈالر وطن بھیجتے ہیں۔ ایک تصدیق، ایک ضابطہ، لندن سے ٹورنٹو تک قواعد کے مطابق۔",
    "Built for UK, UAE, US and Canada rules": "برطانیہ، یو اے ای، امریکہ اور کینیڈا کے قواعد کے لیے بنایا", "Turn remittance into ownership": "ترسیلات کو ملکیت میں بدلیں", "Every instrument in one place": "ہر انسٹرومنٹ ایک ہی جگہ",
    "London": "لندن", "FCA-aligned": "FCA سے ہم آہنگ", "Dubai": "دبئی", "VARA-aligned": "VARA سے ہم آہنگ", "Toronto": "ٹورنٹو", "FINTRAC-aligned": "FINTRAC سے ہم آہنگ",
    "People, 65% under thirty": "آبادی، 65% تیس سال سے کم", "In the world for crypto adoption": "کرپٹو اپنانے میں دنیا میں", "Sent home by the diaspora a year": "بیرونِ ملک پاکستانیوں کی سالانہ ترسیل", "Pakistanis abroad, one wallet": "بیرونِ ملک پاکستانی، ایک والٹ",
    // wallet section
    "The diaspora wallet": "بیرونِ ملک والٹ", "Everything you own, in one place.": "آپ کی ہر ملکیت، ایک ہی جگہ۔",
    "Tokens, shares, royalties and tickets, held and tracked in a single verified wallet that stays compliant wherever you live. Move money home and have it land as ownership, not just a transfer.": "ٹوکن، شیئرز، رائلٹی اور ٹکٹ، ایک ہی تصدیق شدہ والٹ میں رکھے اور ٹریک ہوتے ہیں جو جہاں بھی رہیں قواعد کے مطابق رہتا ہے۔ رقم وطن بھیجیں اور وہ محض ایک ٹرانسفر نہیں، ملکیت بن کر پہنچے۔",
    "Today · 1 USD ≈": "آج · 1 امریکی ڈالر ≈", "PKR": "روپے", "Earned this month": "اس ماہ کمایا", "PKR 3,180": "3,180 روپے", "▲ paid across 2 royalties": "▲ 2 رائلٹیز پر ادا",
    "Trending": "ٹرینڈنگ", "62% of cap": "حد کا 62%", "8% share": "8% حصہ", "78% funded": "78% فنڈڈ",
    // FAQ
    "Questions": "سوالات", "Straight answers.": "صاف جواب۔",
    "Is Markhor actually regulated?": "کیا مارخور واقعی ریگولیٹڈ ہے؟",
    "Yes. Markhor runs under the joint PVARA–SECP regulatory sandbox. Every instrument is issued, held, cleared and reported under one published rulebook, with on-chain audit logs and SECP's investor-protection rules applied in full.": "جی ہاں۔ مارخور مشترکہ PVARA–SECP ریگولیٹری سینڈ باکس کے تحت چلتا ہے۔ ہر انسٹرومنٹ ایک شائع کردہ ضابطے کے تحت جاری، محفوظ، کلیئر اور رپورٹ ہوتا ہے، آن چین آڈٹ لاگز کے ساتھ اور SECP کے سرمایہ کار-تحفظ قواعد مکمل طور پر لاگو۔",
    "What can I actually own?": "میں اصل میں کیا رکھ سکتا ہوں؟",
    "Five things: federation supporter tokens, athlete career-shares, royalty rights for music, film and drama, programmable event tickets, and the diaspora wallet that holds them all.": "پانچ چیزیں: فیڈریشن سپورٹر ٹوکن، ایتھلیٹ کیریئر-شیئرز، موسیقی، فلم اور ڈرامے کے رائلٹی حقوق، پروگرام ایبل ایونٹ ٹکٹ، اور وہ بیرونِ ملک والٹ جو اِن سب کو رکھتا ہے۔",
    "How do I make money?": "میں پیسے کیسے کماؤں؟",
    "Royalties pay you a share of streaming revenue, settled automatically. Athlete shares pay against future earnings, under escrow and vesting. Fan tokens are tied to a federation's published slate. Markhor itself earns from fees, not from any token's price.": "رائلٹیز آپ کو اسٹریمنگ آمدنی کا حصہ ادا کرتی ہیں، خود بخود سیٹل۔ ایتھلیٹ شیئرز مستقبل کی آمدنی کے بدلے ادا کرتے ہیں، ایسکرو اور ویسٹنگ کے تحت۔ فین ٹوکن کسی فیڈریشن کی شائع کردہ سلیٹ سے جُڑے ہوتے ہیں۔ مارخور خود فیس سے کماتا ہے، کسی ٹوکن کی قیمت سے نہیں۔",
    "Can I use it from outside Pakistan?": "کیا میں اسے پاکستان سے باہر استعمال کر سکتا ہوں؟",
    "That's the point. The diaspora wallet is built for the 11 million Pakistanis abroad. It's verified under destination rules (UK FCA, UAE VARA, US FinCEN, Canada FINTRAC), so it works wherever you are.": "یہی تو بات ہے۔ بیرونِ ملک والٹ بیرونِ ملک 1 کروڑ 10 لاکھ پاکستانیوں کے لیے بنایا گیا ہے۔ یہ منزل کے قواعد (برطانیہ FCA، یو اے ای VARA، امریکہ FinCEN، کینیڈا FINTRAC) کے تحت تصدیق شدہ ہے، اس لیے آپ جہاں بھی ہوں یہ کام کرتا ہے۔",
    "Is my money protected?": "کیا میرا پیسہ محفوظ ہے؟",
    "Protection sits in the rail itself: hard issuance caps, mandatory disclosure, cooling-off windows, proceeds held in escrow against milestones, per-person limits, and an insurance pool funded by a small levy on every issuance.": "تحفظ خود نظام میں ہے: سخت اجراء حدیں، لازمی انکشاف، کولنگ-آف کھڑکیاں، سنگِ میل کے بدلے ایسکرو میں رکھی آمدنی، فی فرد حدیں، اور ہر اجراء پر ایک چھوٹے محصول سے چلنے والا انشورنس پول۔",
    "Why a markhor?": "مارخور کیوں؟",
    "The markhor is Pakistan's national animal, the wild goat that climbs the country's highest passes. It's on the coinage and in the mountains. The right mark for an operator meant to take Pakistani culture to the altitude it's owed.": "مارخور پاکستان کا قومی جانور ہے، وہ جنگلی بکرا جو ملک کے بلند ترین دروں پر چڑھتا ہے۔ یہ سکوں پر اور پہاڑوں میں ہے۔ ایک ایسے آپریٹر کے لیے درست نشان جو پاکستانی ثقافت کو اُس بلندی تک لے جانے کے لیے ہے جس کی وہ حقدار ہے۔",
    // closing CTA
    "Be early": "پہلے ہوں", "Own your first piece in two minutes.": "دو منٹ میں اپنا پہلا حصہ خریدیں۔",
    "Create an account, choose how much to put in, and back a federation, an athlete or a royalty — all from one wallet, wherever you are in the world.": "اکاؤنٹ بنائیں، طے کریں کتنا لگانا ہے، اور کسی فیڈریشن، کسی ایتھلیٹ یا کسی رائلٹی کی پشت پناہی کریں — سب ایک ہی والٹ سے، دنیا میں آپ جہاں بھی ہوں۔",
    "Browse markets": "بازار دیکھیں", "backers already in": "بیکرز پہلے سے شامل", "minimum to start": "شروع کرنے کی کم از کم رقم", "ways to own in": "ملکیت کے طریقے",
    "There's a country that builds this,": "ایک ملک ہے جو یہ بناتا ہے،", "and one that watches.": "اور ایک جو دیکھتا رہتا ہے۔",
    "Get your account in early and be there when the markets open.": "اپنا اکاؤنٹ پہلے بنائیں اور جب بازار کھلیں تو موجود ہوں۔",
    "Leave blank:": "خالی چھوڑیں:",
    "No noise. One email when there's something real to show.": "کوئی شور نہیں۔ جب دکھانے کو کچھ حقیقی ہو تو ایک ای میل۔",
    // footer
    "The regulated home for Pakistan's creator and athlete economy. Issued, held, cleared and reported at home, under one rulebook.": "پاکستان کی تخلیق کار اور ایتھلیٹ معیشت کا ریگولیٹڈ گھر۔ وطن میں جاری، محفوظ، کلیئر اور رپورٹ، ایک ہی ضابطے کے تحت۔",
    "Products": "پروڈکٹس", "Company": "کمپنی", "For federations": "فیڈریشنز کے لیے", "Early access": "ابتدائی رسائی", "Trust & legal": "اعتماد اور قانونی",
    "Compliance": "تعمیل", "Risk disclosure": "خطرے کا انکشاف", "Terms of use": "شرائطِ استعمال", "Privacy": "رازداری", "Contact": "رابطہ",
    "© 2026 Markhor · The National Operator, Pakistan": "© 2026 مارخور · دی نیشنل آپریٹر، پاکستان",
    "Under the joint PVARA–SECP sandbox · A Myco Holdings company": "مشترکہ PVARA–SECP سینڈ باکس کے تحت · ایک مائیکو ہولڈنگز کمپنی"
  };

  let nodes = null;
  function collect() {
    const scopes = [document.querySelector("nav"), document.querySelector("#main"), document.querySelector("footer")].filter(Boolean);
    const list = [];
    scopes.forEach(root => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const p = n.parentNode; if (!p) return NodeFilter.FILTER_REJECT;
          if (p.tagName === "SCRIPT" || p.tagName === "STYLE") return NodeFilter.FILTER_REJECT;
          if (p.closest && (p.closest(".mk-app") || p.closest(".mk-ov") || p.closest("[data-lang]"))) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n; while (n = w.nextNode()) list.push({ n: n, en: n.nodeValue });
    });
    return list;
  }
  function apply(l) {
    const ur = l === "ur", de = document.documentElement;
    de.setAttribute("lang", ur ? "ur" : "en"); de.setAttribute("dir", ur ? "rtl" : "ltr"); de.classList.toggle("lang-ur", ur);
    if (!nodes) nodes = collect();
    nodes.forEach(rec => {
      const raw = rec.en, key = raw.replace(/\s+/g, " ").trim();
      if (ur && UR[key] != null) { const lead = (raw.match(/^\s*/) || [""])[0], trail = (raw.match(/\s*$/) || [""])[0]; rec.n.nodeValue = lead + UR[key] + trail; }
      else rec.n.nodeValue = rec.en;
    });
    document.querySelectorAll("[data-lang]").forEach(b => { b.textContent = ur ? "English" : "اردو"; b.setAttribute("aria-label", ur ? "Switch language to English" : "Switch language to Urdu"); });
    try { localStorage.setItem("mk_lang", l); } catch (e) { }
  }
  document.addEventListener("click", e => { const t = e.target.closest("[data-lang]"); if (!t) return; e.preventDefault(); apply(document.documentElement.getAttribute("dir") === "rtl" ? "en" : "ur"); });
  function init() { let l = "en"; try { l = localStorage.getItem("mk_lang") || "en"; } catch (e) { } if (l === "ur") apply("ur"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.MarkhorLang = apply;
})();
