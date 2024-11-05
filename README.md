# Cifra
Cifra is a lightweight JavaScript library inspired by jQuery, crafted specifically to simplify DOM manipulation and event handling for web applications, especially in the context of bookmarklets and favlets with a focus on minimalism.

### Key Features

* __DOM Manipulation__: Easily add, remove, and manipulate classes, attributes, and content within your elements
* __Event Handling__: Simplify the process of attaching event listeners to multiple elements with support for event delegation.
* __Element Traversal__: Quickly find sibling, parent, and descendant elements using intuitive methods.
* __Styling Control__: Easily manipulate CSS properties, add styles dynamically, and manage visibility of elements.
* __Notifications__: Create customizable notifications with automatic dismissal and styling options.
* __Utility Functions__: Includes functions for copying text, managing local storage, and downloading files.

### Basic Usage
``` javascript
// Select elements
const elements = $('.my-class');

// Add a class
elements.addClass('active');

// Set inner HTML
elements.html('<p>Hello, World!</p>');

// Trigger a click event
elements.trigger('click');

// Create a new element
const newElement = $.create('div', {
    attributes: { id: 'myDiv' },
    innerHTML: 'This is a new div.'
});
$('body').append(newElement);
```
