// src/services/translation.service.ts
import { LanguageCode } from '../types';

export type Language = LanguageCode;

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Headers
    appName: 'JanMitra',
    tagline: 'Citizen Civic Action & Municipal Portal',
    portalSub: 'Empowering Citizens, Accelerating Resolutions',
    
    // Bottom Tabs
    tabFeed: 'Feed',
    tabMap: 'Civic Map',
    tabPost: 'Post Issue',
    tabActivity: 'Activity',
    tabProfile: 'Profile',
    
    // Top Bar
    locationLabel: 'Location',
    currentLocation: 'Mumbai & Pune Metro',
    searchPlaceholder: 'Search complaints, roads, ward...',
    allStatus: 'All Statuses',
    sortBy: 'Sort by',
    sortNewest: 'Newest First',
    sortNearest: 'Nearest First',
    sortTrending: 'Trending Most',
    
    // Feed sections
    trendingAlert: 'Trending Civic Emergencies',
    allClearTitle: 'All Clear! No complaints in this filter',
    allClearDesc: 'No civic problems matching your current criteria or your area is spick and span!',
    reportBtn: 'Report a Problem',
    pullToRefresh: 'Refresh Complaints',
    
    // Problem Card
    upvotes: 'Upvotes',
    views: 'Views',
    trackStatus: 'Track Status',
    details: 'View Details',
    share: 'Share',
    reportedBy: 'Reported by',
    
    // Post Problem
    postTitle: 'Report Civic Issue',
    postSubtitle: 'Submit photos, exact location, and details for immediate municipal response',
    uploadPhotos: 'Upload Proof Photos (1-5 images)',
    uploadHint: 'Tap to select photos or drag & drop. Geotagged images accelerate field inspection.',
    takePhoto: 'Capture Photo',
    chooseFiles: 'Browse Gallery',
    selectCategory: 'Select Issue Category',
    issueTitleLabel: 'Problem Title',
    issueTitlePlaceholder: 'e.g., Deep crater pothole opposite Metro Station Gate 2',
    issueDescLabel: 'Detailed Description',
    issueDescPlaceholder: 'Describe the hazard, size, traffic danger, duration, and landmarks...',
    voiceDictate: 'Speak to Dictate',
    listening: 'Listening... speak now',
    locationSection: 'Location & Ward Pin',
    useGPS: 'Use Current GPS',
    locating: 'Locating...',
    searchAddress: 'Search location address / ward',
    addressFound: 'Detected Address',
    prioritySection: 'Urgency / Priority Level',
    prioLow: 'Low - Routine Maintenance',
    prioMed: 'Medium - Normal Work Order',
    prioHigh: 'High - Traffic / Public Hazard',
    prioCritical: 'Critical - Immediate Danger to Life',
    submitReport: 'Submit Complaint to JanMitra',
    submitting: 'Verifying & Submitting...',
    submissionSuccess: 'Complaint Registered Successfully! Assigned Ticket #',
    aiCostBanner: 'AI Smart Estimator will calculate materials, budget, and completion time instantly.',
    
    // Problem Details
    problemDetails: 'Complaint Dossier',
    officialTimeline: 'Official Municipal Action Timeline',
    aiAnalysisTitle: 'AI Civic Cost & Work Analysis',
    estBudget: 'Estimated Municipal Budget',
    severity: 'Severity Level',
    completionETA: 'Estimated Completion Time',
    materialsRequired: 'Materials Required',
    workforceEquipment: 'Labor & Equipment Needed',
    expertRecommendations: 'Engineering Recommendations',
    assignedOfficerTitle: 'Assigned Municipal Officer',
    officerDesk: 'Designated Ward Desk',
    callOfficer: 'Direct Helpline',
    chatOfficer: 'Chat with Officer',
    markSolved: 'Mark Resolved (Officer)',
    escalateBtn: 'Escalate to Commissioner',
    resolutionProof: 'Official Resolution Proof & Site Photo',
    
    // Activity
    activityTitle: 'Activity & Notifications',
    tabMyProblems: 'My Complaints',
    tabHelping: 'Community Help',
    tabNotifications: 'Alerts & Updates',
    noMyProblems: 'You have not reported any civic issues yet.',
    noAlerts: "You're all caught up! No unread notifications.",
    markAllRead: 'Mark all as read',
    
    // Officer Portal
    officerPortal: 'NagrikSeva Officer Portal',
    officerBadge: 'GovTech Field Console',
    totalComplaints: 'Total Complaints',
    pendingReview: 'Pending Review',
    inResolution: 'In Resolution',
    resolvedWeek: 'Resolved This Week',
    quickAssign: 'Assign Inspector',
    updateStatusBtn: 'Update Status & Notes',
    uploadResolutionPic: 'Attach Resolution Proof Photo',
    statusNotesPlaceholder: 'Enter official engineering notes, work order number, or contractor update...',
    officerLoginTitle: 'Municipal Officer Login',
    officerLoginSub: 'Authorized civic engineers, inspectors, and ward officers only',
    switchCitizenMode: 'Switch to Citizen View',
    switchOfficerMode: 'Switch to Officer Mode',
    
    // Profile
    profileTitle: 'Citizen Profile',
    statsPosted: 'Reported',
    statsHelping: 'Help Offers',
    statsSolved: 'Resolved',
    govTechDemo: 'GovTech Analytics Demo',
    languageSettings: 'Language / भाषा / भाषा निवडा',
    offlineStatus: 'Offline Mode: Changes saved locally and will sync once reconnected.',
    installPWA: 'Install JanMitra App',
    pwaInstalled: 'App Installed on Device',
    
    // Voice Assistant
    voiceTitle: 'JanMitra Civic Voice Assistant',
    voicePrompt: 'Say commands like: "Report pothole", "Show civic map", "Check status", "Marathi"',
    voiceTry: 'Tap microphone and speak your query',
  },
  hi: {
    // Brand & Headers
    appName: 'जनमित्र',
    tagline: 'नागरिक सेवा एवं नगर निगम शिकायत निवारण मंच',
    portalSub: 'सशक्त नागरिक, त्वरित जन-समाधान',
    
    // Bottom Tabs
    tabFeed: 'शिकायतें',
    tabMap: 'नागरिक मानचित्र',
    tabPost: 'दर्ज करें',
    tabActivity: 'गतिविधि',
    tabProfile: 'प्रोफाइल',
    
    // Top Bar
    locationLabel: 'स्थान',
    currentLocation: 'मुंबई एवं पुणे संभाग',
    searchPlaceholder: 'शिकायत, सड़क या वार्ड खोजें...',
    allStatus: 'सभी स्थितियां',
    sortBy: 'क्रमबद्ध करें',
    sortNewest: 'नवीनतम पहले',
    sortNearest: 'निकटतम पहले',
    sortTrending: 'सर्वाधिक चर्चित',
    
    // Feed sections
    trendingAlert: 'अति-गंभीर नागरिक मुद्दे',
    allClearTitle: 'सब कुछ स्वच्छ! कोई शिकायत नहीं मिली',
    allClearDesc: 'आपके चुने हुए फिल्टर में कोई समस्या नहीं है या आपका क्षेत्र स्वच्छ है!',
    reportBtn: 'समस्या की रिपोर्ट करें',
    pullToRefresh: 'शिकायतें ताज़ा करें',
    
    // Problem Card
    upvotes: 'नागरिक समर्थन',
    views: 'देखा गया',
    trackStatus: 'स्थिति ट्रैक करें',
    details: 'विस्तार से देखें',
    share: 'साझा करें',
    reportedBy: 'नागरिक द्वारा दर्ज',
    
    // Post Problem
    postTitle: 'नागरिक समस्या दर्ज करें',
    postSubtitle: 'नगर निगम की त्वरित कार्रवाई के लिए फोटो और सही स्थान साझा करें',
    uploadPhotos: 'सबूत फोटो अपलोड करें (1-5 फोटो)',
    uploadHint: 'फोटो चुनने के लिए टैप करें। जीपीएस युक्त फोटो से जांच में तेज़ी आती है।',
    takePhoto: 'कैमरा से लें',
    chooseFiles: 'गैलरी से चुनें',
    selectCategory: 'समस्या की श्रेणी चुनें',
    issueTitleLabel: 'समस्या का शीर्षक',
    issueTitlePlaceholder: 'उदा. मेट्रो स्टेशन गेट 2 के सामने गहरा गड्ढा',
    issueDescLabel: 'समस्या का पूरा विवरण',
    issueDescPlaceholder: 'खतरे का प्रकार, आकार, यातायात में बाधा व पहचान चिन्ह बताएं...',
    voiceDictate: 'बोलकर लिखें',
    listening: 'सुन रहे हैं... बोलिए',
    locationSection: 'स्थान व वार्ड चयन',
    useGPS: 'वर्तमान जीपीएस स्थान लें',
    locating: 'स्थान प्राप्त हो रहा है...',
    searchAddress: 'पता या वार्ड खोजें',
    addressFound: 'निर्धारित पता',
    prioritySection: 'प्राथमिकता / गंभीरता स्तर',
    prioLow: 'कम - सामान्य मरम्मत',
    prioMed: 'मध्यम - कार्य आदेश',
    prioHigh: 'उच्च - जन सुरक्षा जोखिम',
    prioCritical: 'अति-गंभीर - जीवन के लिए तत्काल खतरा',
    submitReport: 'जनमित्र पर शिकायत दर्ज करें',
    submitting: 'सत्यापन व पंजीकरण जारी...',
    submissionSuccess: 'शिकायत सफलतापूर्वक दर्ज! टोकन नंबर #',
    aiCostBanner: 'एआई स्मार्ट आकलन सामग्री, लागत और समय का अनुमान तुरंत तैयार करेगा।',
    
    // Problem Details
    problemDetails: 'शिकायत विवरण एवं स्थिति',
    officialTimeline: 'सरकारी कार्रवाई समय-सारणी',
    aiAnalysisTitle: 'एआई नागरिक कार्य एवं लागत विश्लेषण',
    estBudget: 'अनुमानित निगम बजट',
    severity: 'गंभीरता का स्तर',
    completionETA: 'कार्य पूर्ण होने का अनुमानित समय',
    materialsRequired: 'आवश्यक सामग्री',
    workforceEquipment: 'श्रम एवं मशीनरी आवश्यकता',
    expertRecommendations: 'इंजीनियरिंग सिफारिशें',
    assignedOfficerTitle: 'नामित सरकारी अधिकारी',
    officerDesk: 'वार्ड कार्यालय',
    callOfficer: 'हेल्पलाइन कॉल',
    chatOfficer: 'अधिकारी से संदेश संवाद',
    markSolved: 'समाधान अंकित करें (अधिकारी)',
    escalateBtn: 'आयुक्त महोदय को अग्रेषित करें',
    resolutionProof: 'आधिकारिक समाधान प्रमाण व फोटो',
    
    // Activity
    activityTitle: 'मेरी गतिविधियां एवं सूचनाएं',
    tabMyProblems: 'मेरी शिकायतें',
    tabHelping: 'सामुदायिक सहयोग',
    tabNotifications: 'सूचनाएं व अलर्ट',
    noMyProblems: 'आपने अभी तक कोई शिकायत दर्ज नहीं की है।',
    noAlerts: 'कोई नई सूचना नहीं है। सब अपडेटेड है!',
    markAllRead: 'सभी को पढ़ा हुआ अंकित करें',
    
    // Officer Portal
    officerPortal: 'नागरिक सेवा अधिकारी पोर्टल',
    officerBadge: 'फील्ड इंजीनियरिंग डैशबोर्ड',
    totalComplaints: 'कुल शिकायतें',
    pendingReview: 'समीक्षा हेतु लंबित',
    inResolution: 'समाधान प्रक्रिया में',
    resolvedWeek: 'इस सप्ताह निवारित',
    quickAssign: 'अधिकारी सौंपें',
    updateStatusBtn: 'स्थिति व टिप्पणी अद्यतन करें',
    uploadResolutionPic: 'कार्य पूर्णता का फोटो लगाएं',
    statusNotesPlaceholder: 'आधिकारिक कार्य आदेश संख्या या फील्ड निरीक्षण टिप्पणी दर्ज करें...',
    officerLoginTitle: 'नगर निगम अधिकारी लॉगिन',
    officerLoginSub: 'केवल अधिकृत नगर निगम अभियंता व स्वच्छता निरीक्षकों हेतु',
    switchCitizenMode: 'नागरिक दृश्य में बदलें',
    switchOfficerMode: 'अधिकारी दृश्य में बदलें',
    
    // Profile
    profileTitle: 'नागरिक प्रोफाइल',
    statsPosted: 'कुल दर्ज',
    statsHelping: 'सहायता दी',
    statsSolved: 'निवारित',
    govTechDemo: 'गवटेक विश्लेषण डेमो',
    languageSettings: 'भाषा चुनें (Language)',
    offlineStatus: 'ऑफ़लाइन मोड: डेटा सुरक्षित है, इंटरनेट आते ही सिंक होगा।',
    installPWA: 'जनमित्र ऐप इंस्टॉल करें',
    pwaInstalled: 'ऐप फोन में इंस्टॉल है',
    
    // Voice Assistant
    voiceTitle: 'जनमित्र आवाज़ सहायक',
    voicePrompt: 'ऐसे बोलें: "सड़क का गड्ढा रिपोर्ट करें", "नक्शा दिखाएं", "शिकायत स्थिति"',
    voiceTry: 'माइक दबाकर अपनी बात कहें',
  },
  mr: {
    // Brand & Headers
    appName: 'जनमित्र',
    tagline: 'नागरिक सेवा आणि महापालिका तक्रार निवारण मंच',
    portalSub: 'सशक्त नागरिक, जलद निवारण',
    
    // Bottom Tabs
    tabFeed: 'तक्रारी',
    tabMap: 'नागरी नकाशा',
    tabPost: 'नोंदवा',
    tabActivity: 'हालचाली',
    tabProfile: 'माझे खाते',
    
    // Top Bar
    locationLabel: 'स्थान',
    currentLocation: 'मुंबई व पुणे महानगर क्षेत्र',
    searchPlaceholder: 'तक्रार, रस्ता किंवा प्रभाग शोधा...',
    allStatus: 'सर्व स्थिती',
    sortBy: 'क्रमवारी लावा',
    sortNewest: 'नवीनतम आधी',
    sortNearest: 'जवळपास आधी',
    sortTrending: 'चर्चेतील प्रश्न',
    
    // Feed sections
    trendingAlert: 'तातडीचे नागरी प्रश्न',
    allClearTitle: 'सर्व काही सुरळीत! तक्रारी आढळल्या नाहीत',
    allClearDesc: 'आपल्या निकषांनुसार किंवा आपल्या प्रभागात सध्या सर्व व्यवस्थित आहे!',
    reportBtn: 'समस्या नोंदवा',
    pullToRefresh: 'तक्रारी रीफ्रेश करा',
    
    // Problem Card
    upvotes: 'नागरिक पाठिंबा',
    views: 'पाहिले',
    trackStatus: 'प्रगती ट्रॅक करा',
    details: 'तपशील पहा',
    share: 'शेअर करा',
    reportedBy: 'तक्रारदार नागरिक',
    
    // Post Problem
    postTitle: 'नागरी समस्या नोंदवा',
    postSubtitle: 'महापालिकेच्या तात्काळ कारवाईसाठी छायाचित्रे व अचूक स्थान जोडा',
    uploadPhotos: 'पुरावा फोटो अपलोड करा (१-५ फोटो)',
    uploadHint: 'फोटो निवडण्यासाठी टॅप करा. अचूक स्थान असलेले फोटो तपासणीस वेग देतात.',
    takePhoto: 'कॅमेऱ्याने फोटो काढा',
    chooseFiles: 'गॅलरीतून निवडा',
    selectCategory: 'समस्येचा वर्ग निवडा',
    issueTitleLabel: 'समस्येचे शीर्षक',
    issueTitlePlaceholder: 'उदा. मेट्रो स्थानकासमोर रस्त्यावर पडलेला मोठा खड्डा',
    issueDescLabel: 'समस्येचे सविस्तर वर्णन',
    issueDescPlaceholder: 'धोक्याचे स्वरूप, आकार, वाहतूक अडथळा व महत्वाच्या खुणा लिहा...',
    voiceDictate: 'बोलून टाईप करा',
    listening: 'ऐकत आहे... बोला',
    locationSection: 'स्थान व प्रभाग निवड',
    useGPS: 'सध्याचे जीपीएस स्थान वापरा',
    locating: 'स्थान शोधत आहे...',
    searchAddress: 'पत्ता किंवा प्रभाग शोधा',
    addressFound: 'शोधलेला पत्ता',
    prioritySection: 'प्राधान्य व गांभीर्य पातळी',
    prioLow: 'कमी - नियमित दुरुस्ती',
    prioMed: 'मध्यम - दैनंदिन काम',
    prioHigh: 'उच्च - सार्वजनिक धोका',
    prioCritical: 'अति-तातडीचे - जीवितास धोका',
    submitReport: 'जनमित्र वर तक्रार दाखल करा',
    submitting: 'नोंदणी होत आहे...',
    submissionSuccess: 'तक्रार यशस्वीरित्या नोंदवली गेली! तिकीट क्र. #',
    aiCostBanner: 'एआय द्वारे साहित्य, अंदाजे खर्च आणि दुरुस्तीचा कालावधी त्वरित मोजला जाईल.',
    
    // Problem Details
    problemDetails: 'तक्रार सविस्तर माहिती',
    officialTimeline: 'अधिकृत प्रशासकीय कारवाई कालरेषा',
    aiAnalysisTitle: 'एआय नागरी खर्च व तांत्रिक अंदाज',
    estBudget: 'अंदाजित महापालिका खर्च',
    severity: 'गांभीर्याची पातळी',
    completionETA: 'काम पूर्ण होण्याचा अंदाजित कालावधी',
    materialsRequired: 'आवश्यक साहित्य',
    workforceEquipment: 'कामगार व यंत्रसामग्री',
    expertRecommendations: 'अभियांत्रिकी शिफारसी',
    assignedOfficerTitle: 'नेमलेले पालिका अधिकारी',
    officerDesk: 'प्रभाग कार्यालय',
    callOfficer: 'थेट संपर्क',
    chatOfficer: 'अधिकाऱ्याशी संवाद साधा',
    markSolved: 'निवारण पूर्ण (अधिकारी)',
    escalateBtn: 'मा. आयुक्तांकडे वर्ग करा',
    resolutionProof: 'काम पूर्ण झाल्याचा अधिकृत फोटो व पुरावा',
    
    // Activity
    activityTitle: 'माझी नोंद व सूचना',
    tabMyProblems: 'माझ्या तक्रारी',
    tabHelping: 'नागरी सहाय्य',
    tabNotifications: 'सूचना व संदेश',
    noMyProblems: 'आपण अद्याप कोणतीही तक्रार नोंदवलेली नाही.',
    noAlerts: 'कोणतीही प्रलंबित सूचना नाही. सर्व अद्ययावत आहे!',
    markAllRead: 'सर्व वाचले म्हणून चिन्हांकित करा',
    
    // Officer Portal
    officerPortal: 'नागरिक सेवा अधिकारी दालन',
    officerBadge: 'अभियांत्रिकी व स्वच्छता व्यवस्थापन',
    totalComplaints: 'एकूण तक्रारी',
    pendingReview: 'पडताळणी प्रलंबित',
    inResolution: 'काम प्रगतीत',
    resolvedWeek: 'या आठवड्यात पूर्ण',
    quickAssign: 'अधिकारी नियुक्त करा',
    updateStatusBtn: 'स्थिती व शेरा नोंदवा',
    uploadResolutionPic: 'काम पूर्ण झाल्याचे छायाचित्र जोडा',
    statusNotesPlaceholder: 'अधिकृत शेरा, वर्क ऑर्डर क्र. किंवा कंत्राटदार माहिती प्रविष्ट करा...',
    officerLoginTitle: 'महापालिका अधिकारी लॉगिन',
    officerLoginSub: 'केवळ अधिकृत क्षेत्रीय अभियंता व स्वच्छता निरीक्षकांसाठी',
    switchCitizenMode: 'नागरिक दृष्टिक्षेपात जा',
    switchOfficerMode: 'अधिकारी दृष्टिक्षेपात जा',
    
    // Profile
    profileTitle: 'नागरिक प्रोफाईल',
    statsPosted: 'नोंदवलेल्या',
    statsHelping: 'मदत केली',
    statsSolved: 'निवारण झालेले',
    govTechDemo: 'गव्हटेक विश्लेषण डेमो',
    languageSettings: 'भाषा बदला (Language)',
    offlineStatus: 'ऑफलाईन मोड: माहिती सुरक्षित आहे, इंटरनेट येताच अपडेट होईल.',
    installPWA: 'जनमित्र ॲप इन्स्टॉल करा',
    pwaInstalled: 'ॲप मोबाइलमध्ये इन्स्टॉल आहे',
    
    // Voice Assistant
    voiceTitle: 'जनमित्र व्हॉइस सहाय्यक',
    voicePrompt: 'उदा. "रस्त्याचा खड्डा नोंदवा", "नकाशा उघडा", "तक्रारीची स्थिती"',
    voiceTry: 'माईक दाबा आणि बोला',
  },
};

export const translationService = {
  translate: (key: string, lang: LanguageCode = 'en'): string => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  },
  
  getCategoryName: (categoryId: string, lang: LanguageCode = 'en'): string => {
    if (lang === 'hi') {
      const hiMap: Record<string, string> = {
        infrastructure: 'सड़क व पुल',
        sanitation: 'सफाई व कचरा',
        utilities: 'जल व विद्युत',
        safety: 'सुरक्षा खतरे',
        access: 'पैदल व दिव्यांग बाधा',
        environment: 'पर्यावरण',
        public_health: 'जन स्वास्थ्य',
        other: 'अन्य',
      };
      return hiMap[categoryId] || categoryId;
    }
    if (lang === 'mr') {
      const mrMap: Record<string, string> = {
        infrastructure: 'पायाभूत / रस्ते',
        sanitation: 'स्वच्छता व कचरा',
        utilities: 'पाणी व वीज',
        safety: 'सुरक्षा व धोके',
        access: 'पादचारी अडथळे',
        environment: 'पर्यावरण',
        public_health: 'सार्वजनिक आरोग्य',
        other: 'इतर',
      };
      return mrMap[categoryId] || categoryId;
    }
    const enMap: Record<string, string> = {
      infrastructure: 'Infrastructure',
      sanitation: 'Sanitation',
      utilities: 'Utilities',
      safety: 'Safety Hazard',
      access: 'Access Barrier',
      environment: 'Environment',
      public_health: 'Public Health',
      other: 'Other',
    };
    return enMap[categoryId] || categoryId;
  },

  getStatusLabel: (statusKey: string, lang: LanguageCode = 'en'): string => {
    if (lang === 'hi') {
      const map: Record<string, string> = {
        posted: 'दर्ज किया गया',
        submitted: 'दर्ज किया गया',
        being_helped: 'समीक्षाधीन',
        in_progress: 'कार्य प्रगति पर',
        solved: 'समाधान हो गया',
        resolved: 'समाधान हो गया',
        escalated: 'वरिष्ठ स्तर पर वर्ग',
        appeal: 'अपील समीक्षाधीन',
      };
      return map[statusKey] || statusKey;
    }
    if (lang === 'mr') {
      const map: Record<string, string> = {
        posted: 'नोंदणीकृत',
        submitted: 'नोंदणीकृत',
        being_helped: 'पुनरावलोकनात',
        in_progress: 'काम सुरू आहे',
        solved: 'निवारण झाले',
        resolved: 'निवारण झाले',
        escalated: 'वरिष्ठ पातळीवर वर्ग',
        appeal: 'पुनर्विचार याचिका',
      };
      return map[statusKey] || statusKey;
    }
    const map: Record<string, string> = {
      posted: 'Submitted',
      submitted: 'Submitted',
      being_helped: 'In Review',
      in_progress: 'In Progress',
      solved: 'Resolved',
      resolved: 'Resolved',
      escalated: 'Escalated',
      appeal: 'Under Appeal',
    };
    return map[statusKey] || statusKey;
  }
};
