# Dashboard Testing Guide

## Overview

This guide provides comprehensive instructions for testing the blog dashboard functionality using mock users and automated testing scripts.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Next.js development server** running on `http://localhost:3000`
3. **Mock API enabled** (default configuration)

### Start the Server

```bash
npm run dev
```

The server should start on `http://localhost:3000`

## 📋 Mock User Credentials

The dashboard includes three pre-configured mock users for testing:

### Admin User
- **Email**: `admin@blog.com`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full dashboard access, user management, all CRUD operations

### Regular User
- **Email**: `john@example.com`
- **Password**: `password123`
- **Role**: User
- **Access**: Limited access, can create/edit own articles, personal settings

### Editor User
- **Email**: `editor@blog.com`
- **Password**: `editor123`
- **Role**: Editor
- **Access**: Content management, article operations, limited admin functions

## 🧪 Automated Testing

### Run Basic Tests

```bash
node test-mock.js
```

This will test:
- User authentication for all roles
- API connectivity
- Basic dashboard access
- Article listing

### Run Comprehensive Dashboard Tests

```bash
node test-dashboard.js
```

This comprehensive test suite includes:
- Login functionality for all user types
- Dashboard route accessibility
- Article CRUD operations
- Image management
- Comment moderation
- User settings
- Permission validation

## 📊 Dashboard Features

### 1. Dashboard Home (`/dashboard`)
- **Stats Overview**: Total articles, views, likes, comments
- **Quick Actions**: Create article, upload images, settings
- **Recent Activity**: Latest articles and comments
- **System Info**: User count, database status (admin only)

### 2. Articles Management (`/dashboard/articles`)
- **Article List**: View all articles with pagination
- **Search & Filter**: By title, category, status
- **Bulk Actions**: Delete multiple articles
- **Status Management**: Draft, published, archived
- **Quick Actions**: Edit, delete, preview

### 3. Create Article (`/dashboard/articles/create`)
- **Rich Text Editor**: Markdown support with preview
- **Metadata**: Title, abstract, category, tags
- **Cover Image**: Upload or select from gallery
- **Publishing Options**: Save as draft or publish immediately
- **Tag Management**: Add existing or create new tags

### 4. Edit Article (`/dashboard/articles/[id]/edit`)
- **Pre-filled Form**: All article data loaded
- **Real-time Preview**: Toggle between edit and preview modes
- **Version Control**: Update without losing original data
- **Status Changes**: Draft to published workflow

### 5. Images Management (`/dashboard/images`)
- **Gallery View**: Grid and list layouts
- **Upload Interface**: Drag & drop or click to upload
- **Folder Organization**: Categorize images
- **Bulk Operations**: Select and delete multiple images
- **Metadata Display**: File size, dimensions, upload date

### 6. Comments Management (`/dashboard/comments`)
- **Moderation Queue**: Pending, approved, spam comments
- **Bulk Actions**: Approve, mark as spam, delete
- **Reply Functionality**: Respond to comments inline
- **Filter Options**: By status, article, user
- **Statistics**: Comment counts by status

### 7. Settings (`/dashboard/settings`)
- **Profile Management**: Username, avatar, bio, location
- **Security**: Password change, two-factor auth
- **Notifications**: Email preferences, alerts
- **Appearance**: Theme, language, timezone
- **Privacy**: Account visibility, data settings

## 🔧 Testing Scenarios

### Scenario 1: Admin Workflow
1. Login as `admin@blog.com` / `admin123`
2. Navigate to dashboard home
3. Verify all stats and quick actions work
4. Create a new article
5. Upload images
6. Moderate comments
7. Manage user settings
8. Access all system features

### Scenario 2: Content Creator Workflow
1. Login as `editor@blog.com` / `editor123`
2. Create and publish articles
3. Manage media library
4. Respond to comments
5. Update profile settings

### Scenario 3: Regular User Workflow
1. Login as `john@example.com` / `password123`
2. Access limited dashboard features
3. Create personal articles
4. Update profile
5. View personal content

## 🛠️ API Testing

### Authentication Endpoints
```javascript
// Login
POST /api/test/login
{
  "email": "admin@blog.com",
  "password": "admin123"
}

// Response
{
  "code": 0,
  "data": {
    "user": { ... },
    "access_token": "mock-token-...",
    "access_token_expires_at": "2024-03-16T..."
  }
}
```

### Article Endpoints
```javascript
// List articles
GET /api/test/articles
Headers: Authorization: Bearer <token>

// Create article
POST /api/test/articles/create
{
  "title": "Test Article",
  "content": "Article content...",
  "category": "technology",
  "tags": ["test", "api"]
}
```

### Image Endpoints
```javascript
// List images
GET /api/test/images

// Upload image (mock)
POST /api/test/images/upload
{
  "name": "test.jpg",
  "size": 1024000,
  "type": "image/jpeg"
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Server Not Running
```
❌ Cannot connect to server
```
**Solution**: Start the Next.js development server
```bash
npm run dev
```

#### 2. Login Failed
```
❌ Login failed: Invalid email or password
```
**Solution**: Check credentials in the Mock User Credentials section above

#### 3. Route Not Accessible
```
❌ Dashboard access failed: 404
```
**Solution**: Ensure you're logged in and have the correct permissions

#### 4. API Errors
```
❌ Request failed: fetch failed
```
**Solution**: Check that mock API is enabled in the configuration

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=true npm run dev
```

## 📝 Test Results Interpretation

### Success Indicators
- ✅ All login tests pass
- ✅ Dashboard routes accessible
- ✅ CRUD operations work
- ✅ File uploads successful
- ✅ Settings updates persist

### Failure Indicators
- ❌ Authentication failures
- ❌ Permission errors
- ❌ API timeouts
- ❌ Broken UI components

### Performance Metrics
- Page load time: < 2 seconds
- API response time: < 500ms
- File upload: < 5 seconds for images < 5MB

## 🔄 Continuous Testing

### Automated CI/CD Tests
Add to your CI pipeline:
```yaml
- name: Run Dashboard Tests
  run: |
    npm run dev &
    sleep 10
    node test-dashboard.js
```

### Manual Testing Checklist
- [ ] All user types can login
- [ ] Dashboard loads without errors
- [ ] Articles can be created, edited, deleted
- [ ] Images upload and display correctly
- [ ] Comments can be moderated
- [ ] Settings save properly
- [ ] Responsive design works on mobile
- [ ] Error messages display correctly

## 📚 Development Notes

### Mock Data Structure
- **Articles**: 10 mock articles with varied content
- **Users**: 3 predefined user roles
- **Comments**: Sample comments with different statuses
- **Images**: Mock file system for testing uploads

### State Management
- Uses Zustand for client-side state
- Persistent user session with localStorage
- Automatic token refresh

### Permissions System
- **Role-based access control (RBAC)**
- **Route-level protection**
- **API endpoint validation**
- **Component-level permissions**

## 🎯 Next Steps

1. **Production Testing**: Replace mock API with real backend
2. **Performance Testing**: Load testing with multiple users
3. **Security Testing**: Penetration testing and vulnerability assessment
4. **Accessibility Testing**: WCAG compliance verification
5. **Cross-browser Testing**: Test on different browsers and devices

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review test logs for error details
3. Verify mock API configuration
4. Ensure proper server setup

---

**Happy Testing! 🎉**

This dashboard is fully functional with mock data and ready for production backend integration.