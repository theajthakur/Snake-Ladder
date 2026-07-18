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
    title: 'About Us & Project Roadmap',
    category: 'guides',
    description: 'Learn about the team behind Snake & Ladder Online, our technology stack, and our upcoming feature roadmap.',
    sections: [
      {
        heading: 'Our Mission & Philosophy',
        paragraphs: [
          'Snake & Ladder Online was founded with a singular purpose: to modernize classic board games for the digital web era without sacrificing their nostalgic simplicity. We believe that turn-based board games possess a timeless ability to bridge generation gaps and connect people. Our goal is to provide a clean, secure, and friction-free arena where families, friends, and board game enthusiasts can play a match instantly.',
          'By leveraging modern web protocols and responsive layout structures, we eliminate the hurdles of app store installations, complex user registrations, and intrusive screen-blocking advertisements. Anyone with a browser can join a session in seconds.'
        ]
      },
      {
        heading: 'The Engineering Behind The Board',
        paragraphs: [
          'This platform is engineered using modern, light-weight, and performant web technologies to ensure compatibility across everything from budget mobile devices to high-end desktop monitors:',
          '1. Frontend Architecture: Built using the Next.js App Router framework for fast static generation and seamless page transitions.',
          '2. Canvas Engine: Uses responsive HTML5/React logic with a custom ResizeObserver wrapper that calculates board coordinates dynamically to preserve playability on all aspect ratios.',
          '3. Backend API: Uses FastAPI written in Python to manage online matchmaking lobbies, validate game states, and generate dice values authoritatively.'
        ]
      },
      {
        heading: 'Core Development Team',
        paragraphs: [
          'Our core team consists of passionate developers, mathematicians, and designers based in Bengaluru, India. We are dedicated to maintaining the platform as a free, open-source resource for students, teachers, and casual gamers worldwide. We regularly update the engine code to improve WebSocket stability and screen reader accessibility.'
        ]
      },
      {
        heading: 'Upcoming Features Roadmap',
        paragraphs: [
          'To ensure the game remains engaging and aligned with user feedback, we have planned a progressive development roadmap:',
          '• Phase 1 (Performance & SEO): Implementing structured JSON-LD schemas, dynamic metadata optimization, and layout adjustments for reading accessibility.',
          '• Phase 2 (Social Interactions): Launching pre-configured, safety-filtered lobby text templates so players in public rooms can express excitement or send friendly emotes without account logins.',
          '• Phase 3 (Visual Customization): Adding unlockable alternative board color schemes, token skins, and customized dice rolling sounds that can be toggled in the configuration menu.'
        ]
      }
    ]
  },
  'how-to-play': {
    slug: 'how-to-play',
    title: 'How to Play & Official Rules',
    category: 'guides',
    description: 'A comprehensive guide to rolling the dice, board navigation rules, token movement, and victory conditions.',
    sections: [
      {
        heading: 'Introduction to the Serpent Grid',
        paragraphs: [
          'The Snake & Ladder board consists of a 10x10 grid containing 100 cells, numbered sequentially from 1 to 100. The layout follows a serpentine grid direction, meaning the numbering goes from left-to-right on the bottom row, right-to-left on the second row, and continues alternating directions all the way to the top left cell.'
        ]
      },
      {
        heading: 'Step-by-Step Rules of Play',
        paragraphs: [
          'Each player selects a unique colored token. Players take turns rolling a standard 6-sided dice, either passing the device in Local Offline mode or waiting for server synchronization in Online Multiplayer mode.',
          '1. Board Entry: All tokens begin locked off-board at cell 0. A player must roll an exact 6 to unlock their token and place it on cell 1. Once a token is on cell 1, the turn passes.',
          '2. Moving forward: After entering the board, rolling the dice advances your token forward by the corresponding number of cells.',
          '3. Ladders (Climbing): If a player lands exactly on a cell containing the base of a ladder, the token automatically slides upward along the ladder path to its destination cell at the top.',
          '4. Snakes (Sliding): If a player lands exactly on a cell containing the head of a snake, the token must slide downward to the tail cell, resulting in a setback.'
        ]
      },
      {
        heading: 'Winning the Match',
        paragraphs: [
          'To win the game, a player must land exactly on cell 100. If your dice roll value is larger than the exact distance to 100, your token remains in place and your turn is forfeited. For example, if your token is on cell 98, you need a roll of exactly 2 to win. Rolling a 3, 4, 5, or 6 will result in no movement, and you must wait for your next turn to try again.'
        ]
      },
      {
        heading: 'Strategic Hover Prediction Helper',
        paragraphs: [
          'To introduce tactical foresight to a game otherwise governed by probability, we created a hover prediction display. When it is your turn, hovering over the dice highlights the exact target cells for rolls of 1 through 6. This highlights potential ladder climbs in green and snake traps in red, helping you anticipate landing spots before rolling.'
        ]
      }
    ]
  },
  'multiplayer-guide': {
    slug: 'multiplayer-guide',
    title: 'Online Multiplayer & Fair Play Guide',
    category: 'guides',
    description: 'Learn how to host or join online lobbies and how our secure server validation ensures complete fairness.',
    sections: [
      {
        heading: 'Hosting a Private or Public Room',
        paragraphs: [
          'Playing with friends online is fast and requires no registration. To host a game:',
          '1. Select "Online Multiplayer" from the main menu.',
          '2. Enter your nickname. You can also click the reload icon to generate a fun, randomized gaming handle.',
          '3. Select "Create Room" and choose the room size (2, 3, or 4 players).',
          '4. Choose whether to make the room public (visible in the lobbies list) or private (only joinable via invite code).',
          '5. Copy the randomized Room Invite Code (UUID) and share it with your friends.'
        ]
      },
      {
        heading: 'Joining an Existing Lobby',
        paragraphs: [
          'If a friend has sent you an invite code, select "Online Multiplayer", enter your nickname, click "Join Room", paste the invite UUID into the code input, and click join. Alternatively, you can view the "Available Open Lobbies" table to see public games currently looking for players and join them instantly.',
          'Once the lobby slots are fully populated, the backend automatically transitions all connected players to the interactive board screen and rolls begin.'
        ]
      },
      {
        heading: 'Lobby Lifecycle & Memory Management',
        paragraphs: [
          'To prevent server bloat and maintain high-performance latency standards, all active lobbies are held in server memory under strict cleanup lifecycles:',
          '• Expiration Lock: If a room experiences no active dice rolls or player joins for 5 minutes, the server automatically expires the lobby and removes it from memory.',
          '• Completion Cleanup: As soon as a player reaches cell 100, the game is marked complete. The server blocks further dice actions, allowing the room resources to be reclaimed.'
        ]
      },
      {
        heading: 'Fair Play & Random Dice Math',
        paragraphs: [
          'We take gameplay integrity seriously. To prevent coordinate manipulation, client-side memory hacks, or dice rigging, our online matchmaking uses a server-authoritative architecture:',
          '1. Cryptographically Secure Values: All dice rolls are computed on the FastAPI backend using Python\'s secure random modules, which tap into operating-system-level randomness sources. The client has no control over the outcome.',
          '2. Turn Enforcement: The server monitors whose turn it is. If a player submits a roll request out of turn or sends spoofed positions, the server rejects the WebSocket frame and returns an error message.'
        ]
      }
    ]
  },
  'faq': {
    slug: 'faq',
    title: 'Frequently Asked Questions (FAQ)',
    category: 'support',
    description: 'Find answers to common questions about gameplay mechanics, lobby connections, and troubleshooting.',
    sections: [
      {
        heading: 'Matchmaking & Connection Issues',
        paragraphs: [
          'Q: My friends cannot join my multiplayer room. What should I check?',
          'A: First, verify that your friends have pasted the exact Room Invite Code (a standard 36-character UUID). Second, make sure the room has not expired—inactive lobbies are automatically closed after 5 minutes. If a player disconnects temporarily, they can refresh their page to let the browser automatically restore their session from local storage.',
          'Q: Can I play with more than 4 players?',
          'A: To maintain text readability, board layout alignment, and visual scaling on compact mobile screens, both offline and online modes are capped at a maximum of 4 players.'
        ]
      },
      {
        heading: 'Dice Mechanics & Rules Queries',
        paragraphs: [
          'Q: Why can I not move my token when the game starts?',
          'A: In traditional rules, all player tokens start locked in position 0. You must roll an exact 6 on your turn to release your token onto cell 1. Until you roll a 6, your token will remain locked and your turn passes.',
          'Q: What happens if my dice roll goes past cell 100?',
          'A: You must land on cell 100 with an exact roll. If you are on cell 99 and roll a 2, 3, 4, 5, or 6, your token remains in place and your turn is skipped. You need a roll of exactly 1 to finish.'
        ]
      },
      {
        heading: 'Device & Browser Compatibility',
        paragraphs: [
          'Q: Does this game require a high-speed connection or gaming hardware?',
          'A: No. The game is highly optimized to run smoothly on any HTML5-compliant browser. It uses minimal battery and light-weight CSS transitions. For online multiplayer, a basic stable internet connection is sufficient.'
        ]
      }
    ]
  },
  'privacy': {
    slug: 'privacy',
    title: 'Privacy & Cookies Policy',
    category: 'legal',
    description: 'Learn how we manage session storage, cookies, and protect your privacy on our platform.',
    sections: [
      {
        heading: 'Zero Account Data Policy',
        paragraphs: [
          'Unlike modern gaming platforms that require extensive user logins, passwords, and personal details, Snake & Ladder Online does not require user registration. We believe in absolute data minimization. We do not collect, store, or sell any permanent personal identifiers, emails, names, or location data during your gaming session.'
        ]
      },
      {
        heading: 'Lobby Security & Nickname Storage',
        paragraphs: [
          'When you enter an online room, the nickname you choose and your randomized player ID are stored temporarily in the server\'s memory to coordinate turn rotations. This session data is completely erased from server memory as soon as the room completes or expires due to inactivity.'
        ]
      },
      {
        heading: 'Cookies & Browser Local Storage',
        paragraphs: [
          'We do not use tracking or advertising cookies. Instead, we utilize browser Local Storage strictly to preserve functional preferences so your game isn\'t interrupted. Specifically, we save:',
          '1. Sound Toggle State: Remembers whether you have muted the board sounds.',
          '2. Active Session Credentials: Saves your temporary player ID and invite code so that refreshing your browser restores your spot in the active match rather than kicking you out.',
          'This data remains entirely on your local device and is never transmitted to external analytics or marketing networks.'
        ]
      },
      {
        heading: 'Lightweight Analytics & Consent',
        paragraphs: [
          'To monitor server stability and optimize layout loading times, we run lightweight, anonymous performance tracking through Vercel Web Analytics. We do not track cross-site behaviors, and you can manage consent settings via our interface dialog at any time.'
        ]
      }
    ]
  },
  'terms': {
    slug: 'terms',
    title: 'Terms of Service & Disclaimer',
    category: 'legal',
    description: 'Review the rules of conduct, service limitations, and liability disclaimers for using our platform.',
    sections: [
      {
        heading: 'Acceptance of Service Terms',
        paragraphs: [
          'By accessing, hosting, or playing matches on Snake & Ladder Online, you agree to comply with these terms. If you do not agree to these rules, please discontinue use of the platform.'
        ]
      },
      {
        heading: 'Code of Conduct & Nicknames',
        paragraphs: [
          'You agree to use our lobby services in a respectful, family-friendly manner. Custom player nicknames must not contain offensive, defamatory, or abusive terminology. Lobbies violating these rules are subject to termination by the system administration without prior notice.'
        ]
      },
      {
        heading: 'Liability Limitation Disclaimer',
        paragraphs: [
          'Snake & Ladder Online is provided on an "as is" and "as available" basis. While we strive to maintain high server uptime and accurate dice logic, we make no warranties regarding uninterrupted connectivity, WebSocket persistence, or the total absence of network latency during real-time rolls. We are not responsible for any session data loss resulting from browser refreshes or server updates.'
        ]
      },
      {
        heading: 'Recreational Use Only',
        paragraphs: [
          'All game boards, dice mechanics, and calculations on this site are intended solely for free, family-friendly entertainment. This platform does not support, integrate, or promote real-money wagering, betting structures, or virtual currency microtransactions.'
        ]
      }
    ]
  },
  'contact': {
    slug: 'contact',
    title: 'Support & Feedback Hub',
    category: 'support',
    description: 'Get in touch with our team to report bugs, send general questions, or share your suggestions.',
    sections: [
      {
        heading: 'How to Reach Us',
        paragraphs: [
          'We value feedback from our community of players! Whether you have found a visual glitch, want to suggest a new custom feature, or have a question about the open-source code repository, we would love to hear from you.',
          'The core team is active in Bengaluru, India. We strive to review and respond to inquiries within 24 to 48 hours. Please choose the appropriate tab in the form below to file a structured report.'
        ]
      },
      {
        heading: 'Alternative Support Channels',
        paragraphs: [
          'If you prefer to contact us directly or track codebase developments:',
          '• Support Email: vijaysingh.handler@gmail.com',
          '• Open Source Repository Issues: https://github.com/theajthakur/Snake-Ladder/issues'
        ]
      }
    ]
  },
  'compatibility': {
    slug: 'compatibility',
    title: 'Technical Specs & Accessibility',
    category: 'technical',
    description: 'Review device requirements, scaling behaviors, and accessibility integrations.',
    sections: [
      {
        heading: 'Supported Browsers & Viewports',
        paragraphs: [
          'Our platform is designed to run on all modern HTML5 web engines. We recommend updating your browser to its latest version to ensure optimal rendering of preloaded audio assets and smooth token animations.',
          'Supported browsers include Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and Opera. The game runs on Android and iOS mobile web engines seamlessly.'
        ]
      },
      {
        heading: 'Responsive Coordinate Scaling',
        paragraphs: [
          'To support responsive cross-platform play, the game board wrapper uses a ResizeObserver API. As you resize your desktop window or rotate your tablet/phone, the canvas wrapper recalculates absolute coordinates dynamically, ensuring player tokens and ladder vectors align perfectly with grid cells.'
        ]
      },
      {
        heading: 'User Input & Controls',
        paragraphs: [
          '• Desktop & Laptops: Trigger dice rolls and menu options easily using mouse pointer clicks or trackpad gestures.',
          '• Touch Screen Devices: Tap interface elements directly. All dice controls and game settings menus are scaled for comfortable thumb-reach on mobile layouts.'
        ]
      },
      {
        heading: 'Accessibility Commitment',
        paragraphs: [
          'We believe classic games should be playable by everyone. The interface utilizes structured HTML5 headers, explicit button roles, and focus ring outlines to facilitate screen reader navigation. For color-blind players, the hover prediction guide uses distinct, highly saturated green paths for ladders and red paths for snakes to ensure clear visual differentiation.'
        ]
      }
    ]
  },
  'changelog': {
    slug: 'changelog',
    title: 'Game Engine Changelog',
    category: 'guides',
    description: 'Track the version history, code optimizations, and feature updates of the game engine.',
    sections: [
      {
        heading: 'Version 0.2.0 - Optimization Update (Current)',
        paragraphs: [
          '• Content Refactoring: Consolidated 25 thin text resources into 9 high-value, comprehensive pages to improve site architecture.',
          '• Support Consolidation: Created a unified, tabbed Support Hub component handling general messages, bug submissions, and experience rating.',
          '• Sitemap Optimization: Updated sitemap logic and robots files to map consolidated pages and original blog posts.',
          '• Performance: Optimized canvas rendering calculations to reduce CPU usage during token steps.'
        ]
      },
      {
        heading: 'Version 0.1.0 - Engine Launch',
        paragraphs: [
          '• Game Engine: Released Next.js client-side board featuring strategic hover predictions.',
          '• Authoritative Server: Developed a Python FastAPI backend to validation dice rolls, handle room matching, and manage player turn rotations.',
          '• Audio: Integrated HTML5 preloaded sound effects for board steps, climbing ladders, snake slides, and wins.'
        ]
      }
    ]
  }
};
