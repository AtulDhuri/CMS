# Survey Popup - Quick Deploy Guide

## 🚀 Deploy to Netlify (Recommended - Free)

### Step 1: Go to Netlify
1. Open your browser and go to [netlify.com](https://netlify.com)
2. Click "Sign up" (you can use GitHub, Google, or email)
3. After signing up, click "Add new site" → "Deploy manually"

### Step 2: Upload Files
1. Simply drag and drop the entire `deploy-package` folder to the upload area
2. Wait for the upload to complete
3. Netlify will automatically deploy your site

### Step 3: Get Your URL
1. Netlify will give you a random URL like: `https://amazing-name-123456.netlify.app`
2. You can customize this URL in the site settings
3. Your popup will be available at: `https://your-site-name.netlify.app/survey-popup-loader.js`

## 🔧 How to Use Your Popup

### Basic Usage
Add this to any website:
```html
<script src="https://your-site-name.netlify.app/survey-popup-loader.js"></script>
```

### With Customization
```html
<script 
  src="https://your-site-name.netlify.app/survey-popup-loader.js"
  data-title="Customer Feedback"
  data-position="bottom-right"
  data-delay="5000">
</script>
```

## 🧪 Test Your Popup
1. Open `https://your-site-name.netlify.app/test.html` in your browser
2. The popup should appear automatically after 2 seconds
3. Test the form submission

## 📁 Files Included
- `main.js` - Angular web component bundle
- `survey-popup-loader.js` - Embeddable loader script
- `test.html` - Demo page
- `styles.css` - Styles
- `polyfills.js` - Browser compatibility

## 🎯 Alternative Hosting Options

### GitHub Pages (if you have Git)
1. Create a GitHub repository
2. Upload these files to the repository
3. Go to Settings → Pages → Deploy from branch

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up and create a new project
3. Upload the `deploy-package` folder

### Your Own Server
1. Upload all files to your web server
2. Ensure they're accessible via HTTP/HTTPS
3. Use the full URL to the `survey-popup-loader.js` file

## 🎉 Success!
Once deployed, you can embed your survey popup on any website with just one line of code! 