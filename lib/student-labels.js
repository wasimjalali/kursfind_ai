/**
 * Student Dashboard & AI Search Localization Labels
 * Comprehensive bilingual UI labels for the Student Dashboard and AI Search interface
 * 
 * Usage:
 * import { getStudentLabels } from '@/lib/student-labels';
 * const labels = getStudentLabels('en'); // or 'de'
 */

const studentLabels = {
  de: {
    // Navigation
    nav: {
      aiSearch: "KI-Kurssuche",
      dashboard: "Dashboard",
      savedCourses: "Gespeicherte Kurse",
      applications: "Bewerbungen",
      chatHistory: "Chat-Verlauf",
      searchCourses: "Kurse suchen",
      allCourses: "Alle Kurse",
      notifications: "Benachrichtigungen",
      profile: "Profil",
      language: "Sprache",
      openSidebar: "Sidebar öffnen",
      closeSidebar: "Sidebar schließen",
    },

    // Common/Shared
    common: {
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      loading: "Laden...",
      viewAll: "Alle anzeigen →",
      newSearch: "+ Neue Suche",
      discoverCourses: "Kurse entdecken",
      total: "Gesamt",
      pending: "Ausstehend",
      accepted: "Angenommen",
      rejected: "Abgelehnt",
      all: "Alle",
      unread: "Ungelesen",
      continue: "Fortsetzen →",
      select: "Auswählen",
      messages: "Nachrichten",
      created: "Erstellt",
    },

    // AI Search Page (SUCHEN)
    aiSearch: {
      welcome: "Willkommen bei Kursfind AI",
      subtitle: "Finden Sie Ihre perfekte Weiterbildung in Minuten mit KI-Unterstützung",
      poweredBy: "Powered by Powerful AI Engine",
      examplesTitle: "Beispiele, um zu starten:",
      browseAllCourses: "Alle Kurse durchsuchen",
      inputPlaceholder: "z.B. Ich suche einen Webentwicklung Kurs in Berlin mit Bildungsgutschein...",
      disclaimer: "Kursfind AI kann Fehler machen. Überprüfen Sie wichtige Informationen.",
      // Example cards
      examples: {
        ecommerce: {
          title: "E-Commerce Bootcamp",
          description: "Ich suche ein E-Commerce Bootcamp in Berlin oder Remote mit Bildungsgutschein"
        },
        digitalMarketing: {
          title: "Digital Marketing",
          description: "Zeige mir Digital Marketing Bootcamps Online oder Remote mit Bildungsgutschein"
        },
        itProgramming: {
          title: "IT & Programmierung",
          description: "Ich möchte Programmierung lernen, welche IT-Kurse mit Bildungsgutschein gibt es?"
        },
        webdesign: {
          title: "Webdesign & UX",
          description: "Webdesign und UX/UI Design Kurse in Berlin oder Remote mit Bildungsgutschein"
        }
      },
      // Loading states
      loading: {
        analyzing: "Analysiere Ihre Anfrage...",
        searching: "Durchsuche AZAV-Datenbank...",
        personalizing: "Personalisiere Ergebnisse...",
        formulating: "Kursfind AI formuliert..."
      },
      // Chat sidebar
      sidebar: {
        newSearch: "Neue Suche",
        allCourses: "Alle Kurse",
        history: "VERLAUF",
        noChats: "Noch keine Chats"
      }
    },

    // Student Dashboard
    dashboard: {
      greeting: "Hallo",
      subtitle: "Bereit für Ihre nächste Weiterbildung? Entdecken Sie neue Kurse und verfolgen Sie Ihre Bewerbungen.",
      savedCourses: "Gespeicherte Kurse",
      applications: "Bewerbungen",
      lastStatus: "Letzter Status",
      noApplications: "Keine Bewerbungen",
      quickActions: "Schnellaktionen",
      searchCourses: "Kurse durchsuchen",
      searchCoursesDesc: "Finden Sie Ihre Weiterbildung",
      viewSaved: "Gespeicherte ansehen",
      viewSavedDesc: "Ihre Favoriten verwalten",
      viewApplications: "Bewerbungen ansehen",
      viewApplicationsDesc: "Status verfolgen",
      startJourney: "Starten Sie Ihre Weiterbildungsreise",
      startJourneyDesc: "Durchsuchen Sie Kurse, speichern Sie Ihre Favoriten und bewerben Sie sich für Weiterbildungen.",
    },

    // Saved Courses Page
    savedCourses: {
      title: "Gespeicherte Kurse",
      subtitle: "Ihre Favoriten und interessanten Weiterbildungen",
      discoverNew: "+ Neue Kurse entdecken",
      noSavedCourses: "Noch keine gespeicherten Kurse",
      noSavedCoursesDesc: "Durchsuchen Sie Kurse und speichern Sie Ihre Favoriten mit dem ❤️ Button",
    },

    // Applications Page
    applications: {
      title: "Meine Bewerbungen",
      subtitle: "Verwalten und verfolgen Sie Ihre Kursbewerbungen",
      newApplication: "+ Neue Bewerbung",
      noApplications: "Noch keine Bewerbungen",
      noApplicationsDesc: "Durchsuchen Sie Kurse und bewerben Sie sich für Ihre Wunschweiterbildung.",
      status: {
        new: "Neu",
        pending: "Ausstehend",
        inReview: "In Prüfung",
        accepted: "Angenommen",
        rejected: "Abgelehnt",
        converted: "Umgewandelt",
        contacted: "Kontaktiert"
      }
    },

    // Chat History Page
    chatHistory: {
      title: "Chat-Verlauf",
      subtitle: "Ihre Konversationen mit dem KI-Kursberater",
      savedConversations: "Gespeicherte Unterhaltungen",
      lastMessage: "Letzte Nachricht:",
      noChats: "Noch keine Konversationen",
      noChatsDesc: "Starten Sie eine neue Suche, um mit dem KI-Kursberater zu chatten.",
    },

    // Notifications Page
    notifications: {
      title: "Benachrichtigungen",
      subtitle: "Bleiben Sie über Ihre Bewerbungen und wichtige Updates informiert.",
      markAllRead: "Alle als gelesen markieren",
      noNotifications: "Keine Benachrichtigungen",
      noNotificationsDesc: "Es liegen derzeit keine Benachrichtigungen vor.",
      noUnreadNotifications: "Keine ungelesenen Benachrichtigungen",
      allReadDesc: "Sie haben alle Benachrichtigungen gelesen.",
      timeAgo: {
        justNow: "Gerade eben",
        minute: "vor 1 Minute",
        minutes: "vor {n} Minuten",
        hour: "vor 1 Stunde",
        hours: "vor {n} Stunden",
        day: "vor 1 Tag",
        days: "vor {n} Tagen"
      }
    },

    // Profile Page
    profile: {
      title: "Profil Einstellungen",
      subtitle: "Verwalten Sie Ihre persönlichen Informationen",
      changePhoto: "Profilbild ändern",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      emailNote: "E-Mail kann nicht geändert werden",
      phone: "Telefonnummer",
      saveChanges: "Änderungen speichern",
      accountActions: "Konto-Aktionen",
      logout: "Abmelden",
      logoutDesc: "Von Ihrem Konto abmelden",
      changePassword: "Passwort ändern",
      changePasswordDesc: "Aktualisieren Sie Ihr Passwort",
      change: "Ändern",
      deleteAccount: "Konto löschen",
      deleteAccountDesc: "Alle Ihre Daten werden dauerhaft gelöscht",
      deleteButton: "Löschen",
      validation: {
        nameRequired: "Vorname und Nachname sind erforderlich",
        updateError: "Fehler beim Aktualisieren",
        logoutError: "Fehler beim Abmelden"
      },
      successMessage: "✅ Profil erfolgreich aktualisiert!"
    }
  },

  en: {
    // Navigation
    nav: {
      aiSearch: "AI Course Search",
      dashboard: "Dashboard",
      savedCourses: "Saved Courses",
      applications: "Applications",
      chatHistory: "Chat History",
      searchCourses: "Search Courses",
      allCourses: "All Courses",
      notifications: "Notifications",
      profile: "Profile",
      language: "Language",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
    },

    // Common/Shared
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      viewAll: "View all →",
      newSearch: "+ New Search",
      discoverCourses: "Discover Courses",
      total: "Total",
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
      all: "All",
      unread: "Unread",
      continue: "Continue →",
      select: "Select",
      messages: "messages",
      created: "Created",
    },

    // AI Search Page (SUCHEN)
    aiSearch: {
      welcome: "Welcome to Kursfind AI",
      subtitle: "Find your perfect training course in minutes with AI assistance",
      poweredBy: "Powered by Powerful AI Engine",
      examplesTitle: "Examples to get started:",
      browseAllCourses: "Browse All Courses",
      inputPlaceholder: "e.g. I'm looking for a web development course in Berlin with Bildungsgutschein...",
      disclaimer: "Kursfind AI can make mistakes. Please verify important information.",
      // Example cards
      examples: {
        ecommerce: {
          title: "E-Commerce Bootcamp",
          description: "I'm looking for an E-Commerce Bootcamp in Berlin or Remote with Bildungsgutschein"
        },
        digitalMarketing: {
          title: "Digital Marketing",
          description: "Show me Digital Marketing Bootcamps Online or Remote with Bildungsgutschein"
        },
        itProgramming: {
          title: "IT & Programming",
          description: "I want to learn programming, what IT courses with Bildungsgutschein are available?"
        },
        webdesign: {
          title: "Webdesign & UX",
          description: "Webdesign and UX/UI Design courses in Berlin or Remote with Bildungsgutschein"
        }
      },
      // Loading states
      loading: {
        analyzing: "Analyzing your request...",
        searching: "Searching AZAV database...",
        personalizing: "Personalizing results...",
        formulating: "Kursfind AI is formulating..."
      },
      // Chat sidebar
      sidebar: {
        newSearch: "New Search",
        allCourses: "All Courses",
        history: "HISTORY",
        noChats: "No chats yet"
      }
    },

    // Student Dashboard
    dashboard: {
      greeting: "Hello",
      subtitle: "Ready for your next training? Discover new courses and track your applications.",
      savedCourses: "Saved Courses",
      applications: "Applications",
      lastStatus: "Last Status",
      noApplications: "No Applications",
      quickActions: "Quick Actions",
      searchCourses: "Search Courses",
      searchCoursesDesc: "Find your training",
      viewSaved: "View Saved",
      viewSavedDesc: "Manage your favorites",
      viewApplications: "View Applications",
      viewApplicationsDesc: "Track status",
      startJourney: "Start Your Training Journey",
      startJourneyDesc: "Browse courses, save your favorites, and apply for training programs.",
    },

    // Saved Courses Page
    savedCourses: {
      title: "Saved Courses",
      subtitle: "Your favorites and interesting training courses",
      discoverNew: "+ Discover New Courses",
      noSavedCourses: "No saved courses yet",
      noSavedCoursesDesc: "Browse courses and save your favorites with the ❤️ button",
    },

    // Applications Page
    applications: {
      title: "My Applications",
      subtitle: "Manage and track your course applications",
      newApplication: "+ New Application",
      noApplications: "No applications yet",
      noApplicationsDesc: "Browse courses and apply for your desired training.",
      status: {
        new: "New",
        pending: "Pending",
        inReview: "In Review",
        accepted: "Accepted",
        rejected: "Rejected",
        converted: "Converted",
        contacted: "Contacted"
      }
    },

    // Chat History Page
    chatHistory: {
      title: "Chat History",
      subtitle: "Your conversations with the AI course advisor",
      savedConversations: "Saved Conversations",
      lastMessage: "Last message:",
      noChats: "No conversations yet",
      noChatsDesc: "Start a new search to chat with the AI course advisor.",
    },

    // Notifications Page
    notifications: {
      title: "Notifications",
      subtitle: "Stay informed about your applications and important updates.",
      markAllRead: "Mark all as read",
      noNotifications: "No notifications",
      noNotificationsDesc: "There are currently no notifications.",
      noUnreadNotifications: "No unread notifications",
      allReadDesc: "You have read all notifications.",
      timeAgo: {
        justNow: "Just now",
        minute: "1 minute ago",
        minutes: "{n} minutes ago",
        hour: "1 hour ago",
        hours: "{n} hours ago",
        day: "1 day ago",
        days: "{n} days ago"
      }
    },

    // Profile Page
    profile: {
      title: "Profile Settings",
      subtitle: "Manage your personal information",
      changePhoto: "Change Profile Photo",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      emailNote: "Email cannot be changed",
      phone: "Phone Number",
      saveChanges: "Save Changes",
      accountActions: "Account Actions",
      logout: "Log Out",
      logoutDesc: "Sign out of your account",
      changePassword: "Change Password",
      changePasswordDesc: "Update your password",
      change: "Change",
      deleteAccount: "Delete Account",
      deleteAccountDesc: "All your data will be permanently deleted",
      deleteButton: "Delete",
      validation: {
        nameRequired: "First name and last name are required",
        updateError: "Error updating profile",
        logoutError: "Error logging out"
      },
      successMessage: "✅ Profile updated successfully!"
    }
  }
};

export function getStudentLabels(lang = 'de') {
  return studentLabels[lang] || studentLabels.de;
}

export default studentLabels;
