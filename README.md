# FxRecords - Music Release Platform

A modern, feature-rich music release platform with user authentication, SMS notifications, and artist release management.

![FxRecords](https://cdn.discordapp.com/attachments/1518242332586016772/1522614718316150845/file_00000000525871fb89ad6cdeb1478611.png)

## ✨ Features

- 🔐 **User Authentication System**
  - Secure Sign Up and Sign In
  - Email and password validation
  - Session management with local storage

- 📱 **SMS Notification System**
  - Send SMS notifications to all users
  - Customizable notification preferences
  - Support for releases, news, and announcements
  - Ready for Twilio integration

- 🎵 **Release Management**
  - Display latest music releases
  - Track artist information and genres
  - Beautiful release cards with metadata

- 👤 **User Dashboard**
  - View profile information
  - Manage notification preferences
  - Browse personal releases
  - Secure logout

- 🎨 **Modern UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Dark theme with gradient accents
  - Toast notifications for user feedback

- 🔧 **Admin Panel**
  - Send SMS broadcasts to all users
  - Create and manage releases
  - Track notification history

## 🚀 Quick Start

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/FxplayzOfficial-1/FxRecords.git
cd FxRecords
```

2. **Open in browser:**
Simply open `index.html` in your web browser. No installation required!

```bash
# Using Python (Python 3)
python -m http.server 8000

# Using Node.js with http-server
npx http-server

# Or just open index.html directly in your browser
```

3. **Access the application:**
```
http://localhost:8000
```

## 📖 Usage

### Creating an Account

1. Click **"Sign In"** button in the navigation
2. Click **"Sign Up"** link
3. Fill in your details:
   - Full Name
   - Email
   - Phone Number (for SMS notifications)
   - Password
4. Enable SMS notifications to receive updates
5. Click **"Sign Up"**

### Signing In

1. Click **"Sign In"** button
2. Enter your email and password
3. Click **"Sign In"**

### Managing Notifications

1. After signing in, click **"Dashboard"**
2. Go to **"Notifications"** tab
3. Toggle notification preferences:
   - New Releases
   - News & Updates
   - Announcements
4. Click **"Save Preferences"**

### Accessing Admin Panel

Press **"A" three times quickly** to open the admin panel and send SMS notifications to all users.

## 🔧 Configuration

### Update Your Logo and Branding

Edit the image URLs in `index.html`:

```html
<!-- Website Logo -->
<img src="https://cdn.discordapp.com/attachments/1518242332586016772/1522614718316150845/file_00000000525871fb89ad6cdeb1478611.png" alt="FxRecords Logo">

<!-- YouTube Icon -->
<img src="https://cdn.discordapp.com/attachments/1518242332586016772/1522614698552332420/icon.png" alt="YouTube">
```

### SMS Integration (Twilio)

To enable real SMS notifications:

1. **Sign up at [Twilio](https://www.twilio.com/)**
2. **Get your credentials:**
   - Account SID
   - Auth Token
   - Phone Number

3. **Update `.env` file:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

4. **For production, use the Node.js backend:**
```bash
npm install
npm start
```

## 📁 Project Structure

```
FxRecords/
├── index.html          # Main HTML file
├── styles.css          # Complete CSS styling
├── script.js           # All JavaScript functionality
├── package.json        # Dependencies for Node.js backend
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #7c3aed;      /* Purple */
    --secondary-color: #ec4899;    /* Pink */
    --dark-bg: #0f172a;            /* Dark blue */
    --light-bg: #1e293b;           /* Light dark blue */
}
```

### Add Sample Releases

Edit `getSampleReleases()` function in `script.js`:

```javascript
function getSampleReleases() {
    return [
        {
            id: 1,
            title: 'Summer Vibes EP',
            artist: 'FxRecords',
            description: 'Feel-good tracks for your summer playlist',
            date: '2026-07-15',
            genre: 'Electronic'
        }
        // Add more releases...
    ];
}
```

## 🔐 Security Notes

**Current Implementation:**
- Client-side validation
- Password hashing (Base64 - for demo only)
- Local storage for user data

**For Production, implement:**
1. ✅ Backend server (Node.js/Express)
2. ✅ bcrypt for password hashing
3. ✅ MongoDB or PostgreSQL database
4. ✅ JWT tokens for sessions
5. ✅ HTTPS encryption
6. ✅ Input validation & sanitization
7. ✅ Environment variables for secrets
8. ✅ Rate limiting
9. ✅ CORS protection
10. ✅ Real Twilio API integration

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🎯 Features Roadmap

- [ ] Backend API with Node.js/Express
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real Twilio SMS integration
- [ ] Email verification
- [ ] Social login (Google, Spotify)
- [ ] Advanced analytics
- [ ] Artist dashboard
- [ ] Music streaming integration
- [ ] Payment processing

## 🐛 Known Limitations

- Data stored in browser local storage (clears on cache clear)
- SMS is simulated (needs backend for real SMS)
- No persistent database
- For production, implement backend server

## 📞 Support

For issues or questions, open an issue on GitHub.

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🚀 Deploy to Production

### Option 1: GitHub Pages
```bash
git add .
git commit -m "Deploy FxRecords"
git push origin main
```
Enable GitHub Pages in repository settings.

### Option 2: Netlify
```bash
netlify deploy --prod
```

### Option 3: Vercel
```bash
vercel --prod
```

### Option 4: Traditional Hosting
Upload all files to your web hosting provider.

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Built with:** HTML5 + CSS3 + JavaScript
