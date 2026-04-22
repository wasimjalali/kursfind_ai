# Kursfind AI

An AI-powered course discovery platform that connects students with education providers in Germany. Featuring intelligent course recommendations, multi-language support, and streamlined application workflows.

## 🌟 Features

### For Students
- **AI-Powered Course Search**: Get personalized course recommendations using AI (GPT-4o-mini with DeepSeek fallback)
- **Advanced Filtering**: Filter courses by location, provider, language, category, format, duration, and funding options
- **Application Management**: Apply to courses and track application status in real-time
- **Save Favorites**: Bookmark courses for later review
- **Multi-Language Support**: Full German and English language support

### For Providers
- **Provider Dashboard**: Manage course listings and applications
- **Application Management**: Review and respond to student applications
- **Profile Management**: Create and update provider profiles with certifications and contact information
- **Email Notifications**: Automated notifications for new applications and reminders

### Technical Features
- **Real-time Updates**: Supabase Realtime for live data synchronization
- **Email Automation**: SendPulse SMTP integration for transactional emails
- **Authentication**: Secure authentication via Supabase Auth
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL database, Auth, Realtime)
- **AI**: [OpenAI GPT-4o-mini](https://openai.com/) with [DeepSeek](https://www.deepseek.com/) fallback
- **Email**: [Nodemailer](https://nodemailer.com/) with SendPulse SMTP
- **Calendar**: [Cal.com](https://cal.com/) integration
- **Language**: TypeScript

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- A Supabase project (free tier works)
- OpenAI API key (optional, for AI features)
- DeepSeek API key (optional, as fallback)
- SendPulse SMTP credentials (optional, for email features)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/wasimjalali2004-art/kursfind_ai.git
cd kursfind_ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API Keys (Optional)
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Email Configuration (Optional - SendPulse SMTP)
SMTP_HOST=smtp-pulse.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM_EMAIL=info@yourdomain.com
SMTP_FROM_NAME=Kursfind
```

### 4. Set Up Supabase Database

Run the SQL migrations in your Supabase SQL Editor to create the required tables:

```sql
-- Create tables for courses, providers, applications, etc.
-- (See /supabase/migrations directory if available)
```

Required tables:
- `courses` - Course listings
- `providers` - Education provider profiles
- `applications` - Student applications
- `profiles` - User profiles

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kursfind_ai/
├── app/                    # Next.js App Router pages
│   ├── agent/             # AI chat interface
│   ├── courses/           # Course listing and details
│   ├── student/           # Student dashboard and auth
│   ├── provider/          # Provider dashboard and auth
│   ├── en/                # English language pages
│   └── de/                # German language pages
├── components/            # Reusable React components
├── lib/                  # Utility functions and configurations
│   ├── ai-client.js      # AI integration with fallback
│   ├── email.js          # Email service
│   └── supabase.js       # Supabase client configuration
├── public/               # Static assets
└── middleware.js         # Next.js middleware for auth
```

## 🔐 Security Considerations

- All sensitive data is stored in environment variables
- `.env.local` is included in `.gitignore` and never committed
- Supabase Row Level Security (RLS) policies should be configured
- API keys are never exposed to the client-side
- Service role keys are only used on the server-side

## 🌍 Multi-Language Support

The application supports German (default) and English. Language switching is handled through the `/de` and `/en` routes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- AI features powered by [OpenAI](https://openai.com/) and [DeepSeek](https://www.deepseek.com/)
- Email service via [SendPulse](https://sendpulse.com/)
- Calendar integration by [Cal.com](https://cal.com/)

## 📞 Support

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Note**: This is an open source project. You are free to use, modify, and distribute it as per the MIT License.
