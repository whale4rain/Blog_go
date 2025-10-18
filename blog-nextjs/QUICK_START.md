# 🚀 Quick Start Guide

Get the Next.js blog running in 5 minutes!

---

## ⚡ Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version (need 9+)
npm --version

# Ensure Go backend is ready
cd ../server
ls main.go  # Should exist
```

---

## 📦 Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to the Next.js project
cd go_blog/blog-nextjs

# Install all dependencies
npm install

# This will install:
# - Next.js, React, TypeScript
# - Tailwind CSS
# - Axios, Zustand
# - And all other dependencies
```

**Expected Output:**
```
added 300+ packages in 45s
```

---

## ⚙️ Step 2: Configure Environment (30 seconds)

```bash
# Copy environment template
cp .env.local.example .env.local

# The default values should work if your backend is on port 8080
# .env.local contents:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=Inspiration Blog
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**No changes needed if using default ports!**

---

## 🔧 Step 3: Start Backend API (1 minute)

```bash
# Open a new terminal
cd go_blog/server

# Start the Go backend
go run main.go

# Wait for:
# "Server running on :8080"
```

**Keep this terminal running!**

---

## 🎨 Step 4: Start Next.js Dev Server (30 seconds)

```bash
# In your original terminal (blog-nextjs folder)
npm run dev

# Wait for:
# ✓ Ready in 2.5s
# ○ Local: http://localhost:3000
```

---

## 🌐 Step 5: Open Browser (10 seconds)

```bash
# Open your browser and navigate to:
http://localhost:3000

# You should see:
# - Beautiful Google-inspired design
# - "Welcome to Inspiration Blog" hero section
# - Article cards (if backend has data)
# - Categories and tags sidebar
```

---

## ✅ Verification Checklist

Make sure everything works:

- [ ] Home page loads at http://localhost:3000
- [ ] Navigation header is visible
- [ ] Click "About" - page loads
- [ ] Click "Archive" - search page loads
- [ ] Backend API responds (check Network tab)
- [ ] No console errors (press F12)

---

## 🎯 Quick Feature Test

### Test 1: Navigation
```
1. Click "Home" → Should show article list
2. Click "Archive" → Should show search page
3. Click "About" → Should show about page
4. Mobile: Click hamburger menu → Should open
```

### Test 2: Authentication (if backend has users)
```
1. Click "Login" button in header
2. Enter credentials
3. Should redirect to dashboard or home
```

### Test 3: Article Reading
```
1. Find an article card on home page
2. Click on it
3. Should navigate to /article/[id]
4. Article content should display
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /"
**Problem**: Next.js didn't start properly

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Delete .next folder
rm -rf .next

# Start again
npm run dev
```

---

### Issue: "Failed to fetch articles"
**Problem**: Backend not running or wrong URL

**Solution:**
```bash
# Check backend is running
curl http://localhost:8080/api/article/list

# If not, start backend:
cd ../server
go run main.go

# Check .env.local has correct URL
cat .env.local | grep API_BASE_URL
```

---

### Issue: "Module not found"
**Problem**: Dependencies not installed

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Port 3000 already in use"
**Problem**: Another app using port 3000

**Solution:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

### Issue: TypeScript errors
**Problem**: Type checking failed

**Solution:**
```bash
# Run type check to see details
npm run type-check

# Most common fix - restart dev server
# Stop (Ctrl+C) and start again:
npm run dev
```

---

## 📱 Testing on Mobile

### Local Network Testing

```bash
# 1. Find your computer's IP address
# Windows:
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)

# Mac/Linux:
ifconfig
# Look for "inet" address

# 2. Update .env.local
NEXT_PUBLIC_APP_URL=http://192.168.1.100:3000

# 3. Restart dev server
npm run dev

# 4. On mobile browser, navigate to:
http://192.168.1.100:3000
```

---

## 🎨 Customization Quick Tips

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'google-blue': 'hsl(214, 90%, 52%)',  // Change this!
}
```

### Change Logo
Edit `components/layout/Header.tsx`:
```typescript
<div className="w-8 h-8 ...">
  IB  // Change initials here
</div>
```

### Change Site Name
Edit `.env.local`:
```bash
NEXT_PUBLIC_APP_NAME=Your Blog Name
```

---

## 📊 Development Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build optimized production bundle
npm run start        # Start production server

# Code Quality
npm run lint         # Check for code issues
npm run type-check   # Check TypeScript types

# Clean Build
rm -rf .next         # Remove build cache
npm run build        # Fresh build
```

---

## 🔍 Project Structure (Quick Reference)

```
blog-nextjs/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   └── article/[id]/      # Article details
│
├── components/             # React components
│   ├── ui/                # Button, Input, Card...
│   └── layout/            # Header, Footer...
│
├── lib/                    # Core logic
│   ├── api/               # API calls
│   ├── store/             # State management
│   └── utils/             # Helper functions
│
└── types/                  # TypeScript types
```

---

## 📚 Next Steps

After getting started:

1. **Read Full Documentation**
   - [README.md](./README.md) - Complete guide
   - [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Vue to React
   - [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical details

2. **Explore Features**
   - Try creating an article (need admin login)
   - Test search and filtering
   - Check responsive design on mobile

3. **Customize**
   - Change colors in tailwind.config.ts
   - Update content in About page
   - Add your own components

4. **Deploy**
   - Follow deployment guide in README
   - Configure production environment
   - Set up CI/CD pipeline

---

## 💡 Pro Tips

### Faster Development
```bash
# Keep these open in separate terminals:
# Terminal 1: Backend
cd server && go run main.go

# Terminal 2: Frontend
cd blog-nextjs && npm run dev

# Terminal 3: Type checking (optional)
cd blog-nextjs && npm run type-check -- --watch
```

### Hot Reload Issues?
```bash
# If changes don't reflect:
# 1. Save the file again (Ctrl+S)
# 2. Check terminal for errors
# 3. Restart dev server if needed
```

### Clean Slate
```bash
# Nuclear option - fresh start:
rm -rf node_modules .next
npm install
npm run dev
```

---

## 🎓 Learning Path

### Day 1: Setup & Basics
- ✅ Get app running (this guide)
- ✅ Understand project structure
- ✅ Navigate through pages

### Day 2: Components
- Read component code in `components/`
- Understand Button, Input, Card
- Modify a component

### Day 3: Pages
- Explore `app/` directory
- Understand routing
- Create a new page

### Day 4: API & State
- Review `lib/api/` functions
- Understand Zustand stores
- Make an API call

### Week 2: Advanced
- Add new features
- Optimize performance
- Deploy to production

---

## 🆘 Getting Help

1. **Check Console**: Press F12, look for errors
2. **Check Network**: See if API calls succeed
3. **Read Docs**: README has detailed info
4. **Check Backend**: Make sure Go server is running
5. **Search Issues**: Common problems likely solved

---

## ✅ Success!

If you can see the home page with the Google-inspired design, you're all set! 🎉

**Your Next.js blog is running successfully!**

Now you can:
- Browse articles
- Search and filter
- Login (if you have credentials)
- Explore the code
- Start customizing

---

**Happy Coding! 🚀**

---

**Time to complete**: ~5 minutes  
**Difficulty**: Easy  
**Prerequisites**: Node.js 18+, Go backend  
**Support**: Check README.md for detailed help