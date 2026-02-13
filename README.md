Interactive Question Management Sheet
=====================================

###  Overview

This is a single-page web application designed for students to organize and track their progress through large coding datasets like the Striver A2Z DSA Sheet. It allows users to manage a hierarchical structure of topics, sub-topics, and questions with real-time progress tracking.

###  Problem Statement

Managing hundreds of coding problems across different platforms is disorganized and overwhelming. Manual tracking often lacks a clear visual hierarchy and the ability to reorder topics based on personal priority or interview timelines.

### Features

*   **Hierarchical Management**: Full CRUD (Create, Read, Update, Delete) support for Topics, Sub-topics, and Questions.
    
*   **Dataset Integration**: Initialized with the full Striver A2Z DSA dataset, including links and company tags.
    
*   **Interactive Reordering**: Drag-and-drop interface to change the priority of main topics.
    
*   **Global Search**: Quick filter functionality to find specific questions across all categories.
    
*   **Smart Progress Tracking**: Real-time completion dashboard with "ripple" logic (completing all questions auto-completes the parent topic).
    
*   **Local Persistence**: Progress and custom changes are saved to the browser's local storage.
    

###  Tech Stack

*   **Frontend**: React.js, Vite
    
*   **Styling**: Tailwind CSS
    
*   **State Management**: Zustand
    
*   **Icons**: Lucide React
    
*   **Drag & Drop**: @dnd-kit/core
    

###  Project Structure
codolio-tracker/

├── src/

│   ├── store/

│   │   └── useSheetStore.js   # Zustand state & CRUD logic

│   ├── App.jsx                # Main UI components

│   ├── sheet.json             # Source dataset

│   └── main.jsx

├── public/

├── index.html

├── tailwind.config.js

└── README.md


### Setup / Installation

1.  Bashgit clone cd project-name
    
2.  Bashnpm install
    
3.  Bashnpm run dev
    

### Usage

1.  **Track Progress**: Click the circles next to questions to mark them as done.
    
2.  **Search**: Use the search bar to find specific problems; topics will auto-expand to show results.
    
3.  **Customize**: Click "New Topic" or the "+ Add" buttons within cards to add your own categories or question links.
    
4.  **Reorder**: Use the grip icon on the left of topic cards to drag them into a new order.
    

### Limitations

*   Reordering is currently limited to the Topic level (Sub-topics and Questions use fixed order).
    
*   No cloud sync; data is restricted to the specific browser/device used.
    
*   Not optimized for mobile view (Best viewed on Desktop).
    

### Future Enhancements

*   Implement nested drag-and-drop for questions.
    
*   Add a "Dark Mode" toggle.
    
*   Integrate Firebase for cross-device synchronization.
    

###  Author

**Vasundhara Devi** 
Second Year Engineering Student
