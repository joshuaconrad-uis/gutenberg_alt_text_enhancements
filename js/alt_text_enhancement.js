(function(wp) {
  'use strict';
  
  console.log('Gutenberg Alt Text: Script loaded, wp object:', !!wp);
  
  // Version detection and compatibility checking
  const GutenbergAltText = {
    version: '1.0.0',
    minGutenbergVersion: '8.0.0',
    
    // Check if required Gutenberg components are available
    checkCompatibility() {
      const required = [
        'hooks',
        'element', 
        'blockEditor',
        'components'
      ];
      
      for (const component of required) {
        if (!wp[component]) {
          console.warn(`Gutenberg Alt Text: Missing required component: ${component}`);
          return false;
        }
      }
      
      return true;
    },
    
    // Safely get component with fallback
    safeGetComponent(wpComponent, fallback = null) {
      try {
        return wpComponent;
      } catch (e) {
        console.warn('Gutenberg Alt Text: Component access failed:', e);
        return fallback;
      }
    },
    
    // Initialize enhancements only if compatible
    init() {
      console.log('Gutenberg Alt Text: Starting initialization...');
      console.log('Gutenberg Alt Text: wp object available:', !!wp);
      console.log('Gutenberg Alt Text: wp.hooks available:', !!wp?.hooks);
      console.log('Gutenberg Alt Text: wp.element available:', !!wp?.element);
      console.log('Gutenberg Alt Text: wp.blockEditor available:', !!wp?.blockEditor);
      console.log('Gutenberg Alt Text: wp.components available:', !!wp?.components);
      
      if (!this.checkCompatibility()) {
        console.warn('Gutenberg Alt Text: Compatibility check failed. Skipping enhancements.');
        return;
      }
      
      console.log('Gutenberg Alt Text: Compatibility check passed, initializing enhancements...');
      this.enhanceCoverBlock();
      this.enhanceGalleryBlock();
      console.log('Gutenberg Alt Text: Enhancements initialized successfully');
    },
    
    enhanceCoverBlock() {
      const { addFilter } = wp.hooks;
      const Fragment = this.safeGetComponent(wp.element.Fragment);
      const InspectorControls = this.safeGetComponent(wp.blockEditor.InspectorControls);
      const PanelBody = this.safeGetComponent(wp.components.PanelBody);
      const TextControl = this.safeGetComponent(wp.components.TextControl);
      
      if (!addFilter || !Fragment || !InspectorControls || !PanelBody || !TextControl) {
        console.warn('Gutenberg Alt Text: Missing components for Cover Block enhancement');
        return;
      }
      
      addFilter(
        'editor.BlockEdit',
        'gutenberg-alt-text/cover-block',
        (BlockEdit) => (props) => {
          // Debug: Log all block names being processed
          if (props && props.name) {
            console.log('Gutenberg Alt Text: Processing block:', props.name);
          }
          
          // Double-check the block name in case the structure changed
          if (!props || props.name !== 'core/cover') {
            return wp.element.createElement(BlockEdit, props);
          }
          
          console.log('Gutenberg Alt Text: Found core/cover block, adding enhancements');
          
          // Check if attributes structure is as expected
          if (!props.attributes || typeof props.setAttributes !== 'function') {
            console.warn('Gutenberg Alt Text: Unexpected Cover Block structure');
            return wp.element.createElement(BlockEdit, props);
          }
          
          return wp.element.createElement(Fragment, null,
            wp.element.createElement(BlockEdit, props),
            wp.element.createElement(InspectorControls, null,
              wp.element.createElement(PanelBody, {
                title: 'Accessibility Settings',
                initialOpen: false
              },
                wp.element.createElement(TextControl, {
                  label: 'Image Alt Text',
                  value: props.attributes.alt || '',
                  onChange: (value) => {
                    try {
                      props.setAttributes({ alt: value });
                    } catch (e) {
                      console.error('Gutenberg Alt Text: Error setting alt attribute:', e);
                    }
                  },
                  help: 'Provide alternative text for screen readers'
                })
              )
            )
          );
        }
      );
    },
    
    enhanceGalleryBlock() {
      // Similar implementation with safety checks
      const { addFilter } = wp.hooks;
      const Fragment = this.safeGetComponent(wp.element.Fragment);
      const InspectorControls = this.safeGetComponent(wp.blockEditor.InspectorControls);
      const PanelBody = this.safeGetComponent(wp.components.PanelBody);
      
      if (!addFilter || !Fragment || !InspectorControls || !PanelBody) {
        return;
      }
      
      addFilter(
        'editor.BlockEdit',
        'gutenberg-alt-text/gallery-block',
        (BlockEdit) => (props) => {
          // Debug: Log all block names being processed
          if (props && props.name) {
            console.log('Gutenberg Alt Text: Processing block:', props.name);
          }
          
          if (!props || props.name !== 'core/gallery') {
            return wp.element.createElement(BlockEdit, props);
          }
          
          console.log('Gutenberg Alt Text: Found core/gallery block, adding enhancements');
          
          return wp.element.createElement(Fragment, null,
            wp.element.createElement(BlockEdit, props),
            wp.element.createElement(InspectorControls, null,
              wp.element.createElement(PanelBody, {
                title: 'Gallery Accessibility',
                initialOpen: false
              },
                wp.element.createElement('p', null, 
                  'Select individual images in the gallery to add alt text to each one.'
                )
              )
            )
          );
        }
      );
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GutenbergAltText.init());
  } else {
    GutenbergAltText.init();
  }
  
})(wp);
