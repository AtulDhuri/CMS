import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';
import 'zone.js';

// Convert the Angular component to a custom element
const createSurveyPopupElement = async () => {
  try {
    console.log('Starting Angular Elements initialization...');
    
    const appRef = await bootstrapApplication(AppComponent, appConfig);
    console.log('Angular application bootstrapped successfully');
    
    const injector = appRef.injector;
    console.log('Injector obtained from app reference');
    
    const SurveyPopupElement = createCustomElement(AppComponent, { injector });
    console.log('Custom element created successfully');
    
    // Define the custom element
    if (!customElements.get('survey-popup-widget')) {
      customElements.define('survey-popup-widget', SurveyPopupElement);
      console.log('Survey popup widget registered successfully');
    } else {
      console.log('Survey popup widget already registered');
    }
    
    return appRef;
  } catch (error: any) {
    console.error('Error during Angular Elements initialization:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    throw error;
  }
};

// Initialize the custom element when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createSurveyPopupElement()
      .catch((err) => console.error('Failed to create survey popup element:', err));
  });
} else {
  createSurveyPopupElement()
    .catch((err) => console.error('Failed to create survey popup element:', err));
}
