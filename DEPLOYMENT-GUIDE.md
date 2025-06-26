# Survey Popup - Deployment Guide

## 🚀 Quick Start

Your survey popup is now ready to be embedded on any website! Here's how to deploy and use it.

## 📁 Files to Deploy

After building, you have these files in `dist/survey-popup/browser/`:

- `main.js` - The Angular web component bundle
- `survey-popup-loader.js` - The loader script for embedding
- `test.html` - Demo page to test the popup
- `styles.css` - Compiled styles (if any)
- `polyfills.js` - Browser polyfills

## 🌐 Hosting Options

### Option 1: GitHub Pages (Free)

1. Create a new GitHub repository
2. Upload the contents of `dist/survey-popup/browser/` to the repository
3. Go to Settings → Pages → Source → Deploy from a branch
4. Select `main` branch and save
5. Your popup will be available at: `https://yourusername.github.io/repository-name/`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist/survey-popup/browser/` folder
3. Get your URL: `https://random-name.netlify.app`
4. You can customize the URL in settings

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import your project or upload the `dist/survey-popup/browser/` folder
3. Deploy and get your URL

### Option 4: Your Own Server

1. Upload the contents of `dist/survey-popup/browser/` to your web server
2. Ensure the files are accessible via HTTP/HTTPS
3. Your popup will be available at: `https://yourdomain.com/path/to/files/`

## 🔧 Embedding on Any Website

### Basic Embedding

Add this single line to any website's HTML (in `<head>` or before `</body>`):

```html
<script src="https://your-hosting-url.com/survey-popup-loader.js"></script>
```

### Advanced Configuration

```html
<script 
  src="https://your-hosting-url.com/survey-popup-loader.js"
  data-title="Customer Feedback"
  data-position="bottom-right"
  data-delay="5000"
  data-auto-show="true"
  data-submit-url="https://your-api.com/submit-survey">
</script>
```

### Configuration Options

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-title` | string | "Quick Survey" | Popup title |
| `data-position` | string | "bottom-left" | Position: bottom-left, bottom-right, top-left, top-right |
| `data-delay` | number | 2000 | Delay before showing popup (milliseconds) |
| `data-auto-show` | boolean | true | Whether to show popup automatically |
| `data-submit-url` | string | null | URL to submit form data |

## 🧪 Testing

1. Open `test.html` in your browser to see the popup in action
2. The popup should appear automatically after 2 seconds
3. Use the demo buttons to test the JavaScript API

## 📝 JavaScript API

Once embedded, you can control the popup programmatically:

```javascript
// Show the popup
window.surveyPopup.show();

// Hide the popup
window.surveyPopup.hide();

// Destroy the popup completely
window.surveyPopup.destroy();

// Access configuration
console.log(window.surveyPopupConfig);
```

## 🔒 Security Considerations

- The popup runs in an isolated context
- No access to host page's JavaScript variables
- Form data is only sent to specified endpoints
- CORS policies apply to form submissions

## 🎨 Customization

### Styling

You can override popup styles by adding CSS to the host page:

```css
/* Custom positioning */
#survey-popup-container {
  bottom: 50px !important;
  left: 50px !important;
}

/* Custom colors */
survey-popup-widget {
  --primary-color: #007bff;
}
```

### Form Submission

To handle form data, set `data-submit-url` or use the JavaScript API:

```javascript
window.surveyPopupConfig.options.onSubmit = function(formData) {
  console.log('Form submitted:', formData);
  // Send to your API
  fetch('/api/submit-survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
};
```

## 🐛 Troubleshooting

### Popup Not Appearing

1. Check browser console for errors
2. Verify the loader script URL is correct
3. Ensure `main.js` is accessible from the same directory
4. Check for JavaScript errors on the host page

### Styling Issues

1. Check for CSS conflicts with host page
2. Verify the popup container has proper positioning
3. Ensure no CSS resets are affecting the widget

### Form Submission Issues

1. Check CORS settings on your API endpoint
2. Verify the submit URL is correct
3. Check browser console for network errors

## 📊 Analytics Integration

You can track popup interactions by adding analytics:

```javascript
// Track popup views
window.surveyPopupConfig.options.onShow = function() {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'survey_popup_view');
  }
  
  // Mixpanel
  if (typeof mixpanel !== 'undefined') {
    mixpanel.track('Survey Popup Viewed');
  }
};

// Track form submissions
window.surveyPopupConfig.options.onSubmit = function(formData) {
  // Track submission
  if (typeof gtag !== 'undefined') {
    gtag('event', 'survey_submission', {
      event_category: 'engagement',
      event_label: formData.email
    });
  }
};
```

## 🔄 Updates

To update the popup:

1. Make changes to your Angular code
2. Run `ng build --configuration=production`
3. Upload the new `main.js` file to your hosting
4. The popup will automatically use the updated version

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all files are accessible via HTTP/HTTPS
3. Test with the provided `test.html` file
4. Check the troubleshooting section above

## 🎉 Success!

Your embeddable survey popup is now ready to collect feedback from your website visitors! 