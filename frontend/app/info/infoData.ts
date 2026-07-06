export interface InfoSection {
  heading?: string;
  paragraphs: string[];
  listItems?: string[];
  listType?: 'ordered' | 'unordered';
}

export interface InfoPage {
  slug: string;
  title: string;
  category: 'guides' | 'legal' | 'technical' | 'support';
  description: string;
  sections: InfoSection[];
}

export const infoPages: Record<string, InfoPage> = {
  'about': {
    slug: 'about',
    title: 'About Us',
    category: 'guides',
    description: 'Learn about the team behind Snake & Ladder Online and our mission to modernize classic board games.',
    sections: [
      {
        heading: 'Our Mission',
        paragraphs: [
          'Snake & Ladder Online is dedicated to bringing timeless, classic board games into the modern digital age. We believe that simple, turn-based games hold a unique power to connect people across generations, distances, and technology gaps.',
          'By rebuilding the classic game with real-time web technologies, we aim to provide a frictionless play space where friends, families, and solo enthusiasts can jump into a match in seconds without installations, registrations, or paywalls.'
        ]
      },
      {
        heading: 'Why We Built This',
        paragraphs: [
          'Many online versions of classic games are weighed down by bloated user registrations, invasive advertising, or slow loading times. We wanted to design a sleek, performance-first platform that highlights minimalist visual design, micro-animations, and server-validated security.',
          'Our platform is designed for cross-platform play, running smoothly on mobile phones, tablets, and desktop computers alike.'
        ]
      }
    ]
  },
  'contact': {
    slug: 'contact',
    title: 'Contact Us',
    category: 'support',
    description: 'Get in touch with our team for general inquiries, feedback, or support queries.',
    sections: [
      {
        heading: 'Get in Touch',
        paragraphs: [
          'We love hearing from our community! Whether you have feature suggestions, business inquiries, or questions about game mechanics, please feel free to drop us a message using our contact channels.',
          'Our core team is located in Bengaluru, India, and we strive to respond to all inquiries within 24 to 48 hours.'
        ]
      },
      {
        heading: 'Alternative Contact Methods',
        paragraphs: [
          'Email support: vijaysingh.handler@gmail.com',
          'GitHub issue tracker: https://github.com/theajthakur/Snake-Ladder/issues'
        ]
      }
    ]
  },
  'privacy': {
    slug: 'privacy',
    title: 'Privacy Policy',
    category: 'legal',
    description: 'Understand how we collect, use, and safeguard your data on our gaming platform.',
    sections: [
      {
        heading: 'Data We Collect',
        paragraphs: [
          'We value your privacy. Unlike many gaming platforms, Snake & Ladder Online does not require user accounts. We collect minimal personal data to run the multiplayer lobbies. This includes your custom nickname (which is temporary) and temporary session cookies in local storage.',
          'We do not collect or store permanent identifiers, location data, or personal contact details during gameplay.'
        ]
      },
      {
        heading: 'Lobby and Session Security',
        paragraphs: [
          'Lobby details (including nicknames, connections, and turn histories) are kept in the backend server memory. Lobbies automatically expire and clean themselves up after 5 minutes of inactivity or immediately upon game completion. No game histories are permanently archived on our servers.'
        ]
      },
      {
        heading: 'Cookies and Tracking',
        paragraphs: [
          'We use local storage strictly to preserve your sound preferences, recent room ID, and player ID. This data never leaves your browser unless required to validate your turn with the API.',
          'We use lightweight Vercel Web Analytics and Speed Insights to track platform loading times and errors. These tools process anonymized metrics to help us optimize the performance of the game.'
        ]
      }
    ]
  },
  'terms': {
    slug: 'terms',
    title: 'Terms & Conditions',
    category: 'legal',
    description: 'Review the rules, terms, and agreements for playing games on our platform.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        paragraphs: [
          'By accessing and playing games on Snake & Ladder Online, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.'
        ]
      },
      {
        heading: 'Usage and Etiquette',
        paragraphs: [
          'You agree to use this platform only for lawful and recreational purposes. Custom nicknames in online multiplayer mode must not contain offensive, defamatory, or abusive language. Lobbies found violating these rules may be closed without notice.'
        ]
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'Snake & Ladder Online is provided on an "as is" and "as available" basis. We make no warranties regarding uninterrupted uptime, server-side room persistence, or the absolute prevention of network latency during real-time dice rolls.'
        ]
      }
    ]
  },
  'cookie-policy': {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    category: 'legal',
    description: 'Learn how we use local storage and cookies to maintain your game state and volume preferences.',
    sections: [
      {
        heading: 'What are Cookies and Web Storage?',
        paragraphs: [
          'Cookies and browser Local Storage are small files or data slots saved on your device when you load websites. They allow the browser to remember details like your settings, current game states, or audio preferences.'
        ]
      },
      {
        heading: 'Our Use of Local Storage',
        paragraphs: [
          'We use local storage to store functional settings that make your gameplay smooth. Specifically, we save:',
          '1. Sound Toggle State: Remembers whether you have muted the board sounds.',
          '2. Current Session IDs: Remembers your active player UUID and Room invite code so that refreshing your browser doesn\'t kick you out of an active match.',
          'These settings are stored locally on your device and are never shared with or sold to third-party advertising companies.'
        ]
      }
    ]
  },
  'disclaimer': {
    slug: 'disclaimer',
    title: 'Disclaimer',
    category: 'legal',
    description: 'General disclaimer of warranties and limitation of liability for our web platform.',
    sections: [
      {
        heading: 'Recreational Purposes Only',
        paragraphs: [
          'The games, rules, and mathematical dice predictions on Snake & Ladder Online are intended solely for recreational, family-friendly entertainment. This platform does not support, promote, or integrate real-money gambling, cash prizes, or virtual currencies.'
        ]
      },
      {
        heading: 'Uptime and Latency',
        paragraphs: [
          'While we strive to maintain high-performance servers, we cannot guarantee that real-time matchmaking, connection states, or WebSocket updates will be entirely free from delays or disconnections due to network congestion or server load.'
        ]
      }
    ]
  },
  'faq': {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    category: 'support',
    description: 'Find answers to common questions about multiplayer matchmaking, game configurations, and dice mechanics.',
    sections: [
      {
        heading: 'Multiplayer Matchmaking',
        paragraphs: [
          'Q: Can I play with more than 4 players?',
          'A: Currently, both local offline and online multiplayer modes support a maximum of 4 players to ensure that the board screen and player tokens fit comfortably on all mobile and desktop devices.',
          'Q: Do my friends need to create an account to join my lobby?',
          'A: No! None of the players need accounts. You only need to create a room, copy the invite code (UUID), and share it with your friends. They can paste the code in the "Join Room" input to enter the lobby.'
        ]
      },
      {
        heading: 'Game Mechanics & Rules',
        paragraphs: [
          'Q: Why is my dice locked?',
          'A: In accordance with traditional rules, you must roll a 6 to enter the board. Once you roll a 6, your token enters cell 1, and your turn passes. From then on, you can roll any number to move forward.',
          'Q: What is the target prediction display?',
          'A: When it is your turn, hovering over the board highlights the outcome paths. It marks landing on a ladder in green and a snake head in red for potential rolls of 1 through 6. This helps you plan your moves.'
        ]
      }
    ]
  },
  'how-to-play': {
    slug: 'how-to-play',
    title: 'How to Play',
    category: 'guides',
    description: 'A beginner-friendly guide to rolling the dice, navigating ladders, and dodging snakes on the 100-cell grid.',
    sections: [
      {
        heading: 'Quick Start Steps',
        paragraphs: [
          '1. Choose a mode: Local Offline or Online Multiplayer.',
          '2. Pick your nickname and configure your player size (2 to 4 players).',
          '3. Roll the dice on your turn. You must roll a 6 to transition your token from the lock (cell 0) onto the first board cell (cell 1).',
          '4. Once on the board, roll the dice to advance. Ladders will slide you upward, while snakes will pull you backward.',
          '5. Reach cell 100 with an exact roll to win the game!'
        ],
        listItems: [
          'Roll a 6 to enter cell 1.',
          'Land on ladder bases to climb higher.',
          'Avoid landing on red snake heads.',
          'Land on cell 100 exactly.'
        ],
        listType: 'unordered'
      }
    ]
  },
  'rules': {
    slug: 'rules',
    title: 'Official Game Rules',
    category: 'guides',
    description: 'Detailed official board game rules, entry conditions, movement limits, and win conditions.',
    sections: [
      {
        heading: 'Board Setup and Cells',
        paragraphs: [
          'The game board is a 10x10 grid containing 100 cells, numbered sequentially from 1 (bottom left) to 100 (top left). The grid alternates direction on each row in a serpentine layout.'
        ]
      },
      {
        heading: 'Roll and Movement Rules',
        paragraphs: [
          '1. Turn Sequence: Players roll sequentially. If you are in offline mode, players take turns on the same device. In online mode, the server controls the turn rotation.',
          '2. Initial Entry: A token remains at position 0 (off-board) until the player rolls a 6. Rolling a 6 immediately places the token on cell 1. Your turn then passes.',
          '3. Ladder Climbing: If your token lands on the bottom of a ladder after moving, it automatically slides up the ladder to the top cell.',
          '4. Snake Sliding: If your token lands on a red snake head, it automatically slides down to the tail cell.'
        ]
      },
      {
        heading: 'Victory Condition',
        paragraphs: [
          'To win the match, a player must land exactly on cell 100. If your dice roll value exceeds the exact distance to 100, your token remains in place and your turn is passed. For example, if you are on cell 98, you need a roll of exactly 2. Rolling a 3, 4, 5, or 6 will result in no movement.'
        ]
      }
    ]
  },
  'features': {
    slug: 'features',
    title: 'Game Features',
    category: 'guides',
    description: 'Explore the modern features we built into this classic game, from sound controls to hover predictions.',
    sections: [
      {
        heading: 'Strategic Hover Predictions',
        paragraphs: [
          'We added a modern tactical twist to the game. When it is your turn, hovering over the board displays the landing positions for future rolls of 1 through 6. This lets you anticipate whether a roll is risky (landing on a snake) or highly rewarding (landing on a ladder).'
        ]
      },
      {
        heading: 'Server-Authoritative Online Lobbies',
        paragraphs: [
          'Our online multiplayer is built with a server-authoritative architecture. The backend validates every roll request, ensuring that players cannot manipulate dice outputs or skip turns.'
        ]
      },
      {
        heading: 'Volume and SFX Controls',
        paragraphs: [
          'Control your audio environment! Use the sound toggle in the floating menu to quickly turn board sound effects (dice rolls, steps, slides, and wins) on or off.'
        ]
      }
    ]
  },
  'multiplayer-guide': {
    slug: 'multiplayer-guide',
    title: 'Multiplayer Guide',
    category: 'guides',
    description: 'Learn how to host private rooms, generate lobby invite codes, and connect with other players online.',
    sections: [
      {
        heading: 'Hosting an Online Game',
        paragraphs: [
          'To start a room as a host:',
          '1. On the home page, select "Online Multiplayer".',
          '2. Customize your nickname or use the random generator.',
          '3. Click "Create Room" and select your player size (2, 3, or 4 players).',
          '4. Copy the unique invite code and share it with your friends.'
        ]
      },
      {
        heading: 'Joining an Invite Code',
        paragraphs: [
          'To join an existing room:',
          '1. Select "Online Multiplayer" and enter your nickname.',
          '2. Select "Join Room" and paste the room invite code.',
          '3. Once the lobby is full, the server automatically starts the game and redirects all players to the board.'
        ]
      }
    ]
  },
  'fair-play': {
    slug: 'fair-play',
    title: 'Fair Play & Random Dice System',
    category: 'guides',
    description: 'An in-depth look at our backend dice roll generation, security validation, and session lifecycle.',
    sections: [
      {
        heading: 'Cryptographically Secure Randomness',
        paragraphs: [
          'We believe in absolute fairness. In online multiplayer, all dice rolls are generated on the server using Python\'s secure random integer modules. The client only displays the outcome and cannot override the result.',
          'This blocks clients from injecting custom rolls or manipulating game states.'
        ]
      },
      {
        heading: 'Lobby Lifecycle and Auto-Expiration',
        paragraphs: [
          'To prevent server clutter, active lobbies are managed dynamically in memory:',
          '- Inactivity Expiration: Lobbies that have no dice throws or joins for 5 minutes are deleted automatically.',
          '- Win Lock: Once a player reaches cell 100, the game is marked complete. The server blocks all subsequent throws, letting the room expire.'
        ]
      }
    ]
  },
  'browser-compatibility': {
    slug: 'browser-compatibility',
    title: 'Browser Compatibility',
    category: 'technical',
    description: 'Verify your web browser support and configuration for running real-time game sockets.',
    sections: [
      {
        heading: 'Supported Browsers',
        paragraphs: [
          'Our platform is designed to run on all modern HTML5-compliant web engines. We recommend updating your browser to the latest version for the best audio and visual animation performance.',
          'Supported browsers include Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and Opera.'
        ]
      },
      {
        heading: 'Network Requirements',
        paragraphs: [
          'Online multiplayer requires basic HTTP communication. Please ensure that your browser allows cookies and local storage, and that your local network does not block external API calls to snakeladder.me domains.'
        ]
      }
    ]
  },
  'supported-devices': {
    slug: 'supported-devices',
    title: 'Supported Devices',
    category: 'technical',
    description: 'Check screen size recommendations and optimization guidelines for mobile and desktop screens.',
    sections: [
      {
        heading: 'Responsive Grid Layout',
        paragraphs: [
          'The game board uses a ResizeObserver to scale dynamically. Whether you are playing on a narrow mobile phone, a wider tablet screen, or a large desktop monitor, the game adjusts its aspect ratio to remain playable.'
        ]
      },
      {
        heading: 'Control Schemes',
        paragraphs: [
          '- Desktop: Click elements using your mouse cursor or trackpad.',
          '- Mobile & Tablet: Tap triggers directly on your touch screen. All menus and dice rollers are optimized for thumb reach.'
        ]
      }
    ]
  },
  'accessibility': {
    slug: 'accessibility',
    title: 'Accessibility',
    category: 'technical',
    description: 'Read our accessibility compliance statement, font scaling options, and contrast standards.',
    sections: [
      {
        heading: 'Our Accessibility Commitment',
        paragraphs: [
          'We aim to make Snake & Ladder Online accessible to as many players as possible. The UI uses semantic HTML5 structural layouts and includes explicit focus outlines on buttons.',
          'We use highly distinguishable red and green highlights for predictive paths to support color-blind users in identifying snakes and ladders.'
        ]
      },
      {
        heading: 'Screen Readers & Navigation',
        paragraphs: [
          'We are continuously working to improve screen reader labels (aria-label) on the interactive dice roller and sound control options to make navigation easier.'
        ]
      }
    ]
  },
  'community-guidelines': {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    category: 'legal',
    description: 'Review our chat, nickname, and server lobby requirements to maintain a safe playing space.',
    sections: [
      {
        heading: 'Respectful Gameplay',
        paragraphs: [
          'We are committed to providing a friendly and welcoming environment. You agree to use appropriate and respectful custom nicknames when setting up multiplayer lobbies.',
          'Nicknames containing hate speech, harassment, vulgarity, or references to illegal activities are strictly forbidden.'
        ]
      },
      {
        heading: 'Reporting Abusive Behavior',
        paragraphs: [
          'If you witness players using offensive names in public rooms, please close the session or notify our support team. We reserves the right to terminate rooms violating these guidelines.'
        ]
      }
    ]
  },
  'responsible-gaming': {
    slug: 'responsible-gaming',
    title: 'Responsible Gaming',
    category: 'legal',
    description: 'Entertainment limits, gameplay safety tips, and advice on healthy playing habits.',
    sections: [
      {
        heading: 'Play for Fun',
        paragraphs: [
          'Snake & Ladder Online is designed as a quick, free leisure game. We encourage players to enjoy the game responsibly and take regular breaks, especially during long playing sessions with friends.'
        ]
      },
      {
        heading: 'No Real-Money Mechanics',
        paragraphs: [
          'Our platform does not support microtransactions, betting, or cash wagers. It is purely designed for friendly, free entertainment.'
        ]
      }
    ]
  },
  'safety-privacy': {
    slug: 'safety-privacy',
    title: 'Safety & Privacy',
    category: 'legal',
    description: 'Explore safety settings, lobby security, and how local data is processed.',
    sections: [
      {
        heading: 'Room Code Security',
        paragraphs: [
          'When hosting a multiplayer game, your room invite code (UUID) is unique and randomized. It is only shared with the players you choose to invite. The server isolates room states, preventing unauthorized users from accessing or joining your active match.'
        ]
      },
      {
        heading: 'Data Integrity',
        paragraphs: [
          'Since we do not collect personal account information, there is no risk of password or database leaks. Your custom nicknames are discarded as soon as the room expires.'
        ]
      }
    ]
  },
  'changelog': {
    slug: 'changelog',
    title: 'Changelog',
    category: 'guides',
    description: 'See the release history, feature updates, and engine patches of our game board client.',
    sections: [
      {
        heading: 'Version 0.2.0 - Multiplayer Enhancements',
        paragraphs: [
          '- Implemented dynamic sitemaps, robots.txt, and PWA manifest templates.',
          '- Added a comprehensive Information Hub with 25 static guides and resources.',
          '- Restructured page-level layouts to enable scrolling for textual guides.'
        ]
      },
      {
        heading: 'Version 0.1.0 - Core Game Launch',
        paragraphs: [
          '- Rebuilt the game layout using Next.js App Router and Tailwind CSS v4.',
          '- Created a Fast API backend with server-authoritative turn validation.',
          '- Implemented the strategic hover prediction panel (rolls 1-6).',
          '- Integrated preloaded HTML5 Audio API for dice throws and board steps.'
        ]
      }
    ]
  },
  'roadmap': {
    slug: 'roadmap',
    title: 'Roadmap',
    category: 'guides',
    description: 'Discover upcoming features, scheduled UI designs, and multiplayer upgrades.',
    sections: [
      {
        heading: 'Phase 1: Performance Tuning (Current)',
        paragraphs: [
          'Focusing on SEO, structured JSON-LD schemas, and dynamic sitemaps to optimize Google search indexing and AdSense compliance.'
        ]
      },
      {
        heading: 'Phase 2: Social Upgrades (Q3 2026)',
        paragraphs: [
          'Introducing dynamic, pre-written lobby chat snippets so players in online rooms can communicate during matches without needing account log-ins.'
        ]
      },
      {
        heading: 'Phase 3: Customization (Q4 2026)',
        paragraphs: [
          'Adding alternative color themes for the game board grid and token skins that players can select before rolling.'
        ]
      }
    ]
  },
  'help': {
    slug: 'help',
    title: 'Help & Support',
    category: 'support',
    description: 'Get support for connectivity troubleshooting, board scaling, and lobby connection problems.',
    sections: [
      {
        heading: 'Lobby Troubleshooting',
        paragraphs: [
          'If you or your friends cannot connect to a room:',
          '1. Ensure you copied the exact Room Code (invite UUID).',
          '2. Make sure the room has not expired (inactive rooms are cleaned up after 5 minutes).',
          '3. Refresh your page: Next.js will restore your active player ID from local storage and attempt to reconnect.'
        ]
      },
      {
        heading: 'Board Scaling Issues',
        paragraphs: [
          'If the board is partially cut off, try resizing your browser window or rotating your mobile device. The layout uses a ResizeObserver to recalculate and fit the screen.'
        ]
      }
    ]
  },
  'report-bug': {
    slug: 'report-bug',
    title: 'Report a Bug',
    category: 'support',
    description: 'Help us improve by reporting glitches, visual bugs, or backend disconnects.',
    sections: [
      {
        heading: 'Bug Report Guidelines',
        paragraphs: [
          'Found a bug? Help us squash it! When submitting a report, please include details like your browser version, whether it happened in offline or online mode, and a short description of the steps to replicate the issue.',
          'You can use the form below to file a report directly to our development repository.'
        ]
      }
    ]
  },
  'feedback': {
    slug: 'feedback',
    title: 'Feedback',
    category: 'support',
    description: 'Share your ideas, suggestions, and gaming experience with our development team.',
    sections: [
      {
        heading: 'Help Us Improve',
        paragraphs: [
          'We value your feedback. Let us know how you like the classic board layout, the strategic prediction hovers, or what features you would like to see in our next release.',
          'Submit your thoughts using the form below!'
        ]
      }
    ]
  },
  'credits': {
    slug: 'credits',
    title: 'Credits',
    category: 'support',
    description: 'Acknowledge the libraries, creators, and assets used to build this digital board game.',
    sections: [
      {
        heading: 'Core Development & Design',
        paragraphs: [
          'Rebuilt and maintained by the Snake & Ladder Multiplayer Team.'
        ]
      },
      {
        heading: 'Technologies Used',
        paragraphs: [
          '- Framework: Next.js (App Router) & React.',
          '- Styling: Tailwind CSS v4.',
          '- Icons: Lucide React library.',
          '- Backend: FastAPI Python framework & Uvicorn server.',
          '- Analytics: Vercel Web Analytics.'
        ]
      }
    ]
  },
  'licenses': {
    slug: 'licenses',
    title: 'Open Source & Licenses',
    category: 'support',
    description: 'Review MIT licensing files, open source acknowledgements, and graphic asset credits.',
    sections: [
      {
        heading: 'MIT License',
        paragraphs: [
          'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...',
          'The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.'
        ]
      }
    ]
  }
};
