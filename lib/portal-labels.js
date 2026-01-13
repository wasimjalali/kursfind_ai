/**
 * Provider Portal Localization Labels
 * Comprehensive bilingual UI labels for the entire Provider Dashboard
 * 
 * Usage:
 * import { getPortalLabels } from '@/lib/portal-labels';
 * const labels = getPortalLabels('en'); // or 'de'
 */

const portalLabels = {
  de: {
    // Navigation
    nav: {
      newCourse: "Neuer Kurs",
      dashboard: "Dashboard",
      applications: "Bewerbungen",
      myCourses: "Meine Kurse",
      analytics: "Analytics",
      notifications: "Benachrichtigungen",
      profile: "Profil",
      backToWeb: "Zurück zur Website",
      openSidebar: "Sidebar öffnen",
      closeSidebar: "Sidebar schließen",
      language: "Sprache",
    },

    // Common/Shared
    common: {
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      update: "Aktualisieren",
      loading: "Laden...",
      active: "Aktiv",
      inactive: "Inaktiv",
      total: "Gesamt",
      views: "Aufrufe",
      clicks: "Klicks",
      courses: "Kurse",
      activeCourses: "Aktive Kurse",
      details: "Details",
      actions: "Aktionen",
      or: "oder",
    },

    // Dashboard Page
    dashboard: {
      welcome: "Willkommen",
      subtitle: "Hier ist eine Übersicht über Ihre Kurse und Performance.",
      latestCourses: "Ihre neuesten Kurse",
      noCourses: "Noch keine Kurse",
      noCoursesDesc: "Erstellen Sie Ihren ersten Kurs, um loszulegen.",
      createFirstCourse: "Ersten Kurs erstellen",
    },

    // Applications Page
    applications: {
      title: "Bewerbungen",
      subtitle: "Verwalten Sie Ihre Kursbewerbungen",
      exportCSV: "Als CSV exportieren",
      totalApplications: "Gesamt Bewerbungen",
      newApplications: "Neue Bewerbungen",
      thisMonth: "Diesen Monat",
      conversionRate: "Conversion Rate",
      noApplications: "Noch keine Bewerbungen",
      noApplicationsDesc: "Bewerbungen werden hier angezeigt, sobald Studenten sich bewerben.",
      // Table headers
      table: {
        status: "Status",
        name: "Name",
        email: "Email",
        phone: "Telefon",
        course: "Kurs",
        funding: "Förderung",
        date: "Datum",
        actions: "Aktionen",
      },
      // Status labels
      status: {
        new: "Neu",
        contacted: "Kontaktiert",
        converted: "Angenommen",
        rejected: "Abgelehnt",
      },
      // CSV Export headers
      csv: {
        status: "Status",
        firstName: "Vorname",
        lastName: "Nachname",
        email: "Email",
        phone: "Telefon",
        course: "Kurs",
        fundingType: "Förderungsart",
        applicationDate: "Bewerbungsdatum",
        message: "Nachricht",
        preferredStartDate: "Bevorzugtes Startdatum",
        fundingApproved: "Förderung genehmigt",
        providerNotes: "Anbieter-Notizen",
        yes: "Ja",
        no: "Nein",
      },
      noExportData: "Keine Bewerbungen zum Exportieren vorhanden.",
    },

    // My Courses Page
    myCourses: {
      title: "Meine Kurse",
      subtitle: "Verwalten Sie Ihre Kursangebote",
      newCourse: "+ Neuen Kurs",
      noCourses: "Noch keine Kurse",
      noCoursesDesc: "Erstellen Sie Ihren ersten Kurs, um loszulegen.",
      createFirstCourse: "Ersten Kurs erstellen",
      // Table headers
      table: {
        course: "Kurs",
        duration: "Dauer",
        location: "Ort",
        start: "Start",
        status: "Status",
        views: "Aufrufe",
        actions: "Aktionen",
      },
      // Delete modal
      deleteModal: {
        title: "Kurs löschen?",
        warning: "Diese Aktion kann nicht rückgängig gemacht werden.",
        deleting: "Löschen...",
      },
      deleteError: "Fehler beim Löschen des Kurses",
    },

    // Analytics Page
    analytics: {
      title: "Analytics",
      subtitle: "Übersicht über Ihre Kurs-Performance",
      totalViews: "Gesamt Aufrufe",
      totalClicks: "Gesamt Klicks",
      conversionRate: "Conversion Rate",
      topCourses: "Top Kurse",
      noData: "Noch keine Daten verfügbar",
    },

    // Notifications Page
    notifications: {
      title: "Benachrichtigungen",
      subtitle: "Bleiben Sie über neue Bewerbungen und wichtige Updates informiert.",
      all: "Alle",
      unread: "Ungelesen",
      markAllRead: "Alle als gelesen markieren",
      noNotifications: "Keine Benachrichtigungen",
      noUnreadNotifications: "Keine ungelesenen Benachrichtigungen",
      allReadDesc: "Sie haben alle Benachrichtigungen gelesen.",
      noNotificationsDesc: "Es liegen derzeit keine Benachrichtigungen vor.",
      newApplication: "Neue Bewerbung",
      appliedFor: "hat sich für beworben.",
      // Time ago
      timeAgo: {
        justNow: "Gerade eben",
        minute: "vor 1 Minute",
        minutes: "vor {n} Minuten",
        hour: "vor 1 Stunde",
        hours: "vor {n} Stunden",
        day: "vor 1 Tag",
        days: "vor {n} Tagen",
      },
    },

    // Profile Page
    profile: {
      title: "Profil bearbeiten",
      subtitle: "Verwalten Sie Ihre Unternehmensinformationen",
      updateButton: "Profil aktualisieren",
      saving: "Wird gespeichert...",
      successMessage: "Profil erfolgreich aktualisiert! Die Änderungen werden auf allen Ihren Kursen angezeigt.",
      errorMessage: "Fehler beim Speichern. Bitte versuchen Sie es erneut.",
      // Tabs
      tabs: {
        basic: "Grundinformationen",
        contact: "Kontaktdaten",
        address: "Adresse",
        about: "Über uns",
        certifications: "Zertifizierungen",
        faq: "FAQ",
      },
      // Form labels
      form: {
        logo: "Firmenlogo",
        uploadLogo: "Logo hochladen",
        logoUrl: "Logo-URL eingeben",
        companyName: "Firmenname",
        contactPerson: "Ansprechpartner",
        email: "E-Mail",
        phone: "Telefon",
        website: "Website",
        street: "Straße",
        postalCode: "PLZ",
        city: "Stadt",
        description: "Beschreibung (Über den Anbieter)",
        descriptionHint: "Diese Beschreibung wird auf allen Ihren Kursseiten unter \"Über den Anbieter\" angezeigt.",
        descriptionPlaceholder: "Beschreiben Sie Ihr Unternehmen, Ihre Expertise und Ihre Werte...",
      },
      // Certifications
      certifications: {
        current: "Aktuelle Zertifizierungen",
        common: "Häufige Zertifizierungen",
        addCustom: "Eigene Zertifizierung hinzufügen",
        add: "Hinzufügen",
        placeholder: "z.B. ISO 27001",
      },
      // FAQ
      faq: {
        title: "Häufig gestellte Fragen",
        addFaq: "+ FAQ hinzufügen",
        noFaqs: "Noch keine FAQs hinzugefügt.",
        noFaqsHint: "Klicken Sie auf \"FAQ hinzufügen\", um eine Frage hinzuzufügen.",
        remove: "Entfernen",
        question: "Frage",
        answer: "Antwort",
        questionPlaceholder: "Wie lange dauert die Ausbildung?",
        answerPlaceholder: "Die Ausbildung dauert in der Regel 12 Monate...",
      },
      // Validation errors
      validation: {
        companyNameRequired: "Firmenname ist erforderlich",
        descriptionRequired: "Beschreibung ist erforderlich",
        phoneRequired: "Telefonnummer ist erforderlich",
        emailRequired: "E-Mail ist erforderlich",
        notLoggedIn: "Nicht angemeldet",
        logoUploadError: "Fehler beim Hochladen des Logos",
      },
    },
  },

  en: {
    // Navigation
    nav: {
      newCourse: "New Course",
      dashboard: "Dashboard",
      applications: "Applications",
      myCourses: "My Courses",
      analytics: "Analytics",
      notifications: "Notifications",
      profile: "Profile",
      backToWeb: "Back to Website",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
      language: "Language",
    },

    // Common/Shared
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      update: "Update",
      loading: "Loading...",
      active: "Active",
      inactive: "Inactive",
      total: "Total",
      views: "Views",
      clicks: "Clicks",
      courses: "Courses",
      activeCourses: "Active Courses",
      details: "Details",
      actions: "Actions",
      or: "or",
    },

    // Dashboard Page
    dashboard: {
      welcome: "Welcome",
      subtitle: "Here is an overview of your courses and performance.",
      latestCourses: "Your latest courses",
      noCourses: "No courses yet",
      noCoursesDesc: "Create your first course to get started.",
      createFirstCourse: "Create first course",
    },

    // Applications Page
    applications: {
      title: "Applications",
      subtitle: "Manage your course applications",
      exportCSV: "Export as CSV",
      totalApplications: "Total Applications",
      newApplications: "New Applications",
      thisMonth: "This Month",
      conversionRate: "Conversion Rate",
      noApplications: "No applications yet",
      noApplicationsDesc: "Applications will appear here once students apply.",
      // Table headers
      table: {
        status: "Status",
        name: "Name",
        email: "Email",
        phone: "Phone",
        course: "Course",
        funding: "Funding",
        date: "Date",
        actions: "Actions",
      },
      // Status labels
      status: {
        new: "New",
        contacted: "Contacted",
        converted: "Accepted",
        rejected: "Rejected",
      },
      // CSV Export headers
      csv: {
        status: "Status",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        course: "Course",
        fundingType: "Funding Type",
        applicationDate: "Application Date",
        message: "Message",
        preferredStartDate: "Preferred Start Date",
        fundingApproved: "Funding Approved",
        providerNotes: "Provider Notes",
        yes: "Yes",
        no: "No",
      },
      noExportData: "No applications to export.",
    },

    // My Courses Page
    myCourses: {
      title: "My Courses",
      subtitle: "Manage your course offerings",
      newCourse: "+ New Course",
      noCourses: "No courses yet",
      noCoursesDesc: "Create your first course to get started.",
      createFirstCourse: "Create first course",
      // Table headers
      table: {
        course: "Course",
        duration: "Duration",
        location: "Location",
        start: "Start",
        status: "Status",
        views: "Views",
        actions: "Actions",
      },
      // Delete modal
      deleteModal: {
        title: "Delete course?",
        warning: "This action cannot be undone.",
        deleting: "Deleting...",
      },
      deleteError: "Error deleting course",
    },

    // Analytics Page
    analytics: {
      title: "Analytics",
      subtitle: "Overview of your course performance",
      totalViews: "Total Views",
      totalClicks: "Total Clicks",
      conversionRate: "Conversion Rate",
      topCourses: "Top Courses",
      noData: "No data available yet",
    },

    // Notifications Page
    notifications: {
      title: "Notifications",
      subtitle: "Stay informed about new applications and important updates.",
      all: "All",
      unread: "Unread",
      markAllRead: "Mark all as read",
      noNotifications: "No notifications",
      noUnreadNotifications: "No unread notifications",
      allReadDesc: "You have read all notifications.",
      noNotificationsDesc: "There are currently no notifications.",
      newApplication: "New Application",
      appliedFor: "has applied for.",
      // Time ago
      timeAgo: {
        justNow: "Just now",
        minute: "1 minute ago",
        minutes: "{n} minutes ago",
        hour: "1 hour ago",
        hours: "{n} hours ago",
        day: "1 day ago",
        days: "{n} days ago",
      },
    },

    // Profile Page
    profile: {
      title: "Edit Profile",
      subtitle: "Manage your company information",
      updateButton: "Update Profile",
      saving: "Saving...",
      successMessage: "Profile updated successfully! Changes will be displayed on all your courses.",
      errorMessage: "Error saving. Please try again.",
      // Tabs
      tabs: {
        basic: "Basic Information",
        contact: "Contact Details",
        address: "Address",
        about: "About Us",
        certifications: "Certifications",
        faq: "FAQ",
      },
      // Form labels
      form: {
        logo: "Company Logo",
        uploadLogo: "Upload logo",
        logoUrl: "Enter logo URL",
        companyName: "Company Name",
        contactPerson: "Contact Person",
        email: "Email",
        phone: "Phone",
        website: "Website",
        street: "Street",
        postalCode: "Postal Code",
        city: "City",
        description: "Description (About the Provider)",
        descriptionHint: "This description will be displayed on all your course pages under \"About the Provider\".",
        descriptionPlaceholder: "Describe your company, expertise, and values...",
      },
      // Certifications
      certifications: {
        current: "Current Certifications",
        common: "Common Certifications",
        addCustom: "Add custom certification",
        add: "Add",
        placeholder: "e.g. ISO 27001",
      },
      // FAQ
      faq: {
        title: "Frequently Asked Questions",
        addFaq: "+ Add FAQ",
        noFaqs: "No FAQs added yet.",
        noFaqsHint: "Click \"Add FAQ\" to add a question.",
        remove: "Remove",
        question: "Question",
        answer: "Answer",
        questionPlaceholder: "How long does the training take?",
        answerPlaceholder: "The training typically takes 12 months...",
      },
      // Validation errors
      validation: {
        companyNameRequired: "Company name is required",
        descriptionRequired: "Description is required",
        phoneRequired: "Phone number is required",
        emailRequired: "Email is required",
        notLoggedIn: "Not logged in",
        logoUploadError: "Error uploading logo",
      },
    },
  },
};

/**
 * Get portal labels for a specific language
 * @param {string} lang - Language code ('de' or 'en')
 * @returns {object} - Labels object for the specified language
 */
export function getPortalLabels(lang = 'de') {
  return portalLabels[lang] || portalLabels.de;
}

/**
 * Get a specific label with fallback
 * @param {string} lang - Language code
 * @param {string} path - Dot-notation path to label (e.g., 'nav.dashboard')
 * @returns {string} - The label or the path if not found
 */
export function getLabel(lang, path) {
  const labels = getPortalLabels(lang);
  const keys = path.split('.');
  let result = labels;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return path as fallback
    }
  }
  
  return result;
}

export default portalLabels;
