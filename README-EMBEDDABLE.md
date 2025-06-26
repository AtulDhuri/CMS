# Survey Popup - Embeddable Widget

This Angular application creates an embeddable survey popup that can be added to any website using a simple script tag.

## Features

- ✅ Name and Email form fields with validation
- ✅ Responsive design
- ✅ Configurable positioning (bottom-left, bottom-right, top-left, top-right)
- ✅ Auto-show with configurable delay
- ✅ Customizable title and styling
- ✅ Form submission handling
- ✅ Web component architecture for easy embedding

## Building the Widget

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

```bash
ng build --configuration=production
```

This will create a `dist/survey-popup` folder with the following files:
- `main.js` - The Angular bundle (web component)
- `styles.css` - Compiled styles
- Other assets

### 3. Host the Files

Upload the contents of `dist/survey-popup` to your web server, CDN, or hosting service.

**Example hosting locations:**
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- Your own web server
- GitHub Pages
- Netlify
- Vercel

## Embedding on Any Website

### Basic Usage

Add this script tag to any website's HTML (in the `<head>` or before `</body>`):

```html
<script src="https://your-domain.com/survey-popup-loader.js"></script>
```

### Advanced Configuration

You can configure the popup using data attributes:

```html
<script 
  src="https://your-domain.com/survey-popup-loader.js"
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
| `data-config` | JSON | {} | Full configuration object |

### JSON Configuration Example

```html
<script 
  src="https://your-domain.com/survey-popup-loader.js"
  data-config='{"title":"Feedback Form","position":"bottom-right","delay":3000,"submitUrl":"https://api.example.com/submit"}'>
</script>
```

## JavaScript API

The widget exposes a global API for programmatic control:

```javascript
// Show the popup
window.surveyPopup.show();

// Hide the popup
window.surveyPopup.hide();

// Destroy the popup completely
window.surveyPopup.destroy();

// Access configuration
console.log(window.surveyPopupConfig);

// Access the widget element
console.log(window.surveyPopupWidget);
```

## Customization

### Styling

The popup uses SCSS with CSS custom properties. You can override styles by adding CSS to the host page:

```css
/* Override popup colors */
survey-popup-widget {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

/* Custom positioning */
#survey-popup-container {
  bottom: 50px !important;
  left: 50px !important;
}
```

### Form Submission

By default, the form shows an alert on submission. To handle form data:

1. Set `data-submit-url` to your API endpoint
2. Or use the `onSubmit` callback in the configuration

```javascript
// Custom submit handler
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

## Browser Compatibility

- ✅ Chrome 67+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

## Security Considerations

- The widget runs in an isolated context
- No access to host page's JavaScript variables
- Form data is only sent to specified endpoints
- CORS policies apply to form submissions

## Troubleshooting

### Popup Not Appearing

1. Check browser console for errors
2. Verify the loader script URL is correct
3. Ensure the Angular bundle (`main.js`) is accessible
4. Check if the page has `z-index` conflicts

### Styling Issues

1. Check for CSS conflicts with host page
2. Verify the popup container has proper positioning
3. Ensure no CSS resets are affecting the widget

### Form Submission Issues

1. Check CORS settings on your API endpoint
2. Verify the submit URL is correct
3. Check browser console for network errors

## Development

### Local Development

```bash
# Start development server
ng serve

# Build for development
ng build --configuration=development

# Run tests
ng test
```

### File Structure

```
surveyPopup/
├── src/
│   ├── app/
│   │   ├── popup/
│   │   │   ├── popup.component.ts
│   │   │   ├── popup.component.html
│   │   │   └── popup.component.scss
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.config.ts
│   ├── main.ts
│   └── styles.scss
├── survey-popup-loader.js
├── angular.json
└── package.json
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the troubleshooting section above or create an issue in the project repository. 