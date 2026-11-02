--
-- PostgreSQL database dump
--

\restrict ghnXX2BXIlZORN6GNsBEtcwaPR6sDRoYnKY9J4NLUKbhXjl7uiw6TNDyeh5R4pF

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, description, category, image_url, price, stock, is_active, created_at) FROM stdin;
1	Premium Wireless Headphones	premium-wireless-headphones	High quality wireless headphones with clear sound.	Electronics	https://images.unsplash.com/photo-1505740420928-5e560c06d30e	12999.00	25	t	2026-11-02 05:59:00.132553-08
2	Smart Watch Pro	smart-watch-pro	Modern smartwatch with fitness tracking.	Electronics	https://images.unsplash.com/photo-1523275335684-37898b6baf30	8999.00	15	t	2026-11-02 05:59:00.132553-08
3	Classic Sneakers	classic-sneakers	Comfortable everyday sneakers.	Fashion	https://images.unsplash.com/photo-1542291026-7eec264c27ff	5999.00	30	t	2026-11-02 05:59:00.132553-08
4	Wireless Bluetooth Speaker	wireless-bluetooth-speaker	Wireless Bluetooth Speaker - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1608043152269-423dbba4e7e1	4999.00	20	t	2026-11-02 06:14:56.505872-08
5	Gaming Headset	gaming-headset	Gaming Headset - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1599669454699-248893623440	6499.00	18	t	2026-11-02 06:14:56.505872-08
6	Mechanical Gaming Keyboard	mechanical-gaming-keyboard	Mechanical Gaming Keyboard - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1587829741301-dc798b83add3	7999.00	15	t	2026-11-02 06:14:56.505872-08
7	Wireless Gaming Mouse	wireless-gaming-mouse	Wireless Gaming Mouse - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1527814050087-3793815479db	3499.00	25	t	2026-11-02 06:14:56.505872-08
8	Laptop Stand	laptop-stand	Laptop Stand - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46	2499.00	30	t	2026-11-02 06:14:56.505872-08
9	Portable Power Bank	portable-power-bank	Portable Power Bank - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5	3999.00	35	t	2026-11-02 06:14:56.505872-08
10	USB-C Fast Charger	usb-c-fast-charger	USB-C Fast Charger - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1583863788434-e58a36330cf0	1999.00	40	t	2026-11-02 06:14:56.505872-08
11	Wireless Earbuds	wireless-earbuds	Wireless Earbuds - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1	5499.00	22	t	2026-11-02 06:14:56.505872-08
12	HD Webcam	hd-webcam	HD Webcam - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1587826080692-f439cd0b70da	5999.00	12	t	2026-11-02 06:14:56.505872-08
13	Smart LED Desk Lamp	smart-led-desk-lamp	Smart LED Desk Lamp - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1507473885765-e6ed057f782c	2999.00	28	t	2026-11-02 06:14:56.505872-08
14	27 Inch Monitor	27-inch-monitor	27 Inch Monitor - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf	42999.00	8	t	2026-11-02 06:14:56.505872-08
15	External SSD 1TB	external-ssd-1tb	External SSD 1TB - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b	18999.00	10	t	2026-11-02 06:14:56.505872-08
16	Wi-Fi Router	wi-fi-router	Wi-Fi Router - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1606904825846-647eb07f5be2	6999.00	16	t	2026-11-02 06:14:56.505872-08
17	Digital Camera	digital-camera	Digital Camera - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1516035069371-29a1b244cc32	54999.00	5	t	2026-11-02 06:14:56.505872-08
18	Tablet Pro	tablet-pro	Tablet Pro - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0	64999.00	7	t	2026-11-02 06:14:56.505872-08
19	Smart Home Security Camera	smart-home-security-camera	Smart Home Security Camera - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1557324232-b8917d3c3dcb	8999.00	14	t	2026-11-02 06:14:56.505872-08
20	USB-C Hub Adapter	usb-c-hub-adapter	USB-C Hub Adapter - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1625842268584-8f3296236761	2999.00	30	t	2026-11-02 06:14:56.505872-08
21	Mini Projector	mini-projector	Mini Projector - quality product from the ShopSphere collection.	Electronics	https://images.unsplash.com/photo-1535016120720-40c646be5580	24999.00	6	t	2026-11-02 06:14:56.505872-08
22	Classic Cotton T-Shirt	classic-cotton-t-shirt	Classic Cotton T-Shirt - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab	1499.00	40	t	2026-11-02 06:14:56.505872-08
23	Men Casual Jacket	men-casual-jacket	Men Casual Jacket - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1551028719-00167b16eac5	4999.00	15	t	2026-11-02 06:14:56.505872-08
24	Denim Jeans	denim-jeans	Denim Jeans - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1542272604-787c3835535d	2999.00	25	t	2026-11-02 06:14:56.505872-08
25	Leather Wallet	leather-wallet	Leather Wallet - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1627123424574-724758594e93	1799.00	30	t	2026-11-02 06:14:56.505872-08
26	Classic Wrist Watch	classic-wrist-watch	Classic Wrist Watch - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1524592094714-0f0654e20314	5999.00	12	t	2026-11-02 06:14:56.505872-08
27	Women Handbag	women-handbag	Women Handbag - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1584917865442-de89df76afd3	3999.00	18	t	2026-11-02 06:14:56.505872-08
28	Running Sports Shoes	running-sports-shoes	Running Sports Shoes - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1460353581641-37baddab0fa2	4499.00	20	t	2026-11-02 06:14:56.505872-08
29	Sunglasses Classic	sunglasses-classic	Sunglasses Classic - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1511499767150-a48a237f0083	1999.00	35	t	2026-11-02 06:14:56.505872-08
30	Leather Belt	leather-belt	Leather Belt - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1624222247344-550fb8e6b2f1	1299.00	40	t	2026-11-02 06:14:56.505872-08
31	Hooded Sweatshirt	hooded-sweatshirt	Hooded Sweatshirt - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1556821840-3a63f95609a7	2799.00	22	t	2026-11-02 06:14:56.505872-08
32	Women Summer Dress	women-summer-dress	Women Summer Dress - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1515372039744-b8f02a3ae446	3499.00	16	t	2026-11-02 06:14:56.505872-08
33	Formal Dress Shirt	formal-dress-shirt	Formal Dress Shirt - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1598033129183-c4f50c736f10	2499.00	20	t	2026-11-02 06:14:56.505872-08
34	Canvas Backpack	canvas-backpack	Canvas Backpack - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1553062407-98eeb64c6a62	3299.00	18	t	2026-11-02 06:14:56.505872-08
35	Winter Wool Scarf	winter-wool-scarf	Winter Wool Scarf - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1601924994987-69e26d50dc26	1199.00	30	t	2026-11-02 06:14:56.505872-08
36	Leather Crossbody Bag	leather-crossbody-bag	Leather Crossbody Bag - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1590874103328-eac38a683ce7	4599.00	12	t	2026-11-02 06:14:56.505872-08
37	Sports Cap	sports-cap	Sports Cap - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1588850561407-ed78c282e89b	999.00	35	t	2026-11-02 06:14:56.505872-08
38	Women Casual Sneakers	women-casual-sneakers	Women Casual Sneakers - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1543163521-1bf539c55dd2	3799.00	20	t	2026-11-02 06:14:56.505872-08
39	Premium Polo Shirt	premium-polo-shirt	Premium Polo Shirt - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1586790170083-2f9ceadc732d	1899.00	28	t	2026-11-02 06:14:56.505872-08
40	Travel Duffel Bag	travel-duffel-bag	Travel Duffel Bag - quality product from the ShopSphere collection.	Fashion	https://images.unsplash.com/photo-1553062407-98eeb64c6a62	3999.00	14	t	2026-11-02 06:14:56.505872-08
41	Modern Table Lamp	modern-table-lamp	Modern Table Lamp - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1507473885765-e6ed057f782c	2999.00	15	t	2026-11-02 06:14:56.505872-08
42	Decorative Wall Clock	decorative-wall-clock	Decorative Wall Clock - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c	2499.00	20	t	2026-11-02 06:14:56.505872-08
43	Ceramic Flower Vase	ceramic-flower-vase	Ceramic Flower Vase - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1578500494198-246f612d3b3d	1599.00	25	t	2026-11-02 06:14:56.505872-08
44	Luxury Cushion Set	luxury-cushion-set	Luxury Cushion Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1584100936595-c0654b55a2e2	1999.00	30	t	2026-11-02 06:14:56.505872-08
45	Modern Coffee Table	modern-coffee-table	Modern Coffee Table - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1499933374294-4584851497cc	12999.00	5	t	2026-11-02 06:14:56.505872-08
46	Cotton Bedsheet Set	cotton-bedsheet-set	Cotton Bedsheet Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1631049307264-da0ec9d70304	3499.00	18	t	2026-11-02 06:14:56.505872-08
47	Minimalist Wall Art	minimalist-wall-art	Minimalist Wall Art - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5	1799.00	22	t	2026-11-02 06:14:56.505872-08
48	Kitchen Storage Jars	kitchen-storage-jars	Kitchen Storage Jars - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1495521821757-a1efb6729352	1299.00	35	t	2026-11-02 06:14:56.505872-08
49	Nonstick Cookware Set	nonstick-cookware-set	Nonstick Cookware Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1556911220-e15b29be8c8f	6999.00	10	t	2026-11-02 06:14:56.505872-08
50	Modern Floor Lamp	modern-floor-lamp	Modern Floor Lamp - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1507473885765-e6ed057f782c	5499.00	8	t	2026-11-02 06:14:56.505872-08
51	Soft Area Rug	soft-area-rug	Soft Area Rug - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1600166898405-da9535204843	5999.00	12	t	2026-11-02 06:14:56.505872-08
52	Wooden Serving Tray	wooden-serving-tray	Wooden Serving Tray - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1603199506016-b9a594b593c0	1499.00	25	t	2026-11-02 06:14:56.505872-08
53	Indoor Plant Pot	indoor-plant-pot	Indoor Plant Pot - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1485955900006-10f4d324d411	899.00	40	t	2026-11-02 06:14:56.505872-08
54	Bathroom Accessory Set	bathroom-accessory-set	Bathroom Accessory Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1620626011761-996317b8d101	2299.00	16	t	2026-11-02 06:14:56.505872-08
55	Elegant Dining Set	elegant-dining-set	Elegant Dining Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1604578762246-41134e37f9cc	8999.00	7	t	2026-11-02 06:14:56.505872-08
56	Decorative Mirror	decorative-mirror	Decorative Mirror - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6	3999.00	11	t	2026-11-02 06:14:56.505872-08
57	Storage Organizer Basket	storage-organizer-basket	Storage Organizer Basket - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1593085260707-5377ba37f868	1199.00	28	t	2026-11-02 06:14:56.505872-08
58	Modern Bookshelf	modern-bookshelf	Modern Bookshelf - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1507842217343-583bb7270b66	10999.00	6	t	2026-11-02 06:14:56.505872-08
59	Scented Candle Set	scented-candle-set	Scented Candle Set - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1603006905003-be475563bc59	999.00	32	t	2026-11-02 06:14:56.505872-08
60	Premium Throw Blanket	premium-throw-blanket	Premium Throw Blanket - quality product from the ShopSphere collection.	Home & Living	https://images.unsplash.com/photo-1600369671236-e74521d4b6ad	2799.00	17	t	2026-11-02 06:14:56.505872-08
61	Hydrating Face Moisturizer	hydrating-face-moisturizer	Hydrating Face Moisturizer - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b	1899.00	25	t	2026-11-02 06:14:56.505872-08
62	Vitamin C Face Serum	vitamin-c-face-serum	Vitamin C Face Serum - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19	2499.00	18	t	2026-11-02 06:14:56.505872-08
63	Gentle Face Cleanser	gentle-face-cleanser	Gentle Face Cleanser - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8	1299.00	30	t	2026-11-02 06:14:56.505872-08
64	Daily Sunscreen SPF 50	daily-sunscreen-spf-50	Daily Sunscreen SPF 50 - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1556228720-195a672e8a03	1799.00	28	t	2026-11-02 06:14:56.505872-08
65	Rose Water Toner	rose-water-toner	Rose Water Toner - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19	999.00	35	t	2026-11-02 06:14:56.505872-08
66	Matte Lipstick Set	matte-lipstick-set	Matte Lipstick Set - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1586495777744-4413f21062fa	2199.00	20	t	2026-11-02 06:14:56.505872-08
67	Professional Makeup Brush Set	professional-makeup-brush-set	Professional Makeup Brush Set - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9	1999.00	16	t	2026-11-02 06:14:56.505872-08
68	Nourishing Hair Oil	nourishing-hair-oil	Nourishing Hair Oil - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1608571423902-eed4a5ad8108	899.00	40	t	2026-11-02 06:14:56.505872-08
69	Repairing Hair Shampoo	repairing-hair-shampoo	Repairing Hair Shampoo - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b	1199.00	32	t	2026-11-02 06:14:56.505872-08
71	Body Lotion	body-lotion	Body Lotion - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b	1399.00	25	t	2026-11-02 06:14:56.505872-08
72	Exfoliating Face Scrub	exfoliating-face-scrub	Exfoliating Face Scrub - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8	1099.00	22	t	2026-11-02 06:14:56.505872-08
73	Under Eye Cream	under-eye-cream	Under Eye Cream - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a	1599.00	18	t	2026-11-02 06:14:56.505872-08
74	Nail Polish Collection	nail-polish-collection	Nail Polish Collection - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1632345031435-8727f6897d53	1499.00	24	t	2026-11-02 06:14:56.505872-08
75	Makeup Foundation	makeup-foundation	Makeup Foundation - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1631214540242-4e6b8b4b5a5e	2299.00	15	t	2026-11-02 06:14:56.505872-08
76	Beauty Blender Set	beauty-blender-set	Beauty Blender Set - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9	799.00	35	t	2026-11-02 06:14:56.505872-08
77	Facial Sheet Mask Pack	facial-sheet-mask-pack	Facial Sheet Mask Pack - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1570172619644-dfd03ed5d881	699.00	40	t	2026-11-02 06:14:56.505872-08
79	Makeup Organizer	makeup-organizer	Makeup Organizer - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1596462502278-27bfdc403348	1799.00	20	t	2026-11-02 06:14:56.505872-08
78	Hair Styling Dryer	hair-styling-dryer	Hair Styling Dryer - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1522338140262-f46f5913618a	4999.00	8	t	2026-11-02 06:14:56.505872-08
80	Hand & Nail Cream	hand-nail-cream	Hand & Nail Cream - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b	899.00	27	t	2026-11-02 06:14:56.505872-08
70	Luxury Perfume	luxury-perfume	Luxury Perfume - quality product from the ShopSphere collection.	Beauty	https://images.unsplash.com/photo-1541643600914-78b084683601	3999.00	10	t	2026-11-02 06:14:56.505872-08
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 80, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ghnXX2BXIlZORN6GNsBEtcwaPR6sDRoYnKY9J4NLUKbhXjl7uiw6TNDyeh5R4pF

