# Solution Docs

<!-- Include documentation, additional setup instructions, notes etc. here -->

The Autocomplete component is a reusable query function that accepts an endpoint as a param. This param can be a static date file or dynamic api.

Features:

A react-esque 'state object' creates a single source of truth in regards to the current state of the component.
A react-esque 'ref object' contains dom element references for the component.
Keyboard shortcuts allow the user to easily navigate returned values.
The input is updated to reflect the selection.

Changes:

In a real world scenario, I would not use do dom manipulation via vanilla javascript, as this would quickly become convoluted, unreliable and pose a hindrance to scalibility. I would write this a functional component in a framework such as react.
