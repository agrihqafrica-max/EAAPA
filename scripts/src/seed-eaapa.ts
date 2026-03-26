import { db } from "@workspace/db";
import {
  membersTable, connectionsTable,
  commoditiesTable, priceHistoryTable, buyersTable, marketAlertsTable,
  opportunitiesTable, projectsTable, forumThreadsTable,
  eventsTable, resourcesTable, successStoriesTable, mentorsTable, knowledgeTable,
  companiesTable, businessProfilesTable, clustersTable, satelliteCentresTable, locationsTable, partnershipsTable,
  countriesTable, regionsTable, countiesTable,
  farmPlotsTable, productionRecordsTable, inputUsageTable, varietiesTable, seasonalCyclesTable, commodityCategoriesTable,
  tradeListingsTable, ordersTable, orderItemsTable, contractsTable, bulkRequestsTable,
  warehousesTable, shipmentsTable, inventoryTable, logisticsProvidersTable,
  investmentsTable, grantsTable, loansTable, fundingRoundsTable, fundingApplicationsTable,
  trainingProgramsTable, trainingModulesTable, programEnrollmentsTable, mentorshipMatchesTable, certificationsTable, userCertificationsTable,
  dashboardsTable, dashboardWidgetsTable, kpisTable, reportsTable, impactMetricsTable, priceTrendsTable, demandSignalsTable,
  announcementsTable, newsTable, blogArticlesTable, caseStudiesTable, testimonialsTable, faqsTable,
  aiOpportunitiesTable, aiRecommendationsTable, predictionModelsTable, signalsTable,
  notificationsTable, conversationsTable,
  featureFlagsTable, systemSettingsTable,
  rolesTable, accessCodesTable,
  disputesTable, licensesTable,
  campaignsTable, leadsTable,
} from "@workspace/db";

async function seed() {
  console.log("🌱 Seeding EAAPA full production database...");

  // ========== ROLES ==========
  console.log("Adding roles...");
  await db.insert(rolesTable).values([
    { name: "admin", description: "Platform administrator", isSystem: true },
    { name: "agripreneur", description: "Agricultural entrepreneur", isSystem: true },
    { name: "investor", description: "Impact investor", isSystem: true },
    { name: "mentor", description: "Business mentor", isSystem: true },
    { name: "partner", description: "Strategic partner", isSystem: true },
    { name: "company", description: "Agribusiness company", isSystem: true },
    { name: "buyer", description: "Commodity buyer", isSystem: true },
  ]).onConflictDoNothing();

  // ========== ACCESS CODES ==========
  console.log("Adding access codes...");
  await db.insert(accessCodesTable).values([
    { code: "1234", module: "market_hub", description: "Default executive PIN for Market Hub", isActive: true, maxUsage: null },
    { code: "0000", module: "market_hub", description: "Demo access PIN", isActive: true, maxUsage: 100 },
    { code: "EAAPA2025", module: "accelerator", description: "2025 Accelerator program enrollment code", isActive: true, maxUsage: 50 },
    { code: "INVEST24", module: "investment_room", description: "Investor data room access", isActive: true, maxUsage: 20 },
    { code: "MENTOR25", module: "mentor_portal", description: "Mentor portal access code", isActive: true, maxUsage: 30 },
  ]).onConflictDoNothing();

  // ========== GEOGRAPHY ==========
  console.log("Adding geography...");
  const countryIds = await db.insert(countriesTable).values([
    { name: "Kenya", code: "KE", continent: "Africa", currency: "Kenyan Shilling", currencyCode: "KES", dialCode: "+254", flagEmoji: "🇰🇪", isEastAfrica: true },
    { name: "Uganda", code: "UG", continent: "Africa", currency: "Ugandan Shilling", currencyCode: "UGX", dialCode: "+256", flagEmoji: "🇺🇬", isEastAfrica: true },
    { name: "Tanzania", code: "TZ", continent: "Africa", currency: "Tanzanian Shilling", currencyCode: "TZS", dialCode: "+255", flagEmoji: "🇹🇿", isEastAfrica: true },
    { name: "Rwanda", code: "RW", continent: "Africa", currency: "Rwandan Franc", currencyCode: "RWF", dialCode: "+250", flagEmoji: "🇷🇼", isEastAfrica: true },
    { name: "Ethiopia", code: "ET", continent: "Africa", currency: "Ethiopian Birr", currencyCode: "ETB", dialCode: "+251", flagEmoji: "🇪🇹", isEastAfrica: true },
    { name: "Burundi", code: "BI", continent: "Africa", currency: "Burundian Franc", currencyCode: "BIF", dialCode: "+257", flagEmoji: "🇧🇮", isEastAfrica: true },
    { name: "South Sudan", code: "SS", continent: "Africa", currency: "South Sudanese Pound", currencyCode: "SSP", dialCode: "+211", flagEmoji: "🇸🇸", isEastAfrica: true },
    { name: "DR Congo", code: "CD", continent: "Africa", currency: "Congolese Franc", currencyCode: "CDF", dialCode: "+243", flagEmoji: "🇨🇩", isEastAfrica: false },
  ]).returning({ id: countriesTable.id }).onConflictDoNothing();

  if (countryIds.length > 0) {
    const kenyaId = countryIds[0].id;
    const ugandaId = countryIds[1]?.id;
    const tanzId = countryIds[2]?.id;
    const rwandaId = countryIds[3]?.id;
    const ethId = countryIds[4]?.id;

    const regionIds = await db.insert(regionsTable).values([
      { name: "Nairobi", countryId: kenyaId, code: "NAI", type: "county", isAgricultural: false, mainCommodities: "Urban distribution" },
      { name: "Central Kenya", countryId: kenyaId, code: "CEN", type: "region", isAgricultural: true, mainCommodities: "Avocado, Coffee, French Beans" },
      { name: "Rift Valley", countryId: kenyaId, code: "RVP", type: "region", isAgricultural: true, mainCommodities: "Dairy, Wheat, Maize" },
      { name: "Kericho", countryId: kenyaId, code: "KER", type: "county", isAgricultural: true, mainCommodities: "Tea" },
      { name: "Naivasha", countryId: kenyaId, code: "NAV", type: "district", isAgricultural: true, mainCommodities: "Flowers, French Beans" },
      { name: "Mt. Kenya", countryId: kenyaId, code: "MTK", type: "region", isAgricultural: true, mainCommodities: "Macadamia, Coffee, Dairy" },
      { name: "Coastal Kenya", countryId: kenyaId, code: "CST", type: "region", isAgricultural: true, mainCommodities: "Vanilla, Cashew, Coconut" },
      { name: "Western Kenya", countryId: kenyaId, code: "WES", type: "region", isAgricultural: true, mainCommodities: "Maize, Sugar, Sorghum" },
      { name: "Lake Victoria Basin", countryId: kenyaId, code: "LVB", type: "region", isAgricultural: true, mainCommodities: "Fish, Rice, Sugarcane" },
      ...(ugandaId ? [
        { name: "Central Uganda", countryId: ugandaId, code: "CUG", type: "region", isAgricultural: true, mainCommodities: "Maize, Banana, Coffee" },
        { name: "Western Uganda", countryId: ugandaId, code: "WUG", type: "region", isAgricultural: true, mainCommodities: "Tea, Coffee, Dairy" },
      ] : []),
      ...(tanzId ? [
        { name: "Northern Tanzania", countryId: tanzId, code: "NTZ", type: "region", isAgricultural: true, mainCommodities: "Coffee, Maize, Sisal" },
        { name: "Kilimanjaro", countryId: tanzId, code: "KLJ", type: "region", isAgricultural: true, mainCommodities: "Coffee, Banana" },
      ] : []),
      ...(rwandaId ? [
        { name: "Kigali", countryId: rwandaId, code: "KGL", type: "province", isAgricultural: false, mainCommodities: "Services, Processing" },
        { name: "Southern Rwanda", countryId: rwandaId, code: "SRW", type: "province", isAgricultural: true, mainCommodities: "Coffee, Tea" },
      ] : []),
      ...(ethId ? [
        { name: "Addis Ababa", countryId: ethId, code: "ADD", type: "city", isAgricultural: false, mainCommodities: "Flowers, Processing" },
        { name: "Oromia", countryId: ethId, code: "ORM", type: "region", isAgricultural: true, mainCommodities: "Coffee, Teff, Sesame" },
      ] : []),
    ]).returning({ id: regionsTable.id }).onConflictDoNothing();

    if (regionIds.length > 0 && regionIds[1]) {
      await db.insert(countiesTable).values([
        { name: "Kiambu", regionId: regionIds[1].id, code: "KBU", headquarters: "Kiambu Town" },
        { name: "Murang'a", regionId: regionIds[1].id, code: "MRA", headquarters: "Murang'a Town" },
        { name: "Nyeri", regionId: regionIds[1].id, code: "NYR", headquarters: "Nyeri Town" },
        { name: "Nakuru", regionId: regionIds[2]?.id || regionIds[0].id, code: "NKR", headquarters: "Nakuru City" },
        { name: "Uasin Gishu", regionId: regionIds[2]?.id || regionIds[0].id, code: "UGI", headquarters: "Eldoret" },
      ]).onConflictDoNothing();
    }
  }

  // ========== MEMBERS (original) ==========
  console.log("Adding members...");
  await db.insert(membersTable).values([
    { name: "Amara Nkosi", role: "agripreneur", sector: "Horticulture", region: "Central Kenya", country: "Kenya", commodity: "Avocado", businessType: "Export Farming", bio: "Leading avocado farmer with 200 acres under cultivation, exporting to EU markets.", isVerified: true, revenueUsd: "480000", jobsCreated: 85, yieldTons: "1200", growthPercent: "32" },
    { name: "David Ochieng", role: "agripreneur", sector: "Dairy", region: "Rift Valley", country: "Kenya", commodity: "Milk", businessType: "Dairy Processing", bio: "Pioneering dairy farmer running a processing cooperative with 300 members.", isVerified: true, revenueUsd: "320000", jobsCreated: 120, yieldTons: "800", growthPercent: "28" },
    { name: "Grace Atuhaire", role: "agripreneur", sector: "Horticulture", region: "Central Uganda", country: "Uganda", commodity: "Banana", businessType: "Processing & Export", bio: "Banana processing entrepreneur connecting smallholder farmers to export markets.", isVerified: true, revenueUsd: "195000", jobsCreated: 45, yieldTons: "600", growthPercent: "41" },
    { name: "Samuel Kariuki", role: "investor", sector: "Agribusiness", region: "Nairobi", country: "Kenya", commodity: "Multiple", businessType: "Venture Capital", bio: "Impact investor focused on agricultural transformation across East Africa.", isVerified: true, revenueUsd: "0", jobsCreated: 0 },
    { name: "Fatuma Hassan", role: "mentor", sector: "Export Markets", region: "Mombasa", country: "Kenya", commodity: "Macadamia", businessType: "Consultancy", bio: "20 years experience in agricultural export trade and market development.", isVerified: true, revenueUsd: "150000", jobsCreated: 12 },
    { name: "Jean-Pierre Nziza", role: "agripreneur", sector: "Coffee", region: "Kigali", country: "Rwanda", commodity: "Coffee", businessType: "Specialty Coffee", bio: "Specialty coffee producer selling direct to European and North American buyers.", isVerified: true, revenueUsd: "280000", jobsCreated: 38, yieldTons: "45", growthPercent: "55" },
    { name: "Tigist Bekele", role: "agripreneur", sector: "Floriculture", region: "Addis Ababa", country: "Ethiopia", commodity: "Flowers", businessType: "Cut Flower Export", bio: "Ethiopia's rising star in floriculture, supplying premium cut flowers to Europe.", isVerified: true, revenueUsd: "395000", jobsCreated: 210, growthPercent: "67" },
    { name: "Moses Wanjala", role: "agripreneur", sector: "Cereals", region: "Western Kenya", country: "Kenya", commodity: "Maize", businessType: "Grain Trading", bio: "Grain aggregator connecting 500+ smallholder farmers to national food processors.", isVerified: false, revenueUsd: "125000", jobsCreated: 22, yieldTons: "2000", growthPercent: "18" },
    { name: "Immaculate Nakitto", role: "partner", sector: "Finance", region: "Kampala", country: "Uganda", commodity: "Multiple", businessType: "Microfinance", bio: "Agri-microfinance specialist providing working capital to smallholder farmers.", isVerified: true, revenueUsd: "0", jobsCreated: 0 },
    { name: "Charles Mutua", role: "agripreneur", sector: "Aquaculture", region: "Lake Victoria Basin", country: "Kenya", commodity: "Fish", businessType: "Fish Farming", bio: "Tilapia and catfish farmer scaling up cage aquaculture on Lake Victoria.", isVerified: true, revenueUsd: "98000", jobsCreated: 30, yieldTons: "85", growthPercent: "45" },
    { name: "Asha Daud", role: "agripreneur", sector: "Spices", region: "Coastal Kenya", country: "Kenya", commodity: "Vanilla", businessType: "Specialty Crops", bio: "Premium vanilla cultivator supplying international food and fragrance companies.", isVerified: true, revenueUsd: "220000", jobsCreated: 18, growthPercent: "89" },
    { name: "Hassan Abdi", role: "investor", sector: "Infrastructure", region: "Nairobi", country: "Kenya", commodity: "Multiple", businessType: "Private Equity", bio: "Infrastructure investor focusing on cold chain and post-harvest loss reduction.", isVerified: true, revenueUsd: "0", jobsCreated: 0 },
    { name: "Zawadi Mwangi", role: "agripreneur", sector: "Macadamia", region: "Mt. Kenya", country: "Kenya", commodity: "Macadamia", businessType: "Nut Processing", bio: "Macadamia nut processor with EU and US export certifications.", isVerified: true, revenueUsd: "340000", jobsCreated: 65, yieldTons: "180", growthPercent: "38" },
    { name: "Benedicte Uwimana", role: "mentor", sector: "Agri-Finance", region: "Kigali", country: "Rwanda", commodity: "Coffee", businessType: "Financial Advisory", bio: "Coffee cooperative development expert with World Bank and UN FAO experience.", isVerified: true, revenueUsd: "0", jobsCreated: 0 },
    { name: "Peter Kamau", role: "company", sector: "AgriTech", region: "Nairobi", country: "Kenya", commodity: "Multiple", businessType: "Technology Platform", bio: "Co-founder of an AI-powered precision agriculture platform serving 10,000+ farmers.", isVerified: true, revenueUsd: "1200000", jobsCreated: 48 },
  ]).onConflictDoNothing();

  // ========== COMPANIES ==========
  console.log("Adding companies...");
  const companyIds = await db.insert(companiesTable).values([
    { name: "AgroVision Kenya Ltd", type: "agribusiness", description: "East Africa's leading agribusiness platform connecting farmers to markets", country: "Kenya", region: "Nairobi", city: "Nairobi", yearFounded: 2018, employeeCount: 145, annualRevenueUsd: "8500000", commodities: ["Avocado", "Coffee", "Macadamia"], certifications: ["ISO 9001", "GlobalGAP"], isVerified: true, isFeatured: true },
    { name: "Rift Valley Dairy Cooperative", type: "cooperative", description: "Dairy cooperative with 2,400 smallholder farmer members", country: "Kenya", region: "Rift Valley", city: "Nakuru", yearFounded: 2005, employeeCount: 68, annualRevenueUsd: "12000000", commodities: ["Milk", "Cheese", "Yoghurt"], certifications: ["KDB Licensed", "KEBS"], isVerified: true },
    { name: "Great Lakes Coffee Exporters", type: "exporter", description: "Specialty coffee exporter sourcing from Rwanda, Uganda, Kenya and Ethiopia", country: "Rwanda", region: "Kigali", city: "Kigali", yearFounded: 2012, employeeCount: 32, annualRevenueUsd: "4200000", commodities: ["Coffee"], certifications: ["Fair Trade", "Rainforest Alliance"], isVerified: true, isFeatured: true },
    { name: "EastAfrica Fresh Logistics", type: "logistics", description: "Cold chain and fresh produce logistics specialist serving the region", country: "Kenya", region: "Nairobi", city: "Nairobi", yearFounded: 2016, employeeCount: 220, annualRevenueUsd: "6800000", commodities: ["Flowers", "Avocado", "French Beans"], certifications: ["ISO 22000", "HACCP"], isVerified: true },
    { name: "Nile Basin AgriFinance", type: "fintech", description: "Digital agriculture finance platform serving smallholders", country: "Uganda", region: "Kampala", city: "Kampala", yearFounded: 2019, employeeCount: 55, annualRevenueUsd: "2100000", commodities: ["Multiple"], certifications: ["Bank of Uganda Licensed"], isVerified: true },
    { name: "Kilimanjaro Coffee Processors", type: "processor", description: "Premium coffee processing facility near Kilimanjaro National Park", country: "Tanzania", region: "Kilimanjaro", city: "Moshi", yearFounded: 2008, employeeCount: 89, annualRevenueUsd: "3500000", commodities: ["Coffee"], certifications: ["UTZ", "Organic EU"], isVerified: true },
    { name: "Naivasha Flower Growers Association", type: "cooperative", description: "Association of 180 flower growers in Naivasha supplying Dutch auction", country: "Kenya", region: "Naivasha", city: "Naivasha", yearFounded: 2003, employeeCount: 1200, annualRevenueUsd: "28000000", commodities: ["Flowers"], certifications: ["MPS-SQ", "Fairtrade", "FloraHolland"], isVerified: true, isFeatured: true },
  ]).returning({ id: companiesTable.id }).onConflictDoNothing();

  if (companyIds.length > 0) {
    await db.insert(businessProfilesTable).values([
      { companyId: companyIds[0].id, missionStatement: "To connect every East African farmer to global markets", visionStatement: "A thriving agricultural ecosystem from farm to fork", keyProducts: ["Market Intelligence Platform", "Farmer Network App", "Export Facilitation"], targetMarkets: ["EU", "Middle East", "USA", "Local"], exportMarkets: ["Netherlands", "Germany", "UAE"], uniqueValueProp: "AI-powered market intelligence with on-ground networks" },
      { companyId: companyIds[1].id, missionStatement: "Improving livelihoods of dairy farmers through cooperative power", visionStatement: "The leading dairy cooperative in East Africa", keyProducts: ["Fresh Milk", "UHT Milk", "Cheese", "Yoghurt"], targetMarkets: ["Kenya Domestic", "Uganda"], uniqueValueProp: "Lowest cost processing with farmer-first profit-sharing" },
    ]).onConflictDoNothing();
  }

  // ========== SATELLITE CENTRES ==========
  console.log("Adding satellite centres...");
  await db.insert(satelliteCentresTable).values([
    { name: "EAAPA Nairobi HQ", code: "NBI-HQ", type: "headquarters", address: "Karen Business Park, Karen", city: "Nairobi", region: "Nairobi", country: "Kenya", managerName: "Dr. Alice Mwangi", managerPhone: "+254722000001", managerEmail: "nairobi@eaapa.org", services: ["Market Intelligence", "Training", "Investor Matchmaking", "Export Facilitation"], memberCount: 1240, isActive: true, lat: "-1.3182", lng: "36.7163" },
    { name: "EAAPA Nakuru Centre", code: "NKR-01", type: "regional", address: "Westside Mall, Kenyatta Avenue", city: "Nakuru", region: "Rift Valley", country: "Kenya", managerName: "James Korir", managerPhone: "+254722000002", managerEmail: "nakuru@eaapa.org", services: ["Farmer Training", "Market Linkage", "Cooperative Support"], memberCount: 680, isActive: true, lat: "-0.3031", lng: "36.0800" },
    { name: "EAAPA Mombasa Centre", code: "MSA-01", type: "regional", address: "Nyali Centre, Nyali", city: "Mombasa", region: "Coastal Kenya", country: "Kenya", managerName: "Said Omar", managerPhone: "+254722000003", managerEmail: "mombasa@eaapa.org", services: ["Export Documentation", "Port Clearance", "Market Intelligence"], memberCount: 290, isActive: true, lat: "-4.0435", lng: "39.6682" },
    { name: "EAAPA Kampala Office", code: "KLA-01", type: "regional", address: "Nakasero Business Park, Nakasero", city: "Kampala", region: "Central Uganda", country: "Uganda", managerName: "Rebecca Namukasa", managerPhone: "+256772000001", managerEmail: "kampala@eaapa.org", services: ["Farmer Network", "Training", "Market Data"], memberCount: 520, isActive: true, lat: "0.3476", lng: "32.5825" },
    { name: "EAAPA Kigali Office", code: "KGL-01", type: "regional", address: "KG 7 Ave, Kigali Business Centre", city: "Kigali", region: "Kigali", country: "Rwanda", managerName: "Florent Habimana", managerPhone: "+250788000001", managerEmail: "kigali@eaapa.org", services: ["Coffee Export Support", "Training", "Impact Reporting"], memberCount: 380, isActive: true, lat: "-1.9441", lng: "30.0619" },
    { name: "EAAPA Dar es Salaam Office", code: "DAR-01", type: "regional", address: "Mikocheni Business Park, Mikocheni", city: "Dar es Salaam", region: "Northern Tanzania", country: "Tanzania", managerName: "Zawadi Salehe", managerPhone: "+255754000001", managerEmail: "dar@eaapa.org", services: ["Export Facilitation", "Market Intelligence", "Farmer Network"], memberCount: 340, isActive: true, lat: "-6.7924", lng: "39.2083" },
  ]).onConflictDoNothing();

  // ========== LOCATIONS (EAAPA OFFICES) ==========
  console.log("Adding locations...");
  await db.insert(locationsTable).values([
    { name: "EAAPA Headquarters", type: "headquarters", address: "Karen Business Park, Karen Road", city: "Nairobi", region: "Nairobi", country: "Kenya", phone: "+254 20 2000001", email: "hq@eaapa.org", isHeadquarters: true, lat: "-1.3182", lng: "36.7163" },
    { name: "Nakuru Branch Office", type: "office", address: "Westside Mall, Kenyatta Avenue", city: "Nakuru", region: "Rift Valley", country: "Kenya", phone: "+254 51 2000002", email: "nakuru@eaapa.org", isHeadquarters: false, lat: "-0.3031", lng: "36.0800" },
    { name: "Mombasa Branch Office", type: "office", address: "Nyali Centre, Links Road, Nyali", city: "Mombasa", region: "Coastal Kenya", country: "Kenya", phone: "+254 41 2000003", email: "mombasa@eaapa.org", isHeadquarters: false, lat: "-4.0435", lng: "39.6682" },
  ]).onConflictDoNothing();

  // ========== CLUSTERS ==========
  console.log("Adding clusters...");
  await db.insert(clustersTable).values([
    { name: "Central Kenya Avocado Cluster", description: "Premier avocado growing cluster across Muranga, Kiambu, and Nyeri counties", commodity: "Avocado", region: "Central Kenya", country: "Kenya", status: "active", memberCount: 480, leadOrganization: "AgroVision Kenya Ltd", annualOutputTons: "28000" },
    { name: "Rift Valley Dairy Cluster", description: "Dairy production cluster connecting 1,200 households in the Rift Valley", commodity: "Milk", region: "Rift Valley", country: "Kenya", status: "active", memberCount: 1200, leadOrganization: "Rift Valley Dairy Cooperative", annualOutputTons: "180000" },
    { name: "Kericho Tea Cluster", description: "KTDA-organized tea growers with factory collection network", commodity: "Tea", region: "Kericho", country: "Kenya", status: "active", memberCount: 3400, leadOrganization: "KTDA", annualOutputTons: "42000" },
    { name: "Rwanda Coffee Cooperative Cluster", description: "Specialty coffee washing station network across Southern and Western Rwanda", commodity: "Coffee", region: "Kigali", country: "Rwanda", status: "active", memberCount: 860, leadOrganization: "Great Lakes Coffee Exporters", annualOutputTons: "8500" },
    { name: "Naivasha Floriculture Cluster", description: "Integrated flower growing cluster supplying FloraHolland through Nairobi hub", commodity: "Flowers", region: "Naivasha", country: "Kenya", status: "active", memberCount: 180, leadOrganization: "Naivasha Flower Growers Association", annualOutputTons: "24000" },
    { name: "Lake Victoria Aquaculture Cluster", description: "Cage aquaculture cluster on Lake Victoria supplying regional supermarkets", commodity: "Fish", region: "Lake Victoria Basin", country: "Kenya", status: "forming", memberCount: 95, leadOrganization: "Lake Victoria Aquaculture Association", annualOutputTons: "1800" },
  ]).onConflictDoNothing();

  // ========== PARTNERSHIPS ==========
  await db.insert(partnershipsTable).values([
    { organizationA: "EAAPA", organizationB: "USAID East Africa", type: "financial", description: "5-year agricultural transformation program grant", startDate: new Date("2023-01-01"), isActive: true },
    { organizationA: "EAAPA", organizationB: "World Bank Group", type: "strategic", description: "IFC agribusiness investment facilitation partnership", startDate: new Date("2022-06-01"), isActive: true },
    { organizationA: "EAAPA", organizationB: "FAO Kenya", type: "technical", description: "Food security and market systems technical assistance", startDate: new Date("2021-03-01"), isActive: true },
    { organizationA: "EAAPA", organizationB: "KCB Bank Kenya", type: "financial", description: "Agri-credit facility for EAAPA members at preferential rates", startDate: new Date("2023-09-01"), isActive: true },
    { organizationA: "EAAPA", organizationB: "Safaricom PLC", type: "technical", description: "M-PESA payment integration and digital wallet for farmers", startDate: new Date("2024-01-01"), isActive: true },
  ]).onConflictDoNothing();

  // ========== COMMODITIES (original) ==========
  console.log("Adding commodities...");
  const commodityIds = await db.insert(commoditiesTable).values([
    { name: "Avocado (Hass)", category: "Horticulture", avgPrice: "180", currency: "KES", demandLevel: "Very High", marketSizeUsd: "450000000", topBuyers: ["Greenyard NL", "Dole UK", "METRO AG", "Albert Heijn"], trend: "up", marketHealth: "Green", region: "Central Kenya", isExport: true, isOrganic: false, priceChange7d: "4.2", priceChange30d: "12.8", globalPrice: "850", demandGrowthPercent: "18", importRegions: ["Netherlands", "Germany", "France", "UK"], exportRegions: ["Kenya", "Ethiopia", "Uganda"], variety: "Hass", qualityStandards: ["GlobalGAP", "Grade A min 180g"], packaging: ["4.5kg Box", "Bulk Pallet"], certifications: ["GlobalGAP", "Tesco Nurture", "Organic EU"], exportRequirements: ["Phytosanitary Certificate", "KEPHIS Inspection", "COO"], tonsPerYear: "280000", exportRoutes: ["Nairobi → Schiphol", "Mombasa → Rotterdam", "Nairobi → Dubai → EU"], avgDeliveryDays: 5, costPerTon: "320", opportunityScore: 94, suggestedAcreage: "50", yieldProjectionTons: "180", revenueProjectionUsd: "95000" },
    { name: "Coffee (Arabica)", category: "Beverages", avgPrice: "950", currency: "KES", demandLevel: "High", marketSizeUsd: "320000000", topBuyers: ["Starbucks", "Nespresso", "Lavazza", "JDE Peet's"], trend: "up", marketHealth: "Green", region: "Central Kenya", isExport: true, isOrganic: true, priceChange7d: "2.1", priceChange30d: "8.5", globalPrice: "4800", demandGrowthPercent: "12", importRegions: ["USA", "Germany", "Japan", "Italy"], exportRegions: ["Kenya", "Ethiopia", "Rwanda", "Uganda"], variety: "SL28 / SL34", qualityStandards: ["Grade AA", "Cup score 85+"], packaging: ["60kg GrainPro Bags", "Vacuum Sealed Specialty"], certifications: ["Fair Trade", "Organic", "Rainforest Alliance"], exportRequirements: ["Coffee Board License", "Export Certificate", "Quality Certificate"], tonsPerYear: "45000", exportRoutes: ["Nairobi → Hamburg", "Mombasa → Southampton"], avgDeliveryDays: 28, costPerTon: "280", opportunityScore: 88, suggestedAcreage: "20", yieldProjectionTons: "15", revenueProjectionUsd: "120000" },
    { name: "Macadamia", category: "Tree Nuts", avgPrice: "680", currency: "KES", demandLevel: "Very High", marketSizeUsd: "180000000", topBuyers: ["Mauna Loa", "Nuti Free", "Happyway", "Bioprogreen"], trend: "up", marketHealth: "Green", region: "Mt. Kenya", isExport: true, isOrganic: false, priceChange7d: "3.8", priceChange30d: "15.2", globalPrice: "3200", demandGrowthPercent: "22", importRegions: ["China", "USA", "Germany", "Japan"], exportRegions: ["Kenya", "Tanzania", "Malawi"], variety: "DUDH / KRG", qualityStandards: ["Grade 0 / 1 / 2", "Min 34% NIS"], packaging: ["25kg PP Bags", "Kernel Vacuum"], certifications: ["KEPHIS", "FDA Registered", "GlobalGAP"], exportRequirements: ["Phytosanitary", "Fumigation Certificate", "COO"], tonsPerYear: "58000", exportRoutes: ["Nairobi → Shanghai", "Mombasa → Los Angeles"], avgDeliveryDays: 21, costPerTon: "380", opportunityScore: 91, suggestedAcreage: "30", yieldProjectionTons: "25", revenueProjectionUsd: "135000" },
    { name: "Fresh Milk", category: "Dairy", avgPrice: "55", currency: "KES", demandLevel: "High", marketSizeUsd: "820000000", topBuyers: ["Brookside", "New KCC", "Daima Foods", "Tuzo"], trend: "stable", marketHealth: "Yellow", region: "Rift Valley", isExport: false, isOrganic: false, priceChange7d: "0.5", priceChange30d: "2.1", globalPrice: "65", demandGrowthPercent: "6", importRegions: ["Kenya (Domestic)"], exportRegions: ["Kenya", "Uganda"], variety: "Friesian / Ayrshire", qualityStandards: ["TBC <50K", "Fat 3.5%+"], packaging: ["20L Can", "1L Sachets", "UHT Carton"], certifications: ["KEBS", "KDB License"], exportRequirements: ["Health Certificate", "KDB Export Permit"], tonsPerYear: "4200000", exportRoutes: ["Nairobi Distribution", "Mombasa Coastal"], avgDeliveryDays: 1, costPerTon: "55", opportunityScore: 72, suggestedAcreage: "5", yieldProjectionTons: "18", revenueProjectionUsd: "42000" },
    { name: "French Beans", category: "Horticulture", avgPrice: "140", currency: "KES", demandLevel: "High", marketSizeUsd: "95000000", topBuyers: ["Tesco UK", "Sainsbury's", "Carrefour FR", "SPAR"], trend: "stable", marketHealth: "Green", region: "Central Kenya", isExport: true, isOrganic: false, priceChange7d: "-1.2", priceChange30d: "3.4", globalPrice: "580", demandGrowthPercent: "8", importRegions: ["UK", "France", "Netherlands", "Germany"], exportRegions: ["Kenya", "Zimbabwe"], variety: "Amy / Serengeti / Climax", qualityStandards: ["Grade A 4-8mm diameter", "Max 12cm length"], packaging: ["100g Retail Pack", "5kg Bulk Box"], certifications: ["GlobalGAP", "Tesco Nurture", "LEAF"], exportRequirements: ["Phytosanitary", "Maximum Residue Level Test", "COO"], tonsPerYear: "22000", exportRoutes: ["Nairobi → Heathrow", "Nairobi → Paris CDG"], avgDeliveryDays: 3, costPerTon: "420", opportunityScore: 79, suggestedAcreage: "10", yieldProjectionTons: "32", revenueProjectionUsd: "58000" },
    { name: "Maize", category: "Cereals", avgPrice: "38", currency: "KES", demandLevel: "High", marketSizeUsd: "1200000000", topBuyers: ["UNGA Group", "East Africa Grains", "WFP", "Kenya Breweries"], trend: "up", marketHealth: "Yellow", region: "Western Kenya", isExport: false, isOrganic: false, priceChange7d: "1.8", priceChange30d: "6.2", globalPrice: "180", demandGrowthPercent: "4", importRegions: ["Kenya (Domestic)", "Uganda", "Tanzania"], exportRegions: ["Kenya", "Uganda", "Tanzania"], variety: "H614D / KSTP94", qualityStandards: ["Max 13.5% moisture", "EAS 40"], packaging: ["90kg Bags", "Bulk Trucks"], certifications: ["KEBS EAS 40", "NCPB Grading"], exportRequirements: ["NCPB Export Permit", "Phytosanitary Certificate"], tonsPerYear: "3500000", exportRoutes: ["Nairobi → Kampala", "Kisumu → Dar es Salaam"], avgDeliveryDays: 3, costPerTon: "45", opportunityScore: 65, suggestedAcreage: "100", yieldProjectionTons: "500", revenueProjectionUsd: "38000" },
    { name: "Tea (Black)", category: "Beverages", avgPrice: "280", currency: "KES", demandLevel: "High", marketSizeUsd: "650000000", topBuyers: ["Unilever", "Twinings", "Ahmad Tea", "Mombasa Tea Auction"], trend: "stable", marketHealth: "Green", region: "Kericho", isExport: true, isOrganic: false, priceChange7d: "0.3", priceChange30d: "1.9", globalPrice: "2200", demandGrowthPercent: "3", importRegions: ["UK", "Pakistan", "Egypt", "UAE"], exportRegions: ["Kenya", "Uganda", "Tanzania", "Rwanda"], variety: "AHP / SFS / Purple Tea", qualityStandards: ["BFOP / GFOP Grade", "Mombasa Auction Grade A"], packaging: ["54kg Paper Sacks", "Chests", "Tea Bags"], certifications: ["Rainforest Alliance", "ISO 3720", "UTZ"], exportRequirements: ["KTDA Export Permit", "Phytosanitary", "Quality Certificate"], tonsPerYear: "430000", exportRoutes: ["Mombasa Auction", "Mombasa → Karachi", "Nairobi → London"], avgDeliveryDays: 25, costPerTon: "180", opportunityScore: 71, suggestedAcreage: "15", yieldProjectionTons: "22", revenueProjectionUsd: "75000" },
    { name: "Flowers (Roses)", category: "Floriculture", avgPrice: "22", currency: "KES", demandLevel: "Very High", marketSizeUsd: "780000000", topBuyers: ["Dümmen Orange", "Kenflora", "FloraHolland", "Rosen Tantau"], trend: "up", marketHealth: "Green", region: "Naivasha", isExport: true, isOrganic: false, priceChange7d: "5.4", priceChange30d: "18.6", globalPrice: "95", demandGrowthPercent: "14", importRegions: ["Netherlands", "Germany", "France", "UK", "Japan"], exportRegions: ["Kenya", "Ethiopia", "Tanzania"], variety: "Hybrid Tea / Spray Roses", qualityStandards: ["FloraHolland Grade A1", "Stem length 60-90cm"], packaging: ["Bunch of 20", "Box 200 stems"], certifications: ["MPS-SQ", "Fairtrade", "GlobalGAP"], exportRequirements: ["KEPHIS Certificate", "Phytosanitary", "COO"], tonsPerYear: "180000", exportRoutes: ["Nairobi → Amsterdam", "Nairobi → Heathrow", "Nairobi → Addis → Frankfurt"], avgDeliveryDays: 2, costPerTon: "520", opportunityScore: 86, suggestedAcreage: "8", yieldProjectionTons: "24", revenueProjectionUsd: "148000" },
    { name: "Vanilla", category: "Spices", avgPrice: "24000", currency: "KES", demandLevel: "Very High", marketSizeUsd: "45000000", topBuyers: ["McCormick", "IFF", "Symrise", "Prova"], trend: "up", marketHealth: "Green", region: "Coastal Kenya", isExport: true, isOrganic: true, priceChange7d: "8.2", priceChange30d: "24.5", globalPrice: "120000", demandGrowthPercent: "32", importRegions: ["USA", "France", "Germany", "Japan"], exportRegions: ["Kenya", "Uganda", "Tanzania"], variety: "Planifolia / Tahitensis", qualityStandards: ["Min 20cm pod", "Min 25% vanillin"], packaging: ["1kg Vacuum Sealed", "Bulk 25kg"], certifications: ["Organic EU", "USDA Organic", "Fair Trade"], exportRequirements: ["KEPHIS Phytosanitary", "Organic Certificate", "COO"], tonsPerYear: "120", exportRoutes: ["Nairobi → Paris", "Nairobi → New York"], avgDeliveryDays: 4, costPerTon: "85000", opportunityScore: 97, suggestedAcreage: "3", yieldProjectionTons: "1.2", revenueProjectionUsd: "195000" },
    { name: "Tilapia (Fish)", category: "Aquaculture", avgPrice: "320", currency: "KES", demandLevel: "High", marketSizeUsd: "290000000", topBuyers: ["Carrefour Kenya", "Naivas", "Chandarana", "Tuskys"], trend: "up", marketHealth: "Green", region: "Lake Victoria", isExport: false, isOrganic: false, priceChange7d: "2.4", priceChange30d: "7.8", globalPrice: "850", demandGrowthPercent: "16", importRegions: ["Kenya Domestic", "Uganda", "Tanzania", "DRC"], exportRegions: ["Kenya", "Uganda", "Tanzania"], variety: "Nile Tilapia / Blue Tilapia", qualityStandards: ["Min 300g", "KEBS KS1768"], packaging: ["Whole Chilled", "Fillet Vacuum Packed"], certifications: ["KEBS", "KEPHIS", "ISO 22000"], exportRequirements: ["Health Certificate", "Export Permit"], tonsPerYear: "85000", exportRoutes: ["Lake Victoria → Nairobi", "Kisumu → Kampala"], avgDeliveryDays: 1, costPerTon: "380", opportunityScore: 78, suggestedAcreage: "2", yieldProjectionTons: "48", revenueProjectionUsd: "62000" },
  ]).returning({ id: commoditiesTable.id }).onConflictDoNothing();

  // Price history
  console.log("Adding price history...");
  const months = ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24", "Jan 25", "Feb 25", "Mar 25"];
  const avocadoPrices = [145, 152, 160, 155, 170, 178, 182, 175, 168, 172, 180, 185, 175, 182, 180];
  const coffeePrices = [820, 845, 880, 910, 895, 925, 940, 960, 945, 950, 980, 1010, 960, 975, 950];
  const macaPrices = [560, 580, 610, 595, 625, 645, 660, 680, 670, 685, 700, 720, 695, 710, 680];
  if (commodityIds.length >= 3) {
    await db.insert(priceHistoryTable).values([
      ...months.map((d, i) => ({ commodityId: commodityIds[0].id, date: d, price: avocadoPrices[i].toString() })),
      ...months.map((d, i) => ({ commodityId: commodityIds[1].id, date: d, price: coffeePrices[i].toString() })),
      ...months.map((d, i) => ({ commodityId: commodityIds[2].id, date: d, price: macaPrices[i].toString() })),
    ]).onConflictDoNothing();
  }

  // ========== COMMODITY CATEGORIES ==========
  await db.insert(commodityCategoriesTable).values([
    { name: "Horticulture", description: "Fresh fruits and vegetables for export and local markets", iconName: "Leaf" },
    { name: "Beverages", description: "Coffee, tea, and specialty drink commodities", iconName: "Coffee" },
    { name: "Tree Nuts", description: "Macadamia, cashew, and other nut commodities", iconName: "Nut" },
    { name: "Dairy", description: "Milk and dairy products", iconName: "Milk" },
    { name: "Cereals", description: "Maize, wheat, sorghum, and other grains", iconName: "Wheat" },
    { name: "Floriculture", description: "Cut flowers for export markets", iconName: "Flower" },
    { name: "Aquaculture", description: "Fish and aquatic products", iconName: "Fish" },
    { name: "Spices", description: "Vanilla, pepper, and specialty spices", iconName: "Spice" },
    { name: "Oilseeds", description: "Sunflower, soy, and other oilseeds", iconName: "Sun" },
  ]).onConflictDoNothing();

  // ========== VARIETIES ==========
  if (commodityIds.length > 0) {
    await db.insert(varietiesTable).values([
      { commodityId: commodityIds[0].id, name: "Hass", description: "World's most popular avocado variety, premium export grade", avgYieldPerAcre: "3.5", maturityDays: 240, diseaseResistance: "High", marketPreference: "Export", isExportGrade: true },
      { commodityId: commodityIds[0].id, name: "Fuerte", description: "Classic Kenyan avocado, pear-shaped, green when ripe", avgYieldPerAcre: "4.2", maturityDays: 210, diseaseResistance: "Medium", marketPreference: "Local/Export", isExportGrade: true },
      { commodityId: commodityIds[1].id, name: "SL28", description: "Kenya's premier coffee variety, bold flavour, wine notes", avgYieldPerAcre: "0.8", maturityDays: 365, diseaseResistance: "Low", marketPreference: "Specialty Export", isExportGrade: true },
      { commodityId: commodityIds[1].id, name: "Ruiru 11", description: "Disease-resistant hybrid with good cup quality", avgYieldPerAcre: "1.5", maturityDays: 300, diseaseResistance: "High", marketPreference: "Commercial Export", isExportGrade: true },
      { commodityId: commodityIds[2].id, name: "DUDA", description: "High-yielding macadamia variety, favoured by processors", avgYieldPerAcre: "0.9", maturityDays: 730, diseaseResistance: "Medium", marketPreference: "Export", isExportGrade: true },
    ]).onConflictDoNothing();
  }

  // ========== SEASONAL CYCLES ==========
  if (commodityIds.length > 0) {
    await db.insert(seasonalCyclesTable).values([
      { commodityId: commodityIds[0].id, region: "Central Kenya", country: "Kenya", plantingMonths: ["February", "March", "October"], harvestMonths: ["March", "April", "May", "October", "November"], peakPriceMonths: ["January", "February", "August", "September"], lowPriceMonths: ["April", "May", "November"], notes: "Two harvest seasons. Long rains season is primary for export." },
      { commodityId: commodityIds[1].id, region: "Central Kenya", country: "Kenya", plantingMonths: ["March", "April"], harvestMonths: ["October", "November", "December", "January"], peakPriceMonths: ["January", "February", "July"], lowPriceMonths: ["March", "April", "November"], notes: "Main harvest October-December. Cup score peaks with altitude." },
      { commodityId: commodityIds[6].id, region: "Kericho", country: "Kenya", plantingMonths: ["March", "April"], harvestMonths: ["All year round with peak March-May"], peakPriceMonths: ["July", "August", "September"], lowPriceMonths: ["December", "January"], notes: "Year-round production. Mombasa Auction prices peak July-September." },
    ]).onConflictDoNothing();
  }

  // ========== BUYERS (original) ==========
  console.log("Adding buyers...");
  await db.insert(buyersTable).values([
    { name: "Greenyard Fresh NL", location: "Rotterdam, Netherlands", type: "Exporter", weeklyDemandTons: "280", monthlyDemandTons: "1120", yearlyDemandTons: "13440", sustainabilityScore: 88, aiMatchScore: 94, tradeReadiness: "Ready", currency: "EUR", commodities: ["Avocado", "French Beans", "Mangoes"], isAiRecommended: true },
    { name: "Nakumatt International", location: "Nairobi, Kenya", type: "Retail", weeklyDemandTons: "145", monthlyDemandTons: "580", yearlyDemandTons: "6960", sustainabilityScore: 72, aiMatchScore: 88, tradeReadiness: "Ready", currency: "KES", commodities: ["Avocado", "Milk", "French Beans", "Maize"], isAiRecommended: true },
    { name: "Starbucks Coffee Procurement", location: "Seattle, USA", type: "Platform", weeklyDemandTons: "420", monthlyDemandTons: "1680", yearlyDemandTons: "20160", sustainabilityScore: 92, aiMatchScore: 76, tradeReadiness: "Ready", currency: "USD", commodities: ["Coffee"], isAiRecommended: false },
    { name: "Dubai Multi Commodities Centre", location: "Dubai, UAE", type: "Exporter", weeklyDemandTons: "380", monthlyDemandTons: "1520", yearlyDemandTons: "18240", sustainabilityScore: 68, aiMatchScore: 82, tradeReadiness: "Ready", currency: "USD", commodities: ["Avocado", "Flowers", "Macadamia", "Tea"], isAiRecommended: true },
    { name: "FloraHolland Auction", location: "Aalsmeer, Netherlands", type: "Platform", weeklyDemandTons: "920", monthlyDemandTons: "3680", yearlyDemandTons: "44160", sustainabilityScore: 85, aiMatchScore: 91, tradeReadiness: "Ready", currency: "EUR", commodities: ["Flowers"], isAiRecommended: true },
    { name: "Carrefour Kenya", location: "Nairobi, Kenya", type: "Retail", weeklyDemandTons: "95", monthlyDemandTons: "380", yearlyDemandTons: "4560", sustainabilityScore: 76, aiMatchScore: 85, tradeReadiness: "Ready", currency: "KES", commodities: ["Avocado", "Fish", "French Beans", "Vanilla"], isAiRecommended: false },
    { name: "McCormick & Company", location: "Maryland, USA", type: "Processor", weeklyDemandTons: "12", monthlyDemandTons: "48", yearlyDemandTons: "576", sustainabilityScore: 90, aiMatchScore: 97, tradeReadiness: "Ready", currency: "USD", commodities: ["Vanilla", "Spices"], isAiRecommended: true },
    { name: "Unilever Tea Kenya", location: "Kericho, Kenya", type: "Processor", weeklyDemandTons: "1200", monthlyDemandTons: "4800", yearlyDemandTons: "57600", sustainabilityScore: 94, aiMatchScore: 78, tradeReadiness: "Ready", currency: "KES", commodities: ["Tea"], isAiRecommended: false },
    { name: "Mauna Loa Macadamia", location: "Hawaii, USA", type: "Processor", weeklyDemandTons: "45", monthlyDemandTons: "180", yearlyDemandTons: "2160", sustainabilityScore: 82, aiMatchScore: 89, tradeReadiness: "Partial", currency: "USD", commodities: ["Macadamia"], isAiRecommended: true },
    { name: "WFP Regional Office", location: "Nairobi, Kenya", type: "Distributor", weeklyDemandTons: "2400", monthlyDemandTons: "9600", yearlyDemandTons: "115200", sustainabilityScore: 95, aiMatchScore: 70, tradeReadiness: "Ready", currency: "USD", commodities: ["Maize", "Beans", "Sorghum"], isAiRecommended: false },
  ]).onConflictDoNothing();

  // Market Alerts (original)
  console.log("Adding market alerts...");
  await db.insert(marketAlertsTable).values([
    { type: "price_spike", commodity: "Avocado", message: "Avocado prices surged 12% in EU markets driven by Mexico supply disruption. Kenya exporters can capitalize on $850/ton premium.", severity: "high", region: "Central Kenya" },
    { type: "high_demand", commodity: "Vanilla", message: "Global vanilla demand at 5-year high. Pure vanilla extract shortage reported by 3 major fragrance companies. Consider forward contracts at $120K/ton.", severity: "critical", region: "Coastal Kenya" },
    { type: "supply_gap", commodity: "Macadamia", message: "Chinese macadamia processors facing 8,000-ton shortage. Immediate off-take opportunities for Grade 0 kernel at $3,200/ton premium.", severity: "high", region: "Mt. Kenya" },
    { type: "forecast", commodity: "Coffee", message: "ICO forecast: East Africa Arabica cup prices to remain above $4,500/ton through Q3 2025 on strong US specialty demand.", severity: "medium", region: "Kigali" },
    { type: "price_spike", commodity: "Flowers", message: "Valentine's season approaching: Dutch flower auction prices 18% above seasonal average. Lock in forward sales now.", severity: "high", region: "Naivasha" },
    { type: "supply_gap", commodity: "French Beans", message: "UK supermarket chains report 22% undersupply. SPAR and Tesco sourcing desk open for new Kenyan suppliers.", severity: "medium", region: "Central Kenya" },
    { type: "shortage", commodity: "Dairy", message: "Regional milk deficit of 180K liters/day expected through March. Uganda processors increasing cross-border purchases.", severity: "high", region: "Rift Valley" },
    { type: "forecast", commodity: "Maize", message: "NCPB maize price support at KES 3,800/bag. WFP forecast purchases of 180,000 tons. Market support improving.", severity: "low", region: "Western Kenya" },
  ]).onConflictDoNothing();

  // ========== FARM PLOTS ==========
  console.log("Adding farm plots...");
  await db.insert(farmPlotsTable).values([
    { memberId: 1, plotName: "Muranga Main Farm", plotCode: "MRG-001", sizeAcres: "200", farmingSystem: "integrated", soilType: "Red volcanic", irrigationType: "Drip irrigation", region: "Central Kenya", county: "Murang'a", country: "Kenya", lat: "-0.7229", lng: "37.1527", isActive: true },
    { memberId: 1, plotName: "Thika Extension Farm", plotCode: "THK-002", sizeAcres: "45", farmingSystem: "organic", soilType: "Red volcanic", irrigationType: "Overhead sprinkler", region: "Central Kenya", county: "Kiambu", country: "Kenya", lat: "-1.0332", lng: "37.0693", isActive: true },
    { memberId: 2, plotName: "Rift Valley Dairy Farm", plotCode: "RVD-001", sizeAcres: "85", farmingSystem: "conventional", soilType: "Black cotton", irrigationType: "None (rainfall)", region: "Rift Valley", county: "Nakuru", country: "Kenya", lat: "-0.3031", lng: "36.0800", isActive: true },
    { memberId: 6, plotName: "Kigali Coffee Estate", plotCode: "KGL-001", sizeAcres: "22", farmingSystem: "organic", soilType: "Volcanic loam", irrigationType: "None", region: "Kigali", county: "Southern Province", country: "Rwanda", lat: "-2.3148", lng: "29.7707", isActive: true },
    { memberId: 10, plotName: "Lake Victoria Cage Farm", plotCode: "LVK-001", sizeAcres: "2", farmingSystem: "integrated", soilType: "Lake bed", irrigationType: "Lake water", region: "Lake Victoria Basin", county: "Kisumu", country: "Kenya", lat: "-0.1022", lng: "34.7617", isActive: true },
  ]).onConflictDoNothing();

  // ========== PRODUCTION RECORDS ==========
  if (commodityIds.length > 0) {
    await db.insert(productionRecordsTable).values([
      { memberId: 1, commodityId: commodityIds[0].id, season: "long_rains", year: 2024, plantedDate: "2024-02-15", harvestDate: "2024-05-20", expectedYieldTons: "1250", actualYieldTons: "1180", acreasPlanted: "200", qualityGrade: "Grade A Export", status: "sold" },
      { memberId: 2, commodityId: commodityIds[3].id, season: "long_rains", year: 2024, plantedDate: "2024-01-01", harvestDate: "2024-03-31", expectedYieldTons: "820", actualYieldTons: "795", acreasPlanted: "85", qualityGrade: "Grade A Chilled", status: "sold" },
      { memberId: 6, commodityId: commodityIds[1].id, season: "short_rains", year: 2024, plantedDate: "2024-03-01", harvestDate: "2024-11-15", expectedYieldTons: "48", actualYieldTons: "45", acreasPlanted: "22", qualityGrade: "Grade AA Specialty", status: "sold" },
    ]).onConflictDoNothing();
  }

  // ========== TRADE LISTINGS ==========
  console.log("Adding trade listings...");
  if (commodityIds.length > 0) {
    await db.insert(tradeListingsTable).values([
      { sellerId: 1, commodityId: commodityIds[0].id, title: "Hass Avocado - Grade A Export, 50MT Available", description: "Fresh Hass avocados, GlobalGAP certified, ready for immediate shipment via Nairobi. Farm-to-port in 24 hours.", quantity: "50", unit: "tons", pricePerUnit: "850", currency: "USD", minOrderQuantity: "10", availableFrom: "2025-04-01", availableUntil: "2025-05-31", qualityGrade: "Grade A Export", certifications: ["GlobalGAP", "KEPHIS"], location: "Muranga, Central Kenya", country: "Kenya", isExport: true, isOrganic: false, status: "active", views: 245, inquiries: 18 },
      { sellerId: 6, commodityId: commodityIds[1].id, title: "Rwanda Arabica AA - Specialty Grade, 15MT", description: "Single-origin Rwanda Arabica, cup score 88+, washed process, direct from cooperative.", quantity: "15", unit: "tons", pricePerUnit: "4800", currency: "USD", minOrderQuantity: "2", availableFrom: "2025-03-15", availableUntil: "2025-06-30", qualityGrade: "AA Specialty", certifications: ["Fair Trade", "Organic"], location: "Southern Province, Rwanda", country: "Rwanda", isExport: true, isOrganic: true, status: "active", views: 182, inquiries: 12 },
      { sellerId: 13, commodityId: commodityIds[2].id, title: "Macadamia Kernel Grade 0 - 25MT Ready", description: "Processed macadamia kernel, KEPHIS certified, packed in 25kg vacuum bags. FDA registered facility.", quantity: "25", unit: "tons", pricePerUnit: "3200", currency: "USD", minOrderQuantity: "5", availableFrom: "2025-04-15", availableUntil: "2025-07-31", qualityGrade: "Grade 0 Kernel", certifications: ["KEPHIS", "FDA Registered"], location: "Mt. Kenya Region, Kenya", country: "Kenya", isExport: true, isOrganic: false, status: "active", views: 312, inquiries: 24 },
      { sellerId: 2, commodityId: commodityIds[3].id, title: "Fresh Milk - 10,000L Daily Capacity Available", description: "Farm-fresh Grade A milk from Friesian herd. Available for bulk off-take, daily delivery within Rift Valley.", quantity: "300", unit: "tons", pricePerUnit: "55", currency: "KES", minOrderQuantity: "1", availableFrom: "2025-03-01", qualableUntil: "2025-12-31", qualityGrade: "Grade A", certifications: ["KDB Licensed", "KEBS"], location: "Nakuru, Rift Valley", country: "Kenya", isExport: false, isOrganic: false, status: "active", views: 89, inquiries: 7 },
      { sellerId: 7, commodityId: commodityIds[7].id, title: "Naivasha Hybrid Tea Roses - 200K Stems Weekly", description: "Premium cut roses, 60cm stems, MPS-SQ certified. Ready for FloraHolland consignment or direct export.", quantity: "1200", unit: "tons", pricePerUnit: "95", currency: "USD", minOrderQuantity: "10", availableFrom: "2025-02-01", availableUntil: "2025-12-31", qualityGrade: "Grade A1", certifications: ["MPS-SQ", "Fairtrade", "GlobalGAP"], location: "Naivasha, Kenya", country: "Kenya", isExport: true, isOrganic: false, status: "active", views: 428, inquiries: 35 },
    ]).onConflictDoNothing();
  }

  // ========== CONTRACTS ==========
  console.log("Adding contracts...");
  await db.insert(contractsTable).values([
    { buyerId: 1, sellerId: 1, commodityName: "Avocado (Hass)", contractNumber: "CTR-2025-001", type: "forward", executionMode: "semi_auto", quantity: "200", unit: "tons", pricePerUnit: "820", currency: "USD", totalValue: "164000", startDate: "2025-04-01", endDate: "2025-06-30", deliveryTerms: "FOB Mombasa", paymentTerms: "LC at sight", qualitySpec: "GlobalGAP Grade A min 180g", status: "active", signedAt: new Date("2025-03-01") },
    { buyerId: 3, sellerId: 6, commodityName: "Coffee (Arabica)", contractNumber: "CTR-2025-002", type: "fixed", executionMode: "manual", quantity: "30", unit: "tons", pricePerUnit: "4500", currency: "USD", totalValue: "135000", startDate: "2025-03-15", endDate: "2025-09-15", deliveryTerms: "CIF Hamburg", paymentTerms: "T/T 30 days", qualitySpec: "AA Grade, Cup Score 87+, Washed", status: "signed", signedAt: new Date("2025-02-20") },
    { buyerId: 5, sellerId: 7, commodityName: "Flowers (Roses)", contractNumber: "CTR-2025-003", type: "flexible", executionMode: "auto", quantity: "52000", unit: "boxes", pricePerUnit: "22", currency: "EUR", totalValue: "1144000", startDate: "2025-01-01", endDate: "2025-12-31", deliveryTerms: "DAP Amsterdam", paymentTerms: "Weekly settlement", qualitySpec: "FloraHolland Grade A1, 60cm stems", status: "active", signedAt: new Date("2024-12-15") },
  ]).onConflictDoNothing();

  // ========== WAREHOUSES ==========
  console.log("Adding warehouses...");
  await db.insert(warehousesTable).values([
    { name: "Nairobi Cold Chain Hub", code: "NCH-001", type: "cold_chain", address: "Embakasi Industrial Area", city: "Nairobi", region: "Nairobi", country: "Kenya", capacityTons: "2500", currentOccupancy: "1820", minTemp: "2", maxTemp: "8", operatorName: "EastAfrica Fresh Logistics", operatorPhone: "+254722001001", certifications: ["ISO 22000", "HACCP", "BRC"], isActive: true, lat: "-1.3246", lng: "36.9118" },
    { name: "Mombasa Port Cold Store", code: "MPS-001", type: "cold_chain", address: "Kilindini Harbour, Shed 7", city: "Mombasa", region: "Coastal Kenya", country: "Kenya", capacityTons: "5000", currentOccupancy: "3200", minTemp: "-5", maxTemp: "4", operatorName: "Kenya Ports Authority", certifications: ["ISO 22000"], isActive: true, lat: "-4.0654", lng: "39.6614" },
    { name: "Rift Valley Grain Store", code: "RVG-001", type: "dry_storage", address: "NCPB Depot, Nakuru", city: "Nakuru", region: "Rift Valley", country: "Kenya", capacityTons: "45000", currentOccupancy: "28000", operatorName: "NCPB", certifications: ["KEBS"], isActive: true, lat: "-0.2836", lng: "36.0600" },
    { name: "Kigali Distribution Centre", code: "KDC-001", type: "distribution", address: "Kigali Special Economic Zone", city: "Kigali", region: "Kigali", country: "Rwanda", capacityTons: "800", currentOccupancy: "450", operatorName: "Rwanda Agriculture Board", certifications: ["ISO 9001"], isActive: true, lat: "-1.9441", lng: "30.0619" },
    { name: "Kampala Agri Hub", code: "KAH-001", type: "dry_storage", address: "Namanve Industrial Park", city: "Kampala", region: "Central Uganda", country: "Uganda", capacityTons: "3500", currentOccupancy: "1900", operatorName: "Uganda National Bureau of Standards", certifications: ["UNBS"], isActive: true, lat: "0.3600", lng: "32.7200" },
  ]).onConflictDoNothing();

  // ========== LOGISTICS PROVIDERS ==========
  await db.insert(logisticsProvidersTable).values([
    { name: "EastAfrica Fresh Logistics", type: "freight_forwarder", coverageCountries: ["Kenya", "Uganda", "Tanzania", "Rwanda"], services: ["Cold Chain", "Air Freight", "Sea Freight", "Last Mile"], contactName: "James Mwaniki", contactEmail: "james@ealfresh.com", contactPhone: "+254722002001", website: "www.ealfresh.com", rating: 9, isActive: true },
    { name: "Siginon Logistics Kenya", type: "clearing_agent", coverageCountries: ["Kenya", "Uganda", "Tanzania"], services: ["Port Clearing", "Customs Brokerage", "Warehousing"], contactEmail: "ops@siginon.com", contactPhone: "+254722003001", website: "www.siginon.com", rating: 8, isActive: true },
    { name: "DHL Supply Chain Africa", type: "courier", coverageCountries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "South Africa"], services: ["Express Courier", "Cold Chain", "Warehousing", "Distribution"], contactEmail: "ea@dhl.com", website: "www.dhl.com/ke", rating: 9, isActive: true },
    { name: "MSC Mediterranean Shipping", type: "shipping_line", coverageCountries: ["Global"], services: ["FCL", "LCL", "Reefer Containers", "Mombasa Port Calls"], contactEmail: "mombasa@msc.com", website: "www.msc.com", rating: 8, isActive: true },
    { name: "Kenya Airways Cargo", type: "air_cargo", coverageCountries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "Global"], services: ["Air Freight", "Cool Dolly", "Priority Fresh", "Charter"], contactEmail: "cargo@kenya-airways.com", website: "www.kenya-airways.com", rating: 8, isActive: true },
  ]).onConflictDoNothing();

  // ========== INVESTMENTS ==========
  console.log("Adding investments...");
  await db.insert(investmentsTable).values([
    { investorId: 4, targetEntityType: "company", targetEntityId: 1, targetEntityName: "AgroVision Kenya Ltd", amount: "500000", currency: "USD", equityPercent: "12", stage: "series_a", investedAt: "2024-06-15", expectedReturnPercent: "35", sector: "AgriTech", status: "active" },
    { investorId: 12, targetEntityType: "company", targetEntityId: 2, targetEntityName: "Rift Valley Dairy Cooperative", amount: "250000", currency: "USD", equityPercent: "8", stage: "pre_series_a", investedAt: "2024-03-01", expectedReturnPercent: "28", sector: "Dairy", status: "active" },
    { investorId: 4, targetEntityType: "company", targetEntityId: 7, targetEntityName: "Naivasha Flower Growers Association", amount: "1200000", currency: "USD", equityPercent: "5", stage: "growth", investedAt: "2023-11-15", expectedReturnPercent: "22", actualReturnPercent: "19.5", sector: "Floriculture", status: "active" },
    { investorId: 12, targetEntityType: "agripreneur", targetEntityId: 11, targetEntityName: "Asha Daud - Vanilla Operations", amount: "80000", currency: "USD", stage: "seed", investedAt: "2024-09-01", expectedReturnPercent: "45", sector: "Spices", status: "active" },
    { investorId: 4, targetEntityType: "company", targetEntityId: 5, targetEntityName: "Nile Basin AgriFinance", amount: "350000", currency: "USD", equityPercent: "18", stage: "pre_series_a", investedAt: "2024-01-15", expectedReturnPercent: "38", sector: "AgriFintech", status: "active" },
  ]).onConflictDoNothing();

  // ========== FUNDING ROUNDS ==========
  await db.insert(fundingRoundsTable).values([
    { organizationName: "AgroVision Kenya Ltd", roundName: "Series A", targetAmount: "3000000", raisedAmount: "1800000", currency: "USD", stage: "series_a", openDate: "2025-01-01", closeDate: "2025-06-30", leadInvestor: "Acumen Fund", investorCount: 4, sector: "AgriTech", description: "Building AI-powered market intelligence for 50K+ farmers in East Africa", isActive: true },
    { organizationName: "EastAfrica Fresh Logistics", roundName: "Growth Round", targetAmount: "5000000", raisedAmount: "3200000", currency: "USD", stage: "growth", openDate: "2025-02-15", closeDate: "2025-08-15", leadInvestor: "CDC Group", investorCount: 3, sector: "Logistics", description: "Expanding cold chain network to 12 new counties", isActive: true },
    { organizationName: "Nile Basin AgriFinance", roundName: "Pre-Series A", targetAmount: "2000000", raisedAmount: "800000", currency: "USD", stage: "pre_series_a", openDate: "2025-03-01", closeDate: "2025-09-01", leadInvestor: "GSMA AgriTech Fund", investorCount: 2, sector: "AgriFintech", description: "Digital credit scoring and USSD-based loans for smallholder farmers", isActive: true },
  ]).onConflictDoNothing();

  // ========== GRANTS ==========
  await db.insert(grantsTable).values([
    { title: "USAID Agribusiness Investment Fund - East Africa", funder: "USAID", amount: "500000", currency: "USD", description: "Grant for agribusiness enterprises demonstrating sustainable impact in food security", eligibility: "Registered agribusiness with 2+ years operations, 50+ smallholder farmer linkages", applicationDeadline: "2025-05-31", sector: "Agribusiness", region: "East Africa", country: null, isOpen: true, applicationUrl: "https://usaid.gov/eastafrica/agribusiness", contactEmail: "agribiz@usaid.gov" },
    { title: "World Bank AgResults Initiative", funder: "World Bank", amount: "250000", currency: "USD", description: "Pull mechanism grant for proven smallholder productivity solutions", eligibility: "Agricultural enterprises with verifiable productivity outcomes", applicationDeadline: "2025-04-30", sector: "Technology", region: "Sub-Saharan Africa", country: null, isOpen: true, contactEmail: "agresults@worldbank.org" },
    { title: "African Development Bank AGTF Grant", funder: "African Development Bank", amount: "750000", currency: "USD", description: "Agricultural Transformation Fund for climate-smart agriculture projects", eligibility: "Social enterprise or cooperative with climate adaptation mandate", applicationDeadline: "2025-06-15", sector: "Climate-Smart Agriculture", region: "East Africa", country: null, isOpen: true, contactEmail: "agtf@afdb.org" },
    { title: "Kenya Youth Agripreneur Grant", funder: "Government of Kenya - AGPO", amount: "50000", currency: "KES", description: "Grant for youth-led agricultural enterprises aged 18-35", eligibility: "Kenyan youth 18-35, registered enterprise, agriculture sector", applicationDeadline: "2025-04-01", sector: "Youth Agribusiness", region: "Kenya", country: "Kenya", isOpen: true, contactEmail: "youth.agro@agpo.go.ke" },
    { title: "GSMA AgriTech Innovation Fund", funder: "GSMA", amount: "200000", currency: "USD", description: "Mobile-based agricultural technology innovation grants", eligibility: "AgriTech startup with mobile/digital solution for smallholder farmers", applicationDeadline: "2025-05-15", sector: "AgriTech", region: "Sub-Saharan Africa", country: null, isOpen: true, contactEmail: "agritech@gsma.com" },
  ]).onConflictDoNothing();

  // ========== LOANS ==========
  await db.insert(loansTable).values([
    { borrowerId: 1, lenderName: "KCB Bank Kenya", principal: "5000000", currency: "KES", interestRate: "12.5", termMonths: 36, purpose: "Farm expansion - additional 50 acres avocado planting", collateral: "Title deeds for 200 acres Muranga farm", status: "active", disbursedAt: "2024-09-01", maturityDate: "2027-09-01", amountRepaid: "800000", nextPaymentDate: "2025-04-01" },
    { borrowerId: 2, lenderName: "Equity Bank", principal: "3500000", currency: "KES", interestRate: "14", termMonths: 24, purpose: "Purchase 5 milking machines and cooling tank", collateral: "Dairy herd valuation certificate", status: "active", disbursedAt: "2024-06-15", maturityDate: "2026-06-15", amountRepaid: "1200000", nextPaymentDate: "2025-04-15" },
    { borrowerId: 11, lenderName: "Faulu Microfinance", principal: "800000", currency: "KES", interestRate: "18", termMonths: 18, purpose: "Vanilla curing and processing facility upgrade", collateral: "Business assets", status: "active", disbursedAt: "2024-11-01", maturityDate: "2026-05-01", amountRepaid: "150000", nextPaymentDate: "2025-04-01" },
    { borrowerId: 3, lenderName: "BPR Bank Rwanda", principal: "18000000", currency: "RWF", interestRate: "16", termMonths: 24, purpose: "Working capital for wet season coffee purchases", collateral: "Export contracts valued at RWF 45M", status: "active", disbursedAt: "2024-10-01", maturityDate: "2026-10-01", amountRepaid: "3000000", nextPaymentDate: "2025-04-01" },
  ]).onConflictDoNothing();

  // ========== TRAINING PROGRAMS ==========
  console.log("Adding training programs...");
  const trainingIds = await db.insert(trainingProgramsTable).values([
    { title: "Export-Ready Agripreneur Accelerator", description: "12-week intensive program transforming agripreneurs into export-ready enterprises. Covers market intelligence, quality standards, logistics, and finance.", category: "Export Business", level: "intermediate", delivery: "hybrid", durationDays: 84, maxParticipants: 25, currentEnrollment: 18, price: "0", currency: "USD", targetAudience: "Agripreneurs with 2+ years farming experience", learningOutcomes: ["Export documentation mastery", "GlobalGAP certification pathway", "Buyer negotiation skills", "Trade finance basics"], facilitator: "EAAPA Trade Team", venue: "EAAPA Nairobi HQ", region: "Nairobi", country: "Kenya", startDate: "2025-04-07", endDate: "2025-06-27", registrationDeadline: "2025-03-31", status: "published", isFeatured: true, certificate: true, tags: ["export", "accelerator", "trade"] },
    { title: "Precision Farming & Data-Driven Agriculture", description: "5-day workshop on IoT sensors, satellite imaging, soil testing, and digital farm management for improved yield and resource efficiency.", category: "AgriTech", level: "basic", delivery: "in_person", durationDays: 5, maxParticipants: 30, currentEnrollment: 22, price: "15000", currency: "KES", targetAudience: "Farmers interested in technology-driven production", learningOutcomes: ["IoT sensor deployment", "Satellite imagery interpretation", "Digital record keeping", "Data-driven decisions"], facilitator: "AgroVision Kenya Ltd", venue: "EAAPA Nakuru Centre", region: "Rift Valley", country: "Kenya", startDate: "2025-04-14", endDate: "2025-04-18", registrationDeadline: "2025-04-07", status: "published", isFeatured: true, certificate: true, tags: ["technology", "precision farming", "IoT"] },
    { title: "Climate-Smart Agriculture Masterclass", description: "3-day intensive covering climate adaptation strategies, drought-resistant varieties, conservation tillage, and carbon credit opportunities.", category: "Climate", level: "intermediate", delivery: "hybrid", durationDays: 3, maxParticipants: 40, currentEnrollment: 31, price: "0", currency: "USD", targetAudience: "Farmers in climate-vulnerable regions", learningOutcomes: ["Climate risk assessment", "Drought-resistant variety selection", "Conservation agriculture", "Carbon market basics"], facilitator: "FAO Kenya / CCAFS", venue: "Online + Field Sites", region: "Multiple", country: "Kenya", startDate: "2025-05-05", endDate: "2025-05-07", registrationDeadline: "2025-04-28", status: "published", certificate: true, tags: ["climate", "sustainability", "adaptation"] },
    { title: "Agri-Finance & Investment Readiness", description: "Full-day workshop on accessing credit, preparing investor pitches, understanding VC/PE investments, and managing farm finances.", category: "Finance", level: "basic", delivery: "in_person", durationDays: 1, maxParticipants: 50, currentEnrollment: 45, price: "5000", currency: "KES", targetAudience: "Agripreneurs seeking funding", learningOutcomes: ["Business plan writing", "Investor pitch deck", "Financial modelling", "Loan application process"], facilitator: "EAAPA Finance Team + KCB", venue: "EAAPA Kigali Office", region: "Kigali", country: "Rwanda", startDate: "2025-04-22", endDate: "2025-04-22", registrationDeadline: "2025-04-15", status: "published", certificate: false, tags: ["finance", "investment", "credit"] },
    { title: "Women in Agribusiness Leadership Program", description: "6-week program empowering women farmers and entrepreneurs with leadership, negotiation, market access, and digital skills.", category: "Leadership", level: "basic", delivery: "hybrid", durationDays: 42, maxParticipants: 35, currentEnrollment: 30, price: "0", currency: "USD", targetAudience: "Women in agriculture 18-45", learningOutcomes: ["Leadership and negotiation", "Digital marketing", "Cooperative governance", "Gender-responsive finance access"], facilitator: "EAAPA Gender Desk", venue: "Kampala + Online", region: "Central Uganda", country: "Uganda", startDate: "2025-05-12", endDate: "2025-06-23", registrationDeadline: "2025-05-05", status: "published", isFeatured: true, certificate: true, tags: ["women", "leadership", "empowerment"] },
  ]).returning({ id: trainingProgramsTable.id }).onConflictDoNothing();

  // ========== TRAINING MODULES ==========
  if (trainingIds.length > 0) {
    await db.insert(trainingModulesTable).values([
      { programId: trainingIds[0].id, title: "Module 1: Understanding Global Markets", description: "Market research, demand trends, price drivers, and target buyer identification", orderIndex: 1, durationMinutes: 240, contentType: "lecture", isRequired: true },
      { programId: trainingIds[0].id, title: "Module 2: Quality Standards & Certifications", description: "GlobalGAP, Rainforest Alliance, Organic certifications - what buyers require", orderIndex: 2, durationMinutes: 360, contentType: "workshop", isRequired: true },
      { programId: trainingIds[0].id, title: "Module 3: Export Documentation", description: "Phytosanitary certificates, COO, packing lists, commercial invoices, BoL", orderIndex: 3, durationMinutes: 180, contentType: "lecture", isRequired: true },
      { programId: trainingIds[0].id, title: "Module 4: Trade Finance", description: "Letters of credit, invoice discounting, export insurance, payment terms", orderIndex: 4, durationMinutes: 240, contentType: "lecture", isRequired: true },
      { programId: trainingIds[0].id, title: "Module 5: Buyer Negotiation", description: "Price negotiation tactics, contract terms, relationship management", orderIndex: 5, durationMinutes: 180, contentType: "roleplay", isRequired: true },
    ]).onConflictDoNothing();
  }

  // ========== ENROLLMENTS ==========
  if (trainingIds.length > 0) {
    await db.insert(programEnrollmentsTable).values([
      { programId: trainingIds[0].id, memberId: 1, memberName: "Amara Nkosi", status: "in_progress", progressPercent: 60, enrolledAt: new Date("2025-03-15") },
      { programId: trainingIds[0].id, memberId: 8, memberName: "Moses Wanjala", status: "enrolled", progressPercent: 15, enrolledAt: new Date("2025-03-20") },
      { programId: trainingIds[1].id, memberId: 1, memberName: "Amara Nkosi", status: "enrolled", progressPercent: 0, enrolledAt: new Date("2025-03-28") },
      { programId: trainingIds[3].id, memberId: 6, memberName: "Jean-Pierre Nziza", status: "completed", progressPercent: 100, enrolledAt: new Date("2025-01-15"), completedAt: new Date("2025-01-22") },
    ]).onConflictDoNothing();
  }

  // ========== CERTIFICATIONS ==========
  await db.insert(certificationsTable).values([
    { name: "EAAPA Certified Agripreneur", issuingBody: "EAAPA", type: "competency", level: "intermediate", description: "Professional certification for competent agribusiness practitioners", validityYears: 3, requirements: ["Complete Accelerator Program", "Pass written assessment", "Submit business plan"], benefits: ["Priority market linkage", "EAAPA profile badge", "Network access"], isActive: true },
    { name: "EAAPA Export Ready Certificate", issuingBody: "EAAPA", type: "readiness", level: "advanced", description: "Certifies an agripreneur's readiness for international export trade", validityYears: 2, requirements: ["Complete Export Training", "Have active export contract or LOI", "Quality audit passed"], benefits: ["Export buyer introductions", "Trade finance referrals", "Co-branding rights"], isActive: true },
    { name: "EAAPA Mentor Accreditation", issuingBody: "EAAPA", type: "professional", level: "expert", description: "Accredits experienced practitioners as EAAPA certified mentors", validityYears: 5, requirements: ["10+ years industry experience", "Background check", "Training methodology course", "Peer review"], benefits: ["Mentor listing on platform", "Speaker opportunities", "Revenue share on sessions"], isActive: true },
  ]).onConflictDoNothing();

  // ========== MENTORS (original) ==========
  console.log("Adding mentors...");
  await db.insert(mentorsTable).values([
    { name: "Fatuma Hassan", expertise: ["Export Markets", "EU Regulations", "GlobalGAP", "Trade Finance"], sector: "Horticulture Export", country: "Kenya", bio: "20+ years in Kenyan horticulture export trade. Former EPZA Board Member. Facilitated over $80M in export contracts.", menteeCount: 24, rating: 92, isAvailable: true },
    { name: "Dr. Robert Waweru", expertise: ["Agri-Finance", "Cooperative Management", "SACCO Governance", "Rural Credit"], sector: "Agricultural Finance", country: "Kenya", bio: "PhD Agricultural Economics from Wageningen. Former World Bank agriculture finance consultant. 15 years cooperative finance experience.", menteeCount: 18, rating: 95, isAvailable: true },
    { name: "Amina Yusuf Ibrahim", expertise: ["Digital Farming", "Remote Sensing", "Precision Agriculture", "IoT"], sector: "AgriTech", country: "Uganda", bio: "AgriTech entrepreneur who built Uganda's first satellite-based crop monitoring system. GSMA Connected Women Fellow.", menteeCount: 31, rating: 88, isAvailable: true },
    { name: "Benedicte Uwimana", expertise: ["Coffee Processing", "Specialty Coffee", "Cooperative Development", "European Markets"], sector: "Coffee Value Chain", country: "Rwanda", bio: "Led the establishment of 8 coffee washing stations in Rwanda. Former UN FAO coffee specialist.", menteeCount: 15, rating: 90, isAvailable: false },
    { name: "Dr. Japhet Ndungu", expertise: ["Food Safety", "HACCP", "ISO 22000", "EU Food Law", "Certification"], sector: "Food Standards", country: "Kenya", bio: "Food safety consultant with 20 years helping African exporters meet EU, US, and Middle East standards. KEBS Technical Committee member.", menteeCount: 42, rating: 96, isAvailable: true },
    { name: "Sarah Kimani", expertise: ["Impact Investing", "ESG", "Blended Finance", "Grant Writing", "Fundraising"], sector: "Impact Finance", country: "Kenya", bio: "Impact investment advisor who has helped 25 agricultural enterprises raise over $15M in blended finance.", menteeCount: 28, rating: 91, isAvailable: true },
  ]).onConflictDoNothing();

  // Mentorship Matches
  await db.insert(mentorshipMatchesTable).values([
    { mentorId: 1, menteeId: 1, mentorName: "Fatuma Hassan", menteeName: "Amara Nkosi", focus: "EU export market expansion and GlobalGAP recertification", startDate: "2025-01-15", meetingFrequency: "biweekly", status: "active", goalsAgreed: ["Enter 2 new EU markets by Dec 2025", "Obtain TESCO Nurture certification", "Increase export revenue by 40%"] },
    { mentorId: 2, menteeId: 2, mentorName: "Dr. Robert Waweru", menteeName: "David Ochieng", focus: "Dairy cooperative financial management and SACCO formation", startDate: "2025-02-01", meetingFrequency: "monthly", status: "active", goalsAgreed: ["Establish farmer SACCO by July 2025", "Reduce input cost by 15%", "Access KCB agri-credit facility"] },
    { mentorId: 6, menteeId: 11, mentorName: "Sarah Kimani", menteeName: "Asha Daud", focus: "Raising impact investment for vanilla processing facility", startDate: "2025-03-01", meetingFrequency: "weekly", status: "active", goalsAgreed: ["Prepare investor-ready pitch deck", "Apply for AfDB grant", "Reach $500K in annual revenue"] },
  ]).onConflictDoNothing();

  // ========== OPPORTUNITIES (original) ==========
  console.log("Adding opportunities...");
  await db.insert(opportunitiesTable).values([
    { title: "Avocado Export Equity Partnership", description: "Seeking co-investor for 100-acre Hass avocado farm expansion targeting EU premium segment. IRR projection 35% over 5 years.", type: "investment", sector: "Horticulture", roi: "35%", fundingAmount: "2500000", currency: "USD", deadline: "2025-06-30", status: "open", tags: ["avocado", "export", "EU market", "equity"] },
    { title: "USAID Agribusiness SME Grant - Round 3", description: "USAID East Africa SME Fund - $500K grants for agribusiness enterprises demonstrating scalable impact in food security.", type: "grant", sector: "Agribusiness", fundingAmount: "500000", currency: "USD", deadline: "2025-05-15", status: "open", tags: ["USAID", "grant", "food security", "SME"] },
    { title: "Dairy Value Chain Investment - Rift Valley", description: "Impact investment opportunity in Rift Valley dairy processing cooperative serving 1,200 smallholder farmers. 28% ROI.", type: "investment", sector: "Dairy", roi: "28%", fundingAmount: "1200000", currency: "USD", deadline: "2025-07-31", status: "open", tags: ["dairy", "cooperative", "Rift Valley", "impact"] },
    { title: "Youth Agripreneur Seed Fund", description: "KES 2M seed grants for agripreneurs aged 18-35 with innovative solutions to food value chain challenges.", type: "grant", sector: "Youth Agribusiness", fundingAmount: "2000000", currency: "KES", deadline: "2025-04-30", status: "closing_soon", tags: ["youth", "seed fund", "innovation"] },
    { title: "Vanilla Processing Facility Co-Investment", description: "Co-investment opportunity to build Kenya's first vanilla extract production facility. High-value fragrance industry customer base.", type: "value_chain", sector: "Spices", roi: "45%", fundingAmount: "800000", currency: "USD", deadline: "2025-08-31", status: "open", tags: ["vanilla", "processing", "fragrance", "high value"] },
    { title: "Floriculture Cold Chain Expansion Fund", description: "Logistics infrastructure fund for expanding cold chain capacity from Naivasha to Nairobi Jomo Kenyatta Airport.", type: "investment", sector: "Logistics", roi: "22%", fundingAmount: "3000000", currency: "USD", deadline: "2025-06-15", status: "open", tags: ["flowers", "cold chain", "logistics", "infrastructure"] },
    { title: "African Development Bank AGTF", description: "AfDB Agricultural Transformation Fund for climate-smart agriculture projects across East Africa.", type: "grant", sector: "Climate Agriculture", fundingAmount: "750000", currency: "USD", deadline: "2025-06-15", status: "open", tags: ["AfDB", "climate", "transformation"] },
    { title: "Coffee Specialty Processing Hub", description: "Build a wet mill processing hub for specialty Arabica in Central Kenya, serving 800 smallholder coffee farmers.", type: "value_chain", sector: "Coffee", roi: "32%", fundingAmount: "450000", currency: "USD", deadline: "2025-09-30", status: "open", tags: ["coffee", "processing", "specialty", "cooperative"] },
  ]).onConflictDoNothing();

  // ========== PROJECTS (original) ==========
  console.log("Adding projects...");
  await db.insert(projectsTable).values([
    { title: "East Africa Avocado Export Network", description: "Collaborative project connecting 12 avocado farms to form a certified export cluster meeting EU market requirements.", leader: "Amara Nkosi", leaderId: 1, status: "active", commodity: "Avocado", region: "Central Kenya", startDate: "2025-01-01", memberCount: 12, tags: ["export", "certification", "cluster"] },
    { title: "Rift Valley Dairy Aggregation Model", description: "Smallholder dairy farmer cooperative pooling milk supply for improved bargaining power with processors.", leader: "David Ochieng", leaderId: 2, status: "active", commodity: "Dairy", region: "Rift Valley", startDate: "2025-02-01", memberCount: 24, tags: ["cooperative", "dairy", "smallholder"] },
    { title: "Rwanda Coffee Quality Improvement Initiative", description: "Farmer group focused on cup quality improvement through cherry selection and post-harvest handling best practices.", leader: "Jean-Pierre Nziza", leaderId: 6, status: "active", commodity: "Coffee", region: "Kigali", startDate: "2024-10-01", memberCount: 8, tags: ["quality", "coffee", "Rwanda"] },
    { title: "Lake Victoria Fish Farmers Alliance", description: "Cage aquaculture collective purchasing feed in bulk and sharing logistics for regional supermarket supply.", leader: "Charles Mutua", leaderId: 10, status: "planning", commodity: "Fish", region: "Lake Victoria Basin", startDate: "2025-05-01", memberCount: 6, tags: ["aquaculture", "cooperative", "bulk buying"] },
    { title: "Naivasha Flower Export Consortium", description: "Consortium of 8 flower growers optimizing FloraHolland auction allocation and shared airfreight costs.", leader: "Tigist Bekele", leaderId: 7, status: "active", commodity: "Flowers", region: "Naivasha", startDate: "2024-09-01", memberCount: 8, tags: ["floriculture", "export", "consortium"] },
  ]).onConflictDoNothing();

  // ========== FORUM THREADS (original) ==========
  console.log("Adding forum threads...");
  await db.insert(forumThreadsTable).values([
    { title: "How to get GlobalGAP certification as a small-scale farmer?", content: "I am a smallholder avocado farmer in Muranga and want to start exporting to EU. What are the exact steps to get GlobalGAP certified without spending too much money?", category: "Certification", author: "Amara Nkosi", authorId: 1, replies: 14, views: 892, tags: ["GlobalGAP", "certification", "export", "avocado"] },
    { title: "KCB Agri-Credit interest rates - anyone else finding them too high?", content: "I applied for a KCB loan to expand my dairy farm but the 12.5% interest rate seems steep. Has anyone negotiated better terms or found alternative lenders?", category: "Funding", author: "David Ochieng", authorId: 2, replies: 22, views: 1240, tags: ["KCB", "credit", "interest rate", "dairy"] },
    { title: "Best practices for avocado post-harvest handling in hot weather?", content: "During the March-April harvest, temperatures go above 30°C. What are the most cost-effective ways to prevent ripening before the avocados reach the cold store?", category: "Agronomy", author: "Grace Atuhaire", authorId: 3, replies: 18, views: 756, tags: ["avocado", "post-harvest", "cold chain"] },
    { title: "Has anyone tried the M-PESA payment flow for bulk grain sales?", content: "I sell maize to NCPB and want to use M-PESA for payment instead of cheque. Has anyone done this for amounts above KES 300,000?", category: "Technology", author: "Moses Wanjala", authorId: 8, replies: 9, views: 445, tags: ["M-PESA", "payment", "digital", "maize"] },
    { title: "EAAPA Market Hub PIN 1234 – who else is using it?", content: "Just discovered the Market Hub data room. The commodity analytics are incredible. Anyone else using the arbitrage tool? Posted $180K revenue projection for my vanilla plot.", category: "Market", author: "Asha Daud", authorId: 11, replies: 31, views: 2140, tags: ["Market Hub", "analytics", "vanilla"] },
    { title: "Youth agripreneurs - how to balance school/work and farming?", content: "I am 22 years old and just started a 3-acre French bean farm. Finding it hard to manage alone. Looking for other youth agripreneurs to share strategies.", category: "Youth", author: "Moses Wanjala", authorId: 8, replies: 16, views: 628, tags: ["youth", "French beans", "time management"] },
  ]).onConflictDoNothing();

  // ========== EVENTS (original) ==========
  console.log("Adding events...");
  await db.insert(eventsTable).values([
    { title: "EAAPA Annual Agribusiness Summit 2025", description: "East Africa's premier agricultural business summit bringing together 2,000 farmers, investors, buyers, and policymakers. 3 days of deal-making, knowledge sharing, and market linkage.", type: "Conference", location: "KICC, Nairobi", country: "Kenya", startDate: "2025-05-14", endDate: "2025-05-16", registrationDeadline: "2025-05-01", attendees: 1240, maxAttendees: 2000, isFeatured: true, tags: ["summit", "annual", "networking", "trade"] },
    { title: "East Africa Horticulture Exhibition & Trade Fair", description: "Premier horticultural trade show showcasing fresh produce, flowers, and value-added products. Attended by 150+ international buyers.", type: "Exhibition", location: "Sarit Expo Centre, Westlands, Nairobi", country: "Kenya", startDate: "2025-04-22", endDate: "2025-04-24", registrationDeadline: "2025-04-10", attendees: 680, maxAttendees: 1500, isFeatured: true, tags: ["horticulture", "trade fair", "buyers", "export"] },
    { title: "Digital Farming Master Class - Naivasha", description: "Hands-on 2-day workshop on precision agriculture using IoT sensors, drone surveillance, and digital soil monitoring.", type: "Workshop", location: "EAAPA Training Centre, Naivasha", country: "Kenya", startDate: "2025-04-14", endDate: "2025-04-15", registrationDeadline: "2025-04-07", attendees: 22, maxAttendees: 30, isFeatured: false, tags: ["precision farming", "IoT", "technology"] },
    { title: "Rwanda Coffee Buyer-Seller Matchmaking Forum", description: "Premium specialty coffee buyer-seller matching event for Rwandan and East African coffee producers targeting European and US specialty buyers.", type: "Conference", location: "Marriott Hotel, Kigali", country: "Rwanda", startDate: "2025-06-05", endDate: "2025-06-06", registrationDeadline: "2025-05-25", attendees: 180, maxAttendees: 300, isFeatured: true, tags: ["coffee", "specialty", "buyer", "Rwanda"] },
    { title: "Agri-Finance Webinar: Accessing Impact Capital", description: "Online webinar featuring venture capital, impact investors, and development finance experts sharing how to fund your agribusiness.", type: "Webinar", location: "Online (Zoom)", country: "Kenya", startDate: "2025-04-08", endDate: "2025-04-08", registrationDeadline: "2025-04-06", attendees: 340, maxAttendees: 1000, isFeatured: false, tags: ["finance", "investment", "webinar"] },
    { title: "Youth Agripreneur Challenge - Finals 2025", description: "National final of the Youth Agripreneur Challenge featuring top 20 youth-led agri-businesses pitching to a panel of investors.", type: "Conference", location: "Radisson Blu, Nairobi", country: "Kenya", startDate: "2025-06-20", endDate: "2025-06-20", registrationDeadline: "2025-05-15", attendees: 85, maxAttendees: 250, isFeatured: true, tags: ["youth", "pitch", "innovation", "awards"] },
  ]).onConflictDoNothing();

  // ========== RESOURCES (original) ==========
  console.log("Adding resources...");
  await db.insert(resourcesTable).values([
    { title: "East Africa Horticulture Export Guide 2025", description: "Comprehensive 85-page guide covering EU market requirements, GlobalGAP certification, post-harvest handling, and logistics for Kenyan horticulture exporters.", category: "Research", fileType: "PDF", fileSize: "4.2 MB", author: "EAAPA Export Team", publishedAt: "2025-01-15", downloads: 1240, tags: ["horticulture", "export", "EU", "certification"] },
    { title: "Dairy Value Chain Financial Models (Excel)", description: "Ready-to-use Excel financial models for dairy cooperative formation, milk pricing, processing economics, and SACCO formation.", category: "Best Practices", fileType: "Excel", fileSize: "1.8 MB", author: "Dr. Robert Waweru", publishedAt: "2025-02-01", downloads: 892, tags: ["dairy", "finance", "cooperative", "model"] },
    { title: "Coffee Quality Standards - East Africa Buyer Expectations", description: "Video series (6 episodes, 4 hours) showing green bean grading, cupping protocols, and specialty buyer quality requirements.", category: "Training", fileType: "Video", fileSize: "2.1 GB", author: "Coffee Quality Institute", publishedAt: "2024-11-15", downloads: 456, tags: ["coffee", "quality", "cupping", "buyers"] },
    { title: "Kenya Agriculture Policy Digest 2024-2025", description: "Summary of key agricultural policies, tax incentives, and regulatory changes affecting agribusinesses in Kenya.", category: "Policy", fileType: "PDF", fileSize: "2.4 MB", author: "EAAPA Policy Team", publishedAt: "2025-01-20", downloads: 678, tags: ["policy", "Kenya", "regulation", "tax"] },
    { title: "Avocado Production Best Practices - GlobalGAP Aligned", description: "Field guide for avocado farmers aligning production practices with GlobalGAP, TESCO Nurture, and organic certification requirements.", category: "Best Practices", fileType: "PDF", fileSize: "3.1 MB", author: "AgroVision Kenya Ltd", publishedAt: "2024-12-10", downloads: 1560, tags: ["avocado", "GlobalGAP", "organic", "field guide"] },
    { title: "Climate-Smart Agriculture Playbook for East Africa", description: "Practical handbook on climate adaptation strategies, drought-resistant varieties, water harvesting, and carbon markets for EA farmers.", category: "Research", fileType: "PDF", fileSize: "5.6 MB", author: "FAO Kenya + CCAFS", publishedAt: "2025-03-01", downloads: 234, tags: ["climate", "adaptation", "carbon", "handbook"] },
  ]).onConflictDoNothing();

  // ========== SUCCESS STORIES ==========
  console.log("Adding success stories...");
  await db.insert(successStoriesTable).values([
    { agripreneurName: "Amara Nkosi", title: "From 5 Acres to 200: How Data-Driven Farming Built an Export Empire", story: "Starting with just 5 acres and a smartphone, Amara used EAAPA market intelligence to identify premium EU avocado demand. By 2024, she had grown to 200 acres, GlobalGAP certified, exporting 1,200 tons annually to 8 European countries. 'EAAPA's Market Hub showed me the exact price premium I could command if I got certified. That data changed everything.'", sector: "Horticulture", region: "Central Kenya", country: "Kenya", revenueUsd: 480000, jobsCreated: 85, growthPercent: 840, commodities: ["Avocado", "French Beans"], publishedAt: "2025-02-15" },
    { agripreneurName: "David Ochieng", title: "Cooperative Power: How 300 Dairy Farmers Tripled Their Income", story: "David transformed isolated smallholder dairy farmers into a 300-member cooperative with collective bargaining power. Using EAAPA's network, they connected with Brookside and New KCC processors at 40% better farm gate prices. The cooperative now handles 800 tons of milk monthly.", sector: "Dairy", region: "Rift Valley", country: "Kenya", revenueUsd: 320000, jobsCreated: 120, growthPercent: 312, commodities: ["Milk"], publishedAt: "2025-01-20" },
    { agripreneurName: "Jean-Pierre Nziza", title: "Rwanda's Specialty Coffee Star: From Washing Station to Starbucks Reserve", story: "Jean-Pierre connected to Starbucks Reserve through EAAPA's buyer network after years of selling through middlemen at KES 950/kg. Direct specialty trade now fetches $4,500/ton. His community washing station supports 280 smallholder coffee families in Southern Rwanda.", sector: "Coffee", region: "Kigali", country: "Rwanda", revenueUsd: 280000, jobsCreated: 38, growthPercent: 385, commodities: ["Coffee"], publishedAt: "2025-03-01" },
    { agripreneurName: "Asha Daud", title: "The Vanilla Queen of Kenya's Coast: $195K in 3 Acres", story: "Asha pioneered vanilla cultivation on Kenya's coast after EAAPA's AI Layer flagged vanilla as the highest-opportunity spice in the region. She now supplies McCormick and IFF directly, earning $195,000 annually from just 3 acres. A story of patience, precision, and platform intelligence.", sector: "Spices", region: "Coastal Kenya", country: "Kenya", revenueUsd: 195000, jobsCreated: 18, growthPercent: 890, commodities: ["Vanilla"], publishedAt: "2025-02-28" },
    { agripreneurName: "Tigist Bekele", title: "From 1 Hectare to Ethiopia's Floriculture Star: 210 Jobs Created", story: "Tigist started with 1 hectare of roses in Addis Ababa after seeing Kenyan flower export data on EAAPA. Today she employs 210 women workers and ships 200,000 stems weekly to FloraHolland. She credits EAAPA's Market Hub with her initial market intelligence that showed the $780M+ East Africa floriculture opportunity.", sector: "Floriculture", region: "Addis Ababa", country: "Ethiopia", revenueUsd: 395000, jobsCreated: 210, growthPercent: 670, commodities: ["Flowers"], publishedAt: "2025-01-10" },
  ]).onConflictDoNothing();

  // ========== KNOWLEDGE (original) ==========
  console.log("Adding knowledge...");
  await db.insert(knowledgeTable).values([
    { title: "Understanding East Africa Commodity Price Drivers", description: "Deep dive into the 12 key factors driving commodity prices in East Africa: weather, global demand, currency, logistics, and policy.", category: "Market Trends", tags: ["prices", "commodity", "market"], views: 2840, author: "EAAPA Analytics Team", publishedAt: "2025-02-15" },
    { title: "The Complete Guide to Avocado Export Certification", description: "Step-by-step guide to obtaining GlobalGAP, Rainforest Alliance, and TESCO Nurture certifications for Kenyan avocado farmers.", category: "Agronomy", tags: ["avocado", "certification", "export", "GlobalGAP"], views: 4120, author: "AgroVision Kenya Ltd", publishedAt: "2025-01-20" },
    { title: "AgriFintech in East Africa: A Complete Guide to Digital Finance", description: "Overview of mobile lending, digital payments, crop insurance, and Islamic agricultural finance options for East African farmers.", category: "Finance", tags: ["fintech", "credit", "mobile money", "insurance"], views: 1890, author: "Nile Basin AgriFinance", publishedAt: "2025-03-05" },
    { title: "Climate Change Adaptation for East Africa Farmers", description: "Science-based strategies for crop selection, soil management, water harvesting, and market diversification in a changing climate.", category: "Policy", tags: ["climate", "adaptation", "resilience"], views: 1340, author: "FAO East Africa", publishedAt: "2024-12-01" },
    { title: "Precision Agriculture on a Budget: IoT for Smallholders", description: "How East African smallholders are using low-cost IoT sensors, satellite imagery, and mobile apps to improve yields by 30-40%.", category: "Technology", tags: ["precision agriculture", "IoT", "technology", "smallholder"], views: 3210, author: "EAAPA Tech Team", publishedAt: "2025-01-30" },
  ]).onConflictDoNothing();

  // ========== ANNOUNCEMENTS ==========
  console.log("Adding announcements...");
  await db.insert(announcementsTable).values([
    { title: "EAAPA Market Hub Layer 3 AI System Upgrade", content: "We have upgraded the Market Hub AI Engine with new scenario simulation capabilities and global arbitrage tracking. Log in with your executive PIN to access enhanced features.", type: "feature", priority: "high", targetAudience: ["all"], isActive: true, publishedAt: new Date() },
    { title: "New Partnership: EAAPA x Safaricom M-PESA", content: "EAAPA members can now receive payments directly to their M-PESA wallet for trade transactions on the platform. No bank account required.", type: "partnership", priority: "normal", targetAudience: ["agripreneur", "company"], isActive: true, publishedAt: new Date() },
    { title: "EAAPA Annual Summit 2025 - Registration Now Open", content: "Registration is now open for the EAAPA Annual Agribusiness Summit 2025, May 14-16 at KICC Nairobi. Early bird registration closes April 15.", type: "event", priority: "high", targetAudience: ["all"], isActive: true, publishedAt: new Date() },
  ]).onConflictDoNothing();

  // ========== NEWS ==========
  console.log("Adding news...");
  await db.insert(newsTable).values([
    { title: "Kenya Avocado Exports Hit $850M Record in 2024", slug: "kenya-avocado-exports-record-2024", summary: "Kenya's avocado export earnings reached $850 million in 2024, a 28% increase driven by strong EU demand and GlobalGAP adoption.", content: "Kenya's avocado industry achieved record export earnings of $850 million in 2024, with a 28% increase year-on-year. The Horticulture Crops Directorate attributed the growth to increased GlobalGAP adoption among smallholder farmers, facilitated partly by EAAPA's certification support program. Dutch and UK buyers accounted for 65% of volumes.", category: "industry", author: "EAAPA News Desk", tags: ["avocado", "export", "Kenya", "record"], status: "published", views: 3840, isFeatured: true, publishedAt: new Date("2025-01-15") },
    { title: "Ethiopia Becomes East Africa's 3rd Largest Flower Exporter", slug: "ethiopia-flower-exporter-2025", summary: "Ethiopia's floriculture industry surpassed Tanzania to become the third-largest flower exporter in East Africa, with $320M in annual earnings.", content: "Ethiopia's floriculture sector achieved a major milestone in 2024, generating $320 million in export earnings and surpassing Tanzania to become the region's third-largest exporter behind Kenya and Uganda. The sector employs over 180,000 workers, predominantly women in the Addis Ababa and Amhara regions.", category: "industry", author: "EAAPA News Desk", tags: ["floriculture", "Ethiopia", "export", "employment"], status: "published", views: 2120, isFeatured: true, publishedAt: new Date("2025-02-10") },
    { title: "USAID Announces $50M East Africa Agribusiness Fund", slug: "usaid-50m-agribusiness-fund", summary: "USAID East Africa has launched a $50 million agribusiness fund targeting scalable food security solutions across 7 East African countries.", content: "USAID's East Africa Agribusiness Fund provides grants, technical assistance, and co-investment matching for agribusiness enterprises demonstrating impact on food security, employment creation, and climate resilience. Applications open through June 2025.", category: "funding", author: "EAAPA Policy Desk", tags: ["USAID", "grant", "funding", "food security"], status: "published", views: 5680, isFeatured: true, publishedAt: new Date("2025-03-01") },
    { title: "Rwanda Coffee Hits 5-Year Price High at Mombasa Auction", slug: "rwanda-coffee-price-high-2025", summary: "Rwandan Arabica achieved a 5-year high of $4,850/ton at the East Africa Coffee Exchange, driven by unprecedented US specialty demand.", content: "The East Africa Coffee Exchange reported record prices for Rwandan Arabica this month, with premium washed grades reaching $4,850 per ton. The surge is driven by strong US and Japanese specialty roaster demand and a 15% reduction in Colombian supply due to weather-related crop failures.", category: "market", author: "EAAPA Market Desk", tags: ["coffee", "Rwanda", "price", "specialty"], status: "published", views: 1890, isFeatured: false, publishedAt: new Date("2025-03-15") },
  ]).onConflictDoNothing();

  // ========== BLOG ARTICLES ==========
  await db.insert(blogArticlesTable).values([
    { title: "5 Reasons East Africa's Agriculture is the Next Big Opportunity", slug: "east-africa-agriculture-next-opportunity", excerpt: "Data, demographics, and demand are converging to make East Africa's agricultural sector one of the most attractive investment destinations on the planet.", content: "East Africa's agricultural sector presents a once-in-a-generation investment opportunity. Here's why: 1. The middle class is growing at 4.4% annually, driving protein consumption...", category: "Insights", author: "EAAPA Editorial", readTimeMinutes: 8, tags: ["investment", "opportunity", "East Africa"], status: "featured", views: 4200, likes: 189, isFeatured: true, publishedAt: new Date("2025-02-20") },
    { title: "How to Choose the Right Export Commodity for Your Farm", slug: "choosing-right-export-commodity", excerpt: "A data-driven framework for East African farmers deciding which commodity will maximize their returns and market access.", content: "Choosing the right export commodity is the most important business decision a farmer can make. Using EAAPA Market Hub data, we analyzed 47 commodities across 8 East African countries to identify the highest-opportunity crops for different agro-ecological zones...", category: "Guides", author: "EAAPA Analytics Team", readTimeMinutes: 12, tags: ["export", "commodity", "decision"], status: "published", views: 3120, likes: 142, isFeatured: true, publishedAt: new Date("2025-01-25") },
    { title: "The Truth About GlobalGAP Certification Costs", slug: "globalgap-certification-costs-truth", excerpt: "Breaking down the real costs of GlobalGAP certification and how East African farmers can reduce them by 60% through group certification.", content: "GlobalGAP certification is the key that unlocks European supermarket shelves. But many farmers believe it is too expensive. The truth is more nuanced...", category: "Guides", author: "Fatuma Hassan", readTimeMinutes: 10, tags: ["GlobalGAP", "certification", "costs", "EU"], status: "published", views: 2840, likes: 96, isFeatured: false, publishedAt: new Date("2025-03-05") },
  ]).onConflictDoNothing();

  // ========== FAQs ==========
  await db.insert(faqsTable).values([
    { question: "What is EAAPA and who is it for?", answer: "EAAPA (East Africa Agripreneurs Alliance) is a premium intelligence and networking platform for farmers, agribusinesses, investors, and policymakers across East Africa. It is designed for anyone involved in the agriculture value chain who wants to grow their business using data, networks, and market intelligence.", category: "general", orderIndex: 1 },
    { question: "What is the Market Hub and how do I get access?", answer: "The Market Hub is EAAPA's premium intelligence layer featuring real-time commodity prices, buyer directories, export route analytics, and AI-powered scenario simulations. Access requires an executive PIN, which is provided to verified members. Demo access: enter PIN '1234'.", category: "market_hub", orderIndex: 1 },
    { question: "How do I apply for funding through EAAPA?", answer: "Navigate to the Opportunities section and select 'Funding Programs'. You can apply directly for grants and loans listed on the platform, or submit your investment opportunity for investor matching. All applications are reviewed within 10 business days.", category: "funding", orderIndex: 1 },
    { question: "How does the mentorship program work?", answer: "Verified agripreneurs can browse mentor profiles in the Community section and send a mentorship request. Once accepted, you'll have structured sessions (frequency agreed by both parties) focused on your business goals. Mentor sessions are free for EAAPA members.", category: "mentorship", orderIndex: 1 },
    { question: "What certifications does EAAPA offer?", answer: "EAAPA offers three certifications: the EAAPA Certified Agripreneur (intermediate, 3-year validity), the EAAPA Export Ready Certificate (advanced, 2-year validity), and the EAAPA Mentor Accreditation (expert, 5-year validity). All are recognized by EU buyers and development finance institutions.", category: "certifications", orderIndex: 1 },
  ]).onConflictDoNothing();

  // ========== TESTIMONIALS ==========
  await db.insert(testimonialsTable).values([
    { authorName: "Amara Nkosi", authorTitle: "Avocado Export Farmer", organization: "Muranga Avocado Farm", country: "Kenya", content: "EAAPA's Market Hub changed my life. The buyer intelligence showed me exactly which EU buyers were short on supply and at what price. I signed my first €180,000 contract within 3 weeks of accessing the platform.", rating: 5, isPublished: true, isFeatured: true },
    { authorName: "Samuel Kariuki", authorTitle: "Impact Investor", organization: "Kariuki Capital Partners", country: "Kenya", content: "As an investor, EAAPA is invaluable. The data room shows verified financials, market traction, and growth projections for every agripreneur on the platform. I've made 5 investments through EAAPA connections in the past 18 months.", rating: 5, isPublished: true, isFeatured: true },
    { authorName: "Jean-Pierre Nziza", authorTitle: "Specialty Coffee Producer", organization: "Kigali Hills Coffee", country: "Rwanda", content: "Before EAAPA, I was selling to middlemen at $1.80/kg green bean. EAAPA connected me directly to specialty buyers at $4.50/kg. In one season, my income tripled. The platform paid for itself 100 times over.", rating: 5, isPublished: true, isFeatured: true },
    { authorName: "Dr. Benedicte Uwimana", authorTitle: "Coffee Development Expert", organization: "UN FAO (Retired)", country: "Rwanda", content: "I've worked with dozens of agricultural platforms in my career. EAAPA is genuinely different - it combines real market intelligence with a deeply connected practitioner network. The mentorship matching is world-class.", rating: 5, isPublished: true, isFeatured: false },
  ]).onConflictDoNothing();

  // ========== CASE STUDIES ==========
  await db.insert(caseStudiesTable).values([
    { title: "AgroVision Kenya: 10,000 Farmers Connected to Data-Driven Markets", summary: "How AgroVision Kenya used EAAPA infrastructure to connect 10,000 smallholder farmers to verified buyers, reducing transaction costs by 35%.", content: "AgroVision Kenya partnered with EAAPA in 2022 to integrate their farmer app with EAAPA's Market Hub data layer. Within 18 months, 10,000 farmers could access real-time price data, receive alerts, and connect with buyers directly.", organization: "AgroVision Kenya Ltd", sector: "AgriTech", country: "Kenya", commodities: ["Multiple"], challenge: "Smallholder farmers had no access to real market prices, resulting in 40-60% price exploitation by middlemen.", solution: "Integrated EAAPA Market Hub API with AgroVision mobile app. Farmers received SMS price alerts and could list produce for direct buyer matching.", results: "35% reduction in middleman margin. Average farm income increased by $380/year. 2,400 direct buyer-farmer matches in year 1.", keyMetrics: { farmersConnected: 10000, incomeIncrease: "35%", directMatches: 2400 }, status: "published", publishedAt: "2025-02-01" },
    { title: "Rift Valley Dairy Cooperative: How 300 Farmers Tripled Their Collective Bargaining", summary: "Cooperative formation strategy using EAAPA's network tools to aggregate 300 dairy farmers into a single negotiating bloc with processors.", content: "David Ochieng used EAAPA's Project Rooms feature to coordinate 300 dairy farmers across the Rift Valley into a formal cooperative. Collective milk volumes gave them leverage to negotiate directly with Brookside at 42% above individual farmer gate prices.", organization: "Rift Valley Dairy Cooperative", sector: "Dairy", country: "Kenya", commodities: ["Milk", "Dairy Products"], challenge: "300 isolated smallholder dairy farmers receiving prices 40-60% below processor gate price due to middlemen and price fragmentation.", solution: "Used EAAPA Project Rooms to organize farmers, negotiate group contracts with Brookside and New KCC, and establish centralized cooling infrastructure.", results: "42% increase in average farm gate milk price. Monthly cooperative revenue: KES 4.4M. 120 permanent jobs created.", keyMetrics: { members: 300, priceIncrease: "42%", monthlyRevenue: "KES 4.4M" }, status: "published", publishedAt: "2025-03-01" },
  ]).onConflictDoNothing();

  // ========== AI OPPORTUNITIES ==========
  console.log("Adding AI opportunities...");
  await db.insert(aiOpportunitiesTable).values([
    { commodityName: "Vanilla", title: "CRITICAL: Global Vanilla Supply Deficit - 3-Year Window of Exceptional Returns", description: "AI forecasting models detect a 22,000-ton global vanilla supply gap driven by Madagascar drought. East Africa growers can capture $120K/ton spot prices for the next 24-36 months.", opportunityScore: 97, potentialRevenueUsd: "195000", targetBuyers: ["McCormick", "IFF", "Symrise", "Prova"], targetMarkets: ["USA", "France", "Germany", "Japan"], bestTimeframe: "Immediately - Plant Q2 2025", suggestedAcreage: "3", yieldProjectionTons: "1.2", requiredInvestment: "45000", riskLevel: "low", confidencePercent: 94, isActive: true, validUntil: "2026-12-31" },
    { commodityName: "Macadamia", title: "China Macadamia Processing Gap: 8,000-Ton Immediate Off-Take", description: "Chinese macadamia processors have reported an 8,000-ton kernel deficit due to Australian harvest failure. Premium Grade 0 at $3,200/ton with forward contract availability.", opportunityScore: 91, potentialRevenueUsd: "135000", targetBuyers: ["Mauna Loa", "Nuti Free", "China Nut Corp"], targetMarkets: ["China", "USA", "Germany"], bestTimeframe: "Q2 2025", suggestedAcreage: "30", yieldProjectionTons: "25", requiredInvestment: "85000", riskLevel: "low", confidencePercent: 89, isActive: true, validUntil: "2026-06-30" },
    { commodityName: "Avocado (Hass)", title: "EU Avocado Demand Spike: Mexico Supply Disruption Creates $850/ton Premium", description: "Mexican avocado export restrictions have reduced EU supply by 180,000 tons. Kenyan Hass avocados at $850/ton with urgent buyer requests from 6 Dutch importers.", opportunityScore: 94, potentialRevenueUsd: "95000", targetBuyers: ["Greenyard Fresh NL", "Dole UK", "METRO AG", "Albert Heijn"], targetMarkets: ["Netherlands", "Germany", "UK", "France"], bestTimeframe: "Next 90 days", suggestedAcreage: "50", yieldProjectionTons: "180", requiredInvestment: "120000", riskLevel: "low", confidencePercent: 91, isActive: true, validUntil: "2025-09-30" },
    { commodityName: "Flowers (Roses)", title: "Valentine + Mother's Day Season: FloraHolland Allocation Window", description: "FloraHolland auction sees 18% above-average demand for Feb-May season. Secure forward sales contracts now for Hybrid Tea and spray roses.", opportunityScore: 86, potentialRevenueUsd: "148000", targetBuyers: ["FloraHolland", "Dümmen Orange", "Kenflora"], targetMarkets: ["Netherlands", "Germany", "France", "UK"], bestTimeframe: "Lock in by March 31, 2025", suggestedAcreage: "8", yieldProjectionTons: "24", requiredInvestment: "65000", riskLevel: "medium", confidencePercent: 82, isActive: true, validUntil: "2025-05-31" },
    { commodityName: "Coffee (Arabica)", title: "Specialty Coffee: Japan Roasters Seeking Direct East Africa Origin", description: "Japanese specialty roasters are actively seeking direct single-origin East Africa Arabica. Cup score 85+ commands $5,000-6,000/ton. Rwanda, Kenya, and Ethiopia origins preferred.", opportunityScore: 88, potentialRevenueUsd: "120000", targetBuyers: ["Nespresso Japan", "Fuglen Coffee", "Blue Bottle"], targetMarkets: ["Japan", "South Korea", "Singapore"], bestTimeframe: "Q3 2025 harvest", suggestedAcreage: "20", yieldProjectionTons: "15", requiredInvestment: "35000", riskLevel: "medium", confidencePercent: 85, isActive: true, validUntil: "2026-03-31" },
  ]).onConflictDoNothing();

  // ========== SIGNALS ==========
  await db.insert(signalsTable).values([
    { type: "price_spike", commodityName: "Vanilla", title: "Vanilla Spot Price Alert: +$15,000/ton in 7 Days", description: "Madagascar vanilla supply disruption causing global spot prices to surge. New York spot at $135,000/ton.", strength: 95, direction: "up", region: "Global", country: null, source: "Chicago Mercantile Exchange", isActionable: true },
    { type: "demand_surge", commodityName: "Avocado (Hass)", title: "EU Avocado Demand 40% Above Seasonal Average", description: "Dutch and UK supermarket avocado orders up 40% vs seasonal norm. Urgent buyer requests across 6 importers.", strength: 88, direction: "up", region: "Europe", country: null, source: "FloraHolland / Greenyard Intelligence", isActionable: true },
    { type: "supply_gap", commodityName: "Macadamia", title: "Australian Macadamia Crop Failure: 12,000-Ton Deficit", description: "La Niña event causes 35% Australian macadamia crop failure. Asian processors urgently sourcing from East Africa.", strength: 92, direction: "up", region: "Asia-Pacific", country: "Australia", source: "INC World Nut Report", isActionable: true },
    { type: "weather_risk", commodityName: "Coffee (Arabica)", title: "La Niña Moisture Risk for Central Kenya Coffee Q2", description: "Meteorological forecast: above-normal rainfall risk for Central Kenya March-May. Risk of coffee berry disease increase.", strength: 65, direction: "down", region: "Central Kenya", country: "Kenya", source: "Kenya Meteorological Department", isActionable: true },
    { type: "new_buyer", commodityName: "Tilapia (Fish)", title: "New UAE Buyer: Dubai hypermarket chain seeking 500T/year tilapia", description: "Lulu Hypermarket Group (UAE) is actively sourcing fresh and frozen tilapia from East Africa. Buyer representative visiting Nairobi in April.", strength: 78, direction: "up", region: "Middle East", country: "UAE", source: "EAAPA Buyer Intelligence Network", isActionable: true },
  ]).onConflictDoNothing();

  // ========== AI RECOMMENDATIONS ==========
  await db.insert(aiRecommendationsTable).values([
    { type: "market_timing", memberId: 1, title: "Sell Avocado Now: EU Premium Window Closing in 45 Days", description: "Mexico supply restrictions creating $850/ton EU premium. Your 50MT batch should be dispatched by April 15 to capture peak pricing.", rationale: "Market analysis shows EU avocado prices declining 15-20% after April 30 as South American supply returns.", actionItems: ["Contact Greenyard Fresh NL immediately", "Book Nairobi → Schiphol cargo by March 28", "Prepare GlobalGAP certification docs"], estimatedBenefit: "$42,500 additional revenue vs waiting", confidencePercent: 91, priority: "high", isActed: false },
    { type: "buyer_match", memberId: 1, title: "AI Match: Greenyard Fresh NL - 93% Compatibility Score", description: "Greenyard Fresh NL is seeking reliable 12-month supply contracts for 1,120 tons/month Hass avocados. Your GlobalGAP status and Central Kenya location are ideal.", rationale: "Matching criteria: GlobalGAP certified, Hass variety, >100MT capacity, Kenya location, cold chain access.", actionItems: ["Send introduction email with product specification sheet", "Arrange sample shipment (200kg)", "Request contract negotiation call"], estimatedBenefit: "Potential €18.5M 5-year supply contract", confidencePercent: 93, priority: "high", isActed: false },
    { type: "funding", memberId: 11, title: "Apply for USAID Agribusiness SME Grant - Match Score 87%", description: "Your vanilla operation matches 87% of USAID East Africa SME Fund criteria. Deadline: May 31, 2025.", rationale: "Your business profile: 3 acres organic vanilla, verified by EAAPA, international buyers, direct export, women-led enterprise.", actionItems: ["Download application form from usaid.gov", "Prepare business plan with financial projections", "Get EAAPA endorsement letter"], estimatedBenefit: "Up to $500,000 grant, no equity dilution", confidencePercent: 87, priority: "high", isActed: false },
  ]).onConflictDoNothing();

  // ========== PREDICTION MODELS ==========
  await db.insert(predictionModelsTable).values([
    { name: "East Africa Price Forecast LSTM", type: "price_forecast", version: "2.1", description: "Long Short-Term Memory neural network trained on 5 years of East African commodity price data with 87.4% forecast accuracy", accuracy: "87.4", commodities: ["Avocado", "Coffee", "Macadamia", "Tea", "Flowers", "Vanilla"], parameters: { epochs: 150, hiddenLayers: 3, lookbackDays: 90 }, lastTrainedAt: new Date("2025-03-01"), isActive: true },
    { name: "Demand Prediction XGBoost", type: "demand_prediction", version: "1.8", description: "Gradient boosting model predicting commodity demand levels based on 28 input features including global trade, weather, and currency", accuracy: "82.1", commodities: ["All"], parameters: { n_estimators: 500, max_depth: 6, learning_rate: 0.01 }, lastTrainedAt: new Date("2025-02-15"), isActive: true },
    { name: "Buyer Match Recommender", type: "buyer_match", version: "3.0", description: "Collaborative filtering model matching agripreneurs with optimal buyers based on commodity, quality, logistics, and past transactions", accuracy: "91.2", commodities: ["All"], parameters: { algorithm: "ALS", factors: 50 }, lastTrainedAt: new Date("2025-03-10"), isActive: true },
  ]).onConflictDoNothing();

  // ========== NOTIFICATIONS ==========
  console.log("Adding notifications...");
  await db.insert(notificationsTable).values([
    { memberId: 1, type: "alert", title: "Market Alert: Avocado prices up 12%", message: "EU avocado prices have surged 12% this week. Open your Market Hub to see the full report and action recommendations.", entityType: "commodity", entityId: 1, actionUrl: "/market-hub/1", isRead: false },
    { memberId: 1, type: "opportunity", title: "New Investment Opportunity Matched", message: "A new $2.5M equity investment opportunity in horticulture has been matched to your profile. Deadline: June 30, 2025.", entityType: "opportunity", entityId: 1, actionUrl: "/opportunities", isRead: false },
    { memberId: 1, type: "message", title: "Greenyard Fresh NL - New Inquiry", message: "Greenyard Fresh NL has sent you a trade inquiry for 50 tons of Hass avocados at $850/ton. Respond within 48 hours.", isRead: true, readAt: new Date() },
    { memberId: 4, type: "update", title: "Portfolio Update: AgroVision Q1 Returns", message: "Your investment in AgroVision Kenya Ltd has shown 19.5% return in Q1 2025. View full portfolio report.", isRead: false },
    { memberId: 4, type: "opportunity", title: "New Funding Round: EastAfrica Fresh Logistics", message: "EastAfrica Fresh Logistics has opened a $5M growth round led by CDC Group. Your deal flow notification.", isRead: false },
  ]).onConflictDoNothing();

  // ========== DASHBOARDS ==========
  console.log("Adding dashboards...");
  const dashboardIds = await db.insert(dashboardsTable).values([
    { name: "Admin Dashboard", slug: "admin", description: "Full platform overview for EAAPA administrators", role: "admin", isDefault: true, isPublic: false },
    { name: "Agripreneur Dashboard", slug: "agripreneur", description: "Farm performance, market intelligence, and opportunities for agripreneurs", role: "agripreneur", isDefault: true, isPublic: false },
    { name: "Investor Dashboard", slug: "investor", description: "Portfolio performance, deal flow, and impact metrics for investors", role: "investor", isDefault: true, isPublic: false },
    { name: "Public Impact Dashboard", slug: "impact", description: "Public-facing impact metrics and platform statistics", role: "public", isDefault: false, isPublic: true },
  ]).returning({ id: dashboardsTable.id }).onConflictDoNothing();

  if (dashboardIds.length > 0) {
    await db.insert(dashboardWidgetsTable).values([
      { dashboardId: dashboardIds[0].id, title: "Total Members", type: "kpi_card", dataSource: "/api/dashboard/kpis?metric=total_members", position: { x: 0, y: 0, w: 3, h: 2 }, isVisible: true },
      { dashboardId: dashboardIds[0].id, title: "Platform Revenue Generated", type: "kpi_card", dataSource: "/api/dashboard/kpis?metric=total_revenue", position: { x: 3, y: 0, w: 3, h: 2 }, isVisible: true },
      { dashboardId: dashboardIds[0].id, title: "Membership Growth", type: "line_chart", dataSource: "/api/analytics/price-trends", position: { x: 0, y: 2, w: 6, h: 4 }, isVisible: true },
      { dashboardId: dashboardIds[0].id, title: "Top Commodities by Market Size", type: "bar_chart", dataSource: "/api/market/commodities", position: { x: 6, y: 0, w: 6, h: 4 }, isVisible: true },
      { dashboardId: dashboardIds[1].id, title: "Farm Revenue", type: "kpi_card", dataSource: "/api/dashboard/kpis?metric=farm_revenue", position: { x: 0, y: 0, w: 3, h: 2 }, isVisible: true },
      { dashboardId: dashboardIds[2].id, title: "Portfolio Value", type: "kpi_card", dataSource: "/api/dashboard/kpis?metric=portfolio_value", position: { x: 0, y: 0, w: 3, h: 2 }, isVisible: true },
    ]).onConflictDoNothing();
  }

  // ========== KPIs ==========
  await db.insert(kpisTable).values([
    { name: "Total Platform Members", category: "membership", description: "Total registered and verified members", currentValue: "4287", targetValue: "10000", unit: "members", period: "cumulative", trend: "up", percentageChange: "12.4" },
    { name: "Active Agripreneurs", category: "membership", description: "Agripreneurs with at least 1 active listing or project", currentValue: "2840", targetValue: "6000", unit: "members", period: "monthly", trend: "up", percentageChange: "18.2" },
    { name: "Total Market Value Created", category: "impact", description: "Cumulative market value attributed to EAAPA connections", currentValue: "284000000", targetValue: "500000000", unit: "USD", period: "cumulative", trend: "up", percentageChange: "31.2" },
    { name: "Jobs Created", category: "impact", description: "Total jobs created by EAAPA member enterprises", currentValue: "18420", targetValue: "50000", unit: "jobs", period: "cumulative", trend: "up", percentageChange: "24.7" },
    { name: "Total Investments Facilitated", category: "financial", description: "Total investment capital deployed through EAAPA connections", currentValue: "48500000", targetValue: "100000000", unit: "USD", period: "cumulative", trend: "up", percentageChange: "42.3" },
    { name: "Active Training Enrollments", category: "training", description: "Currently enrolled participants across all training programs", currentValue: "1240", targetValue: "3000", unit: "participants", period: "monthly", trend: "up", percentageChange: "15.8" },
    { name: "Commodities Tracked", category: "market", description: "Number of commodity markets monitored in Market Hub", currentValue: "47", targetValue: "100", unit: "commodities", period: "cumulative", trend: "up", percentageChange: "4.8" },
    { name: "Countries Reached", category: "impact", description: "Countries with active EAAPA members", currentValue: "8", targetValue: "15", unit: "countries", period: "cumulative", trend: "up", percentageChange: "0" },
  ]).onConflictDoNothing();

  // ========== REPORTS ==========
  await db.insert(reportsTable).values([
    { title: "Q1 2025 East Africa Commodity Market Report", type: "market", description: "Quarterly analysis of commodity prices, trade volumes, and market opportunities across 10 major East African commodities.", period: "Q1 2025", status: "ready", isScheduled: true, schedule: "quarterly" },
    { title: "EAAPA Member Impact Report 2024", type: "impact", description: "Annual report on platform impact: members, revenue generated, jobs created, and market linkages facilitated.", period: "2024 Annual", status: "ready", isScheduled: true, schedule: "annually" },
    { title: "Investment Portfolio Performance - Q1 2025", type: "financial", description: "Portfolio-level performance across all investments tracked on the EAAPA platform, including IRR, multiple, and impact metrics.", period: "Q1 2025", status: "ready", isScheduled: true, schedule: "quarterly" },
    { title: "Training Program Completion Analysis", type: "membership", description: "Analysis of training program completion rates, certification outcomes, and member skill development.", period: "2024-2025", status: "ready" },
  ]).onConflictDoNothing();

  // ========== IMPACT METRICS ==========
  await db.insert(impactMetricsTable).values([
    { metric: "Total Agripreneurs", category: "membership", value: "4287", unit: "members", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Market Value Created", category: "impact", value: "284000000", unit: "USD", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Jobs Created", category: "impact", value: "18420", unit: "jobs", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Women Farmers Reached", category: "impact", value: "2140", unit: "members", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Youth Agripreneurs (18-35)", category: "membership", value: "1820", unit: "members", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Export Contracts Facilitated", category: "financial", value: "342", unit: "contracts", period: "2025-Q1", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Training Certificates Issued", category: "training", value: "2840", unit: "certificates", period: "cumulative", country: "East Africa", recordedAt: "2025-03-31" },
    { metric: "Investment Capital Deployed", category: "financial", value: "48500000", unit: "USD", period: "cumulative", country: "East Africa", recordedAt: "2025-03-31" },
  ]).onConflictDoNothing();

  // ========== SYSTEM SETTINGS ==========
  await db.insert(systemSettingsTable).values([
    { key: "platform_name", value: "EAAPA", type: "string", category: "general", description: "Platform name", isPublic: true },
    { key: "platform_version", value: "2.0.0", type: "string", category: "general", description: "Platform version", isPublic: true },
    { key: "market_hub_pin", value: "1234", type: "string", category: "security", description: "Default Market Hub access PIN", isPublic: false },
    { key: "market_hub_pin_alt", value: "0000", type: "string", category: "security", description: "Alternative demo Market Hub PIN", isPublic: false },
    { key: "maintenance_mode", value: "false", type: "boolean", category: "system", description: "Enable maintenance mode", isPublic: true },
    { key: "max_upload_size_mb", value: "50", type: "number", category: "system", description: "Maximum file upload size", isPublic: true },
    { key: "session_timeout_minutes", value: "480", type: "number", category: "security", description: "User session timeout", isPublic: false },
    { key: "support_email", value: "support@eaapa.org", type: "string", category: "general", description: "Support email address", isPublic: true },
    { key: "default_currency", value: "KES", type: "string", category: "market", description: "Default currency for market data", isPublic: true },
    { key: "market_hub_currencies", value: "KES,UGX,TZS,RWF,ETB,USD,EUR", type: "string", category: "market", description: "Supported Market Hub currencies", isPublic: true },
  ]).onConflictDoNothing();

  // ========== FEATURE FLAGS ==========
  await db.insert(featureFlagsTable).values([
    { name: "ai_scenario_simulator", description: "Enable AI Layer 3 scenario simulator", isEnabled: true, rolloutPercent: 100 },
    { name: "ai_price_forecast", description: "Enable 12-month AI price forecasting", isEnabled: true, rolloutPercent: 100 },
    { name: "smart_contracts", description: "Enable blockchain smart contract execution", isEnabled: false, rolloutPercent: 0 },
    { name: "video_kyc", description: "Enable video KYC verification", isEnabled: false, rolloutPercent: 10 },
    { name: "push_notifications", description: "Enable web push notifications", isEnabled: true, rolloutPercent: 80 },
    { name: "arbitrage_tracking", description: "Enable global arbitrage tracking in AI Layer", isEnabled: true, rolloutPercent: 100 },
  ]).onConflictDoNothing();

  // ========== CAMPAIGNS ==========
  await db.insert(campaignsTable).values([
    { name: "Q2 2025 Export Push", type: "email", status: "active", description: "Email campaign targeting verified agripreneurs to export opportunities", targetAudience: ["agripreneur"], budget: "5000", currency: "USD", startDate: "2025-04-01", endDate: "2025-06-30", sentCount: 1240, openCount: 680, clickCount: 245, conversionCount: 42 },
    { name: "Investor Origination - Q2 2025", type: "email", status: "active", description: "Investment opportunity origination campaign for verified investors", targetAudience: ["investor"], budget: "3000", currency: "USD", startDate: "2025-04-01", endDate: "2025-06-30", sentCount: 342, openCount: 220, clickCount: 98, conversionCount: 18 },
  ]).onConflictDoNothing();

  // ========== LEADS ==========
  await db.insert(leadsTable).values([
    { firstName: "James", lastName: "Kipchoge", email: "james.kipchoge@gmail.com", phone: "+254712345678", organization: "Kipchoge Farms", country: "Kenya", interestedIn: ["Avocado Export", "GlobalGAP Certification"], status: "qualified", source: "website", score: 82 },
    { firstName: "Miriam", lastName: "Oloo", email: "miriam.oloo@yahoo.com", phone: "+254723456789", country: "Kenya", interestedIn: ["Training Programs", "Youth Agripreneur Fund"], status: "contacted", source: "referral", score: 65 },
    { firstName: "Abdullah", lastName: "Hassan", email: "abdullah@dubaifoodgroup.ae", phone: "+971501234567", organization: "Dubai Food Group", country: "UAE", interestedIn: ["Avocado Import", "Macadamia", "Vanilla"], status: "qualified", source: "trade_show", score: 90 },
    { firstName: "Yuki", lastName: "Tanaka", email: "yuki.tanaka@specialtycafe.jp", phone: "+81901234567", organization: "Specialty Café Tokyo", country: "Japan", interestedIn: ["Rwanda Coffee", "Ethiopia Coffee", "Single Origin"], status: "new", source: "website", score: 75 },
    { firstName: "Sophia", lastName: "Nakamura", email: "sophia.n@agrivc.com", phone: "+14151234567", organization: "AgriVC Fund", country: "USA", interestedIn: ["AgriTech Investment", "Series A", "East Africa"], status: "new", source: "linkedin", score: 88 },
  ]).onConflictDoNothing();

  // ========== DISPUTES ==========
  await db.insert(disputesTable).values([
    { caseNumber: "DSP-2025-001", complainantId: 1, complainantName: "Amara Nkosi", respondentName: "Local Middleman Aggregator", category: "trade", description: "Middleman paid 30% below agreed price for 5-ton avocado batch after contract was signed. Seeking KES 150,000 in compensation.", claimAmount: "KES 150,000", status: "resolved", assignedMediator: "Fatuma Hassan (Certified Mediator)", resolvedAt: new Date("2025-02-15"), resolution: "Mediated settlement: middleman paid KES 120,000 compensation. Contract nullified." },
  ]).onConflictDoNothing();

  // ========== LICENSES ==========
  await db.insert(licensesTable).values([
    { holderId: 1, holderName: "Amara Nkosi", holderType: "individual", licenseType: "Export License", licenseNumber: "KEPHIS-EXP-2025-001", issuingAuthority: "KEPHIS", issueDate: "2024-01-15", expiryDate: "2026-01-14", status: "active", notes: "Avocado and French beans export license" },
    { holderId: 2, holderName: "David Ochieng", holderType: "individual", licenseType: "KDB Processing License", licenseNumber: "KDB-PROC-2024-089", issuingAuthority: "Kenya Dairy Board", issueDate: "2024-06-01", expiryDate: "2025-05-31", status: "active", notes: "Dairy processing and distribution license" },
    { holderId: 6, holderName: "Jean-Pierre Nziza", holderType: "individual", licenseType: "Coffee Export License", licenseNumber: "NAEB-2024-CK-0456", issuingAuthority: "Rwanda NAEB", issueDate: "2024-03-01", expiryDate: "2025-02-28", status: "active", notes: "Specialty Arabica export license" },
    { holderId: 1, holderName: "AgroVision Kenya Ltd", holderType: "company", licenseType: "Business Registration", licenseNumber: "PVT-BRN-2018-KE-12345", issuingAuthority: "Registrar of Companies Kenya", issueDate: "2018-05-10", status: "active" },
  ]).onConflictDoNothing();

  // ========== DEMAND SIGNALS ==========
  await db.insert(demandSignalsTable).values([
    { commodityName: "Avocado (Hass)", signal: "surge", strength: 88, source: "EU Buyer Intelligence", market: "EU", country: "Netherlands", description: "Dutch importers reporting 40% volume deficit vs seasonal norm", validUntil: "2025-05-31" },
    { commodityName: "Vanilla", signal: "critical_shortage", strength: 96, source: "IFF Market Intelligence", market: "Global", description: "Global vanilla extract shortage affecting fragrance and food companies", validUntil: "2026-12-31" },
    { commodityName: "Macadamia", signal: "surge", strength: 92, source: "China Nut Processors Association", market: "China", country: "China", description: "Chinese processing capacity undersupplied by 8,000 tons", validUntil: "2025-12-31" },
  ]).onConflictDoNothing();

  // ========== PRICE TRENDS ==========
  await db.insert(priceTrendsTable).values([
    { commodityId: commodityIds[0]?.id || 1, commodityName: "Avocado (Hass)", period: "2025-Q1", avgPrice: "180", minPrice: "155", maxPrice: "210", currency: "KES", volumeTons: "82000", country: "Kenya", source: "EPZA Market Report" },
    { commodityId: commodityIds[1]?.id || 2, commodityName: "Coffee (Arabica)", period: "2025-Q1", avgPrice: "950", minPrice: "880", maxPrice: "1020", currency: "KES", volumeTons: "12000", country: "Kenya", source: "Nairobi Coffee Exchange" },
    { commodityId: commodityIds[2]?.id || 3, commodityName: "Macadamia", period: "2025-Q1", avgPrice: "680", minPrice: "620", maxPrice: "740", currency: "KES", volumeTons: "15000", country: "Kenya", source: "KEPHIS Trade Data" },
  ]).onConflictDoNothing();

  console.log("✅ EAAPA full production database seeded successfully!");
  console.log("📊 16 modules | 90+ tables | 500+ realistic East African records");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
