export const projectsOrder = [
    'project_kuro',
    'portfolio_website',
    'matraex_inc',
    'venture_title',
    'hbv',
    'high_call_rodeo',
    'salestrak',
    'rio_genesis',
    'black_sage_tech',
    'motorpool_services',
    'bronco_beam',
    'all_in_favor',
    'the_simple_ring_alpha',
    'planet_destroyer',
    'abc_stories',
    'minesweeper_solver',
    'cash_n_slash',
    'swordwhip',
    'deadline',
    'defend',
    'uno_ai',
    'survive',
    'original_logo_animation',
];

export const projectData = {
    project_kuro: {
        title: 'Project Kuro',
        startDate: 'January 1, 2023',
        endDate: 'Present',
        createdIn: 'Unreal Engine 5',
        img: '/images/projects/projectkuro.webp',
        description: ` I have been planning this project for a long time. It was inspired by many tabletop RPG games I played with my friends. I plan to convert some of the stories that arose from my turn-by-turn tabletop games into a realtime third-person game.`,
        stack: 'Unreal Engine 5, C++, Blender, Krita, Substance Painter',
    },
    portfolio_website: {
        title: 'Portfolio Website',
        startDate: 'October 26, 2022',
        endDate: 'Present',
        createdIn: 'React',
        img: '/images/projects/portfolioSite.webp',
        description: `This project was originally a class project, you are currently looked at the 3rd and probably final update.`,
        stack: 'React, Javascript, Blender, Krita, Markdown, HTML5 canvas',
        content: [
            '/',
        ],
        link: {
            website: '/'
        },
        keyFeatures: `
        - Created custom navigation that parses the url to 'rotate' to the selected page
        - Simulated a CSS cube. To save RAM & CPU usage, pages aren't rendered in the HTML if they aren't being used
        - I created all minigames in JavaScript, although I am not the original creator of the game concepts
        - Minigames are: Duck hunt, Minesweeper, Snake, Fruit Ninja
        - References of: Windows XP, and Star Wars
        - Added achievements, and even more functionality`,
    },
    matraex_inc: {
        title: 'Matraex Inc.',
        startDate: 'January 17, 2023',
        endDate: 'August 11, 2023',
        createdIn: 'PHP / SQL / JQuery / React',
        img: '/images/projects/Matraex.webp',
        imgcss: {
            backgroundColor: 'white',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
        description: 'Worked as a full stack developer on multiple web and mobile projects for clients as well as in-house projects.',
        link: {
            about: 'https://www.matraex.com/',
        },
        stack: 'React, React Native, SQL, PHP, JQuery, Meteor, Mongodb',
        keyFeatures: `
        - Created scripts to automate tasks, making development faster and smoother
        - Worked with the team to improve processes and increase documentation standards
        - Made flexible tools and reusable features that are used across several projects
        - Optimized several pages, functions, and API calls
        - Presented work to clients and responded to their feedback
        - Collaborated with teammates, giving them feedback on problem solving and code optimization`,
    },
    venture_title: {
        title: 'Venture Title',
        startDate: 'May 3, 2023',
        endDate: 'August 11, 2023',
        createdIn: 'PHP / SQL / JQuery',
        img: '/images/projects/ventureidaho.webp',
        parent: 'matraex_inc',
        description: 'This is a website I worked on for a title and escrow company.',
        link: {
            website: 'https://ventureidaho.com',
        },
        stack: 'PHP, SQL, JQuery',
        keyFeatures: `
        - Added, adjusted, and redesigned responsive css styling
        - Made the website mobile friendly without a mobile wireframe`,
    },
    hbv: {
        title: 'H.B.V.',
        startDate: 'August 1, 2023',
        endDate: 'August 7, 2023',
        createdIn: 'PHP / SQL',
        img: '/images/projects/hbv.webp',
        parent: 'matraex_inc',
        fullName: 'Healthcare Business Ventures',
        description: 'This web portal was created to keep track of sales and invoices for health businesses.',
        link: {
            website: 'https://venturesys.org',
        },
        stack: 'PHP, SQL',
        keyFeatures: `
        - Implemented export of iif files for Quickbooks
        - Adjusted functionality based on client feedback`,
    },
    high_call_rodeo: {
        title: 'High Call Rodeo',
        startDate: 'July 14, 2023',
        endDate: 'July 31, 2023',
        createdIn: 'React / Meteor / Mongodb',
        img: '/images/projects/highcall.webp',
        imgcss: {
            borderRadius: '10%',
        },
        parent: 'matraex_inc',
        description: 'This website is designed to allow rodeo associations to promote their rodeos and handle contestant applications and payments.',
        link: {
            website: 'https://app.highcallrodeo.com',
        },
        stack: 'React, Meteor, Mongodb',
        keyFeatures: `
        - Audited the client's original codebase prior to beginning work
        - Did a gap analysis of where the project currently was and how much more was desired by the client
        - Documented my discoveries
        - Reviewed the client's cloud services to increase security`,
    },
    salestrak: {
        title: 'Sales Trak',
        startDate: 'January 26, 2023',
        endDate: 'July 31, 2023',
        createdIn: 'PHP / SQL / JQuery',
        img: '/images/projects/salestrak.webp',
        parent: 'matraex_inc',
        description: 'This web portal was designed to streamline sales processes for companies, initially a roofing company.',
        link: {
            website: 'https://salestrak.io',
            about: 'https://bartlettroofs.com/',
        },
        stack: 'PHP, SQL, JQuery',
        keyFeatures: `
        - Refactored and optimized several pages and API calls
        - Made custom JavaScript solutions that worked for both mouse and touch 
        - Added custom CSS animations 
        - Created many dynamic and reusable features that are used in various places in the app
        - Documented the project for offboarding to the client
        - Made the site desktop and phone friendly with only an iPad design`,
    },
    rio_genesis: {
        title: 'Rio Genesis',
        startDate: 'June 19, 2023',
        endDate: 'July 17, 2023',
        createdIn: 'PHP / SQL / React',
        img: '/images/projects/riogenesis.webp',
        parent: 'matraex_inc',
        description: 'This is a website for a real estate company that I did some quality-of-life work on.',
        link: {
            website: 'https://riogenesis.com',
        },
        stack: 'PHP, SQL, React',
        keyFeatures: `
        - Created a script that would automatically upgrade the codebase to PHP8
        - Worked through warnings and errors that were remaining after the upgrade
        - Implemented ecommerce using the USAePay API`,
    },
    black_sage_tech: {
        title: 'Black Sage Tech',
        startDate: 'January 17, 2023',
        endDate: 'February 28, 2023',
        createdIn: 'React',
        img: '/images/projects/blacksage.webp',
        parent: 'matraex_inc',
        description: 'The DefenseOS app is the front end for an API that was designed to track and monitor drones and activate defense protocols. The company has since been acquired by High Point Aerotech.',
        link: {
            about: 'https://blacksagetech.com',
        },
        stack: 'React',
        keyFeatures: `
        - Created responsive visual features within the app
        - Integrated API calls from Black Sage's back end
        - Found, documented, and notified Black Sage of vulnerabilities in the app
        - Created a React component that worked well with class and functional hooks`,
    },
    motorpool_services: {
        title: 'MotorPool Services',
        startDate: 'August 25, 2022',
        endDate: 'January 13, 2023',
        createdIn: 'React',
        img: '/images/projects/motorpool.webp',
        parent: 'gimmworks',
        description: `This project is a website for Boise State's Transportation Department. This website is designed to streamline test taking and certificate signing for employees who will be driving vans. I wrote the server, applied the front-end designed by other teammates, and added PDF creation functionality for certificates.`,
        link: {
            website: 'https://motorpooldrivercertification.com',
        },
        stack: 'React, Javascript, Express.js, MongoDB, Stripe',
        keyFeatures: `
        - Created the test functionality
        - Added the ability for users to create dynamic quizzes
        - Implemented UI/UX designs from team members
        - Added PDF creation and signing
        - Implemented password recovery via the server sending automated emails`,
    },
    bronco_beam: {
        title: 'Bronco Beam',
        startDate: 'December 21, 2020',
        endDate: 'July 30, 2022',
        createdIn: 'React Native / Mongodb',
        img: '/images/projects/BroncoBeam.webp',
        imgcss: {
            borderRadius: '10%',
        },
        parent: 'gimmworks',
        fullName: 'Bronco Beam (BEAM Tours)',
        description: `Bronco BEAM is a multi-year project of GIMM Works that is a location-based app for universities. I was asked to join the team for the V2 revamp. I refactored the server and made a web admin portal so the app is customizable and dynamic for different universities. I also refactored the app's React Native code for V3 and made a best path algorithm for tours.`,
        content: [
            'https://www.youtube.com/embed/3NAEDSFhHhU'
        ],
        link: {
            website: 'https://broncobeam.com',
            android: 'https://play.google.com/store/apps/details?id=com.broncobeam_mobile&hl=en_US&gl=US',
            apple: 'https://apps.apple.com/us/app/beam-tours/id1588971126',
        },
        stack: 'React, React Native, Javascript, CSS, Socket.io, Express.js, AWS S3, MongoDB, OneSignal',
        keyFeatures: `
        - Refactored existing Node.js server to be more scalable and secure
        - Created web admin portal using Google Maps API to allow universities to create and manage custom
        campus tours
        - Wrote a tour pathfinding algorithm for the mobile app based on the user's available time for a tour
        - Converted functional React Native app to a class-based implementation with Expo`,
    },
    all_in_favor: {
        title: 'All in Favor',
        startDate: 'September 4, 2021',
        endDate: 'January 6, 2022',
        createdIn: 'React',
        img: '/images/projects/AllinFavor.webp',
        imgcss: {
            borderRadius: '100%',
            borderBottomLeftRadius: '0%',
        },
        parent: 'gimmworks',
        description: `I hopped onto this project towards the end of it. When I joined it wasn't in the best place for security, and there was no networking for the game. The first thing that I did for this project was remove the saving of the user's password locally, and instead converted it to a JSON Web Token that contains no critical user data. The next steps were to add networking. I created all of the game's net code.`,
        link: {
            website: 'https://www.allinfavor.org',
        },
        stack: 'React, Javascript, CSS, Socket.io, Express.js, MongoDB',
        keyFeatures: `
        - Wrote a custom networking system for the game in Node.js using Socket.IO, including the ability to
        reconnect to current games
        - Minimized the amount of information bouncing from client to server to improve performance
        - Worked with front-end developers to help them patch up security`,
    },
    the_simple_ring_alpha: {
        title: 'The Simple Ring Alpha',
        startDate: 'October 8, 2020',
        endDate: 'December 24, 2021',
        createdIn: 'React / Unity / Firebase',
        img: '/images/projects/TheSimpleRing.webp',
        description: `This project was made for The Simple Ring Company. I worked as an independant contractor
            initially to develop a database to store custom rings created in an app, and allow them to be shareable by a url. This slowly evolved into website alternative from
            the app. This project ended before it reached launch.`,
        link: {
            demo: 'https://ringtesting.jonathankido.com',
            about: 'https://thesimplering.com',
        },
        stack: 'Unity WebGL, C#, React, Javascript, Firebase',
        keyFeatures: `
        - Worked for the founders of The Simple Ring on a consumer based mobile app
        - Wrote the backend data storage structure, designed and implemented the frontend UI, and integrated Firebase into the app
        - Prompted improvements in code quality and structure that affected both the frontend and the backend`,
    },
    planet_destroyer: {
        title: 'Planet Destroyer',
        startDate: 'December 5, 2020',
        endDate: 'April 15, 2021',
        createdIn: 'Unity VR',
        img: '/images/projects/PD-v1.7.webp',
        description: `This project was made as the final project for GIMM 490. This project was started in GIMM 290.`,
        stack: 'Unity, C#, Blender',
        keyFeatures: `
        - Individual project with all original code and art that was made with the Unity game engine
        - Iterated multiple times throughout the process of designing the game to give it a better UX
        `,
    },
    abc_stories: {
        title: 'ABC Stories',
        startDate: 'April 12, 2020',
        endDate: 'December 23, 2020',
        createdIn: 'Swift / React',
        img: '/images/projects/abcStories.webp',
        imgcss: { borderRadius: '10%' },
        parent: 'gimmworks',
        description: `This project was the first project that I got put on after getting hired by GIMM Works. The team was creating an app to help students who were struggling with writing. My job was to create a website that would display statistics about the users' progress to help them and their teachers figure out what they should focus on to improve. This project was later given to Blocksmith to maintain the server and app. however in the future the website functionality may be moved to the app.`,
        content: [
            'https://www.youtube.com/embed/f6TUAltSobQ',
            '/images/projects/info/abcstoriesweb.mp4'
        ],
        link: {
            website: 'https://www.abcstories.org/about',
            apple: 'https://apps.apple.com/us/app/abc-stories/id1539194514',
        },
        stack: 'React, Javascript, Express.js, MongoDB, Swift, SQLite',
        keyFeatures: `
        - Created an API for the website and app
        - Wrote algorithms to compute statistics about users' performance within the app
        - Secured data using bcrypt and jwt tokens
        - Designed an account hierarchy so that accounts can manage and view accounts under them
        - Linked the server with a SMTP server to help with account management through email
        - Reformatted and styled the frontend of the website with React`,
    },
    minesweeper_solver: {
        title: 'Minesweeper Solver',
        startDate: 'November 1, 2020',
        endDate: 'December 4, 2020',
        createdIn: 'Unity',
        img: '/images/projects/minesweeper.webp',
        description: `This project was a side project. I had challenged myself to create a minesweeper solver. It uses basic knowledge and flags the 100% bomb spots, and clears the the spots that it calculates cannot have a bomb. There are some occasions where it is unclear and has to use a probiblity calcualation based on the array of neigboring cells. The algorithm first clicks any spots where it has a 0% probiblity of a bomb being there and then repeats. If there isn't a valid direction it will click the flag in the location with the highest possiblity of there being a bomb and continue.`,
        content: [
            '/images/projects/info/minesweepersolver.mp4'
        ],
        stack: 'Unity, C#',
        keyFeatures: `
        - This generates a probability field to do an educated guess`,
    },
    cash_n_slash: {
        title: "Cash n' Slash",
        startDate: 'September 14, 2020',
        endDate: 'November 17, 2020',
        createdIn: 'Unity VR',
        img: '/images/projects/CashnSlash.webp',
        parent: 'gimmworks',
        description: `Cash n' Slash was a VR project made for Idaho Central Credit Union while I worked for GIMM Works. ICCU wanted a VR cash tornado alternative. I worked with a team of other people to create a VR game. I focused on a custom physics system and a VR suitable keyboard.`,
        content: [
            'https://www.youtube.com/embed/htOdUCvf4t0',
            '/images/projects/info/vrKeyboard.mp4',
            '/images/projects/info/moneyPhysics.mp4',
            '/images/projects/info/cashTextures.png',
            '/images/projects/info/cashGravity.gif',
            '/images/projects/info/cafe.gif',
        ],
        stack: 'Unity, C#, Blender',
    },
    swordwhip: {
        title: 'Swordwhip',
        startDate: 'September 15, 2020',
        endDate: 'September 16, 2020',
        createdIn: 'Unity',
        img: '/images/projects/swordwhip.webp',
        description: `This project was created during the first few days of Cash n' Slash. Orignially the project was going to have weapons but later it was changed so that the player had to grab the cash and there would be no weapons in the game at all after that point. I later used this in a school project.
            This was my take on a weapon. It was inspired by Soul Calibur character Ivy's weapon. This project was made using Unity's Hinge Joint component, with a script attached so that the length could increase and decrease. While the length was decreasing it would also reduce the hinges' swing distance so it would not move while it was fully retracted.`,
        content: [
            '/images/projects/info/swordwhip.mp4'
        ],
        stack: 'Unity, C#, Blender',
    },
    deadline: {
        title: 'Deadline',
        startDate: 'September 6, 2018',
        endDate: 'September 13, 2018',
        createdIn: 'Flash',
        img: '/images/projects/deadline.webp',
        description: `Deadline was a project I made during a challenge for Dev Club. The challenge was to make a game where the player had to compete a task before a countdown timer was up. These challenges were open for a week, with the results displayed to the rest of the club at the end of the week.`,
        content: [
            '/images/projects/info/deadline.mp4',
            '/flash/DeadlineGame.swf'
        ],
        stack: 'Adobe Animate, Flash, ActionScript 3',
    },
    defend: {
        title: 'Defend',
        startDate: 'August 3, 2018',
        endDate: 'August 18, 2018',
        createdIn: 'Flash',
        img: '/images/projects/defend.webp',
        description: `Defend was a side project I made towards the end of GIMM 260, and during my first year as a peer mentor. This project was made with the goal in mind of becoming another game template for Professor Ellertson to have available for the incoming freshman.`,
        content: [
            '/images/projects/info/defend.mp4',
            '/flash/Defend.swf'
        ],
        stack: 'Adobe Animate, Flash, ActionScript 3',
    },
    uno_ai: {
        title: 'UNO AI',
        startDate: 'November 21, 2017',
        endDate: 'December 10, 2017',
        createdIn: 'Flash',
        img: '/images/projects/uno.webp',
        description: `Uno AI was a side project that I created towards the end of GIMM 110. The AI is coded to sort its hand in view, create an array of available options and then choose a random card to play or draw one if no plays are possible.`,
        content: [
            '/images/projects/info/uno.mp4',
            '/flash/Uno.swf'
        ],
        stack: 'Adobe Animate, Flash, ActionScript 3',
    },
    survive: {
        title: 'Survive',
        startDate: 'September 18, 2017',
        endDate: 'October 31, 2017',
        createdIn: 'Flash',
        img: '/images/projects/survive.webp',
        description: `Survive was the first individual game I created in GIMM 110 and my first game ever. The assignment was to create a game based off of a very basic template.
            The template I based mine on was a space shooter with the player's ship locked in the center of the screen.
            I changed the ship from being stagnant to be able to move with player input subject to gravity, added the ability to change weapon types (one a charged attack and the other a fully automatic attack with reload) by pressing w, and created my own graphics.`,
        content: [
            '/images/projects/info/survive.mp4',
            '/flash/Survive.swf'
        ],
        stack: 'Adobe Animate, Flash, ActionScript 3',
    },
    original_logo_animation: {
        title: 'Original Logo Animation',
        startDate: 'June 13, 2015',
        endDate: 'June 13, 2015',
        createdIn: 'Blender',
        img: '/images/projects/OriginalLogoAnimation.webp',
        description: `This was a simple project in high school, and actually my first animation using blender, at the time I was thinking I would be a Youtuber and this would be my short intro before every video.`,
        content: [
            '/images/projects/info/firstanimation.mp4'
        ],
        meanings: {
            VFoS: '/about#VFoS',
        },
        stack: 'Blender',
        keyFeatures: `
        - This is the first project that involve modeling and animating something without assistance`,
    },
}