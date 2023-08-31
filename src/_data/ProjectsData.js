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
        shortenedDate: "Jan 1, 2023 - Present",
        createdIn: 'Unreal Engine 5',
        img: '/images/projects/projectkuro.webp',
    },
    portfolio_website: {
        title: 'Portfolio Website',
        shortenedDate: "Oct 26, '22 - Present",
        createdIn: 'React',
        img: '/images/projects/portfolioSite.webp',
    },
    matraex_inc: {
        title: 'Matraex Inc.',
        shortenedDate: "Jan 17 - Aug 11, 2023",
        createdIn: 'PHP / SQL / JQuery / React',
        img: '/images/projects/Matraex.webp',
        imgcss: {
            backgroundColor: 'white',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
        name: 'Matraex Inc.',
        description: 'Worked as a full stack developer on multiple web and mobile projects for clients as well as in-house projects.',
        link: {
            about: 'https://www.matraex.com/',
        },
        dates: 'January 17, 2023 - August 11, 2023',
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
        shortenedDate: "May 3 - Aug 11, 2023",
        createdIn: 'PHP / SQL / JQuery',
        img: '/images/projects/ventureidaho.webp',
        parent: 'matraex_inc',
        name: 'Venture Idaho',
        description: 'This is a website I worked on for a title and escrow company.',
        link: {
            website: 'https://ventureidaho.com',
        },
        dates: 'May 3, 2023 - August 11, 2023',
        stack: 'PHP, SQL, JQuery',
        keyFeatures: `
        - Added, adjusted, and redesigned responsive css styling
        - Made the website mobile friendly without a mobile wireframe`,
    },
    hbv: {
        title: 'H.B.V.',
        shortenedDate: "Aug 1 - Aug 7, 2023",
        createdIn: 'PHP / SQL',
        img: '/images/projects/hbv.webp',
        parent: 'matraex_inc',
        name: 'Healthcare Business Ventures',
        description: 'This web portal was created to keep track of sales and invoices for health businesses.',
        link: {
            website: 'https://venturesys.org',
        },
        dates: 'August 1, 2023 - August 7, 2023',
        stack: 'PHP, SQL',
        keyFeatures: `
        - Implemented export of iif files for Quickbooks
        - Adjusted functionality based on client feedback`,
    },
    high_call_rodeo: {
        title: 'High Call Rodeo',
        shortenedDate: "Jul 14 - Jul 31, 2023",
        createdIn: 'React / Meteor / Mongodb',
        img: '/images/projects/highcall.webp',
        imgcss: {
            borderRadius: '10%',
        },
        parent: 'matraex_inc',
        name: 'High Call Rodeo',
        description: 'This website is designed to allow rodeo associations to promote their rodeos and handle contestant applications and payments.',
        link: {
            website: 'https://app.highcallrodeo.com',
        },
        dates: 'July 14, 2023 - July 31, 2023',
        stack: 'React, Meteor, Mongodb',
        keyFeatures: `
        - Audited the client's original codebase prior to beginning work
        - Did a gap analysis of where the project currently was and how much more was desired by the client
        - Documented my discoveries
        - Reviewed the client's cloud services to increase security`,
    },
    salestrak: {
        title: 'Salestrak',
        shortenedDate: "Jan 26 - Jul 31, 2023",
        createdIn: 'PHP / SQL / JQuery',
        img: '/images/projects/salestrak.webp',
        parent: 'matraex_inc',
        name: 'Sales Trak',
        description: 'This web portal was designed to streamline sales processes for companies, initially a roofing company.',
        link: {
            website: 'https://salestrak.io',
            about: 'https://bartlettroofs.com/',
        },
        dates: 'January 26, 2023 - July 31, 2023',
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
        shortenedDate: "Jun 19 - Jul 17, 2023",
        createdIn: 'PHP / SQL / React',
        img: '/images/projects/riogenesis.webp',
        parent: 'matraex_inc',
        name: 'Rio Genesis',
        description: 'This is a website for a real estate company that I did some quality-of-life work on.',
        link: {
            website: 'https://riogenesis.com',
        },
        dates: 'June 19, 2023 - July 17, 2023',
        stack: 'PHP, SQL, React',
        keyFeatures: `
        - Created a script that would automatically upgrade the codebase to PHP8
        - Worked through warnings and errors that were remaining after the upgrade
        - Implemented ecommerce using the USAePay API`,
    },
    black_sage_tech: {
        title: 'Black Sage Tech',
        shortenedDate: "Jan 17 - Feb 28, 2023",
        createdIn: 'React',
        img: '/images/projects/blacksage.webp',
        parent: 'matraex_inc',
        name: 'Black Sage',
        description: 'The DefenseOS app is the front end for an API that was designed to track and monitor drones and activate defense protocols. The company has since been acquired by High Point Aerotech.',
        link: {
            about: 'https://blacksagetech.com',
        },
        dates: 'January 17, 2023 - February 28, 2023',
        stack: 'React',
        keyFeatures: `
        - Created responsive visual features within the app
        - Integrated API calls from Black Sage's back end
        - Found, documented, and notified Black Sage of vulnerabilities in the app
        - Created a React component that worked well with class and functional hooks`,
    },
    motorpool_services: {
        title: 'MotorPool Services',
        shortenedDate: "Aug 25, '22 - Jan 13, '23",
        createdIn: 'React',
        img: '/images/projects/motorpool.webp',
    },
    bronco_beam: {
        title: 'Bronco Beam',
        shortenedDate: "Dec 21, '20 - Jul 30, '22",
        createdIn: 'React Native / Mongodb',
        img: '/images/projects/BroncoBeam.webp',
        imgcss: {
            borderRadius: '10%'
        },
    },
    all_in_favor: {
        title: 'All in Favor',
        shortenedDate: "Sept 4, '21 - Jan 6, '22",
        createdIn: 'React',
        img: '/images/projects/AllinFavor.webp',
        imgcss: {
            borderRadius: '100%',
            borderBottomLeftRadius: '0%'
        },
    },
    the_simple_ring_alpha: {
        title: 'The Simple Ring Alpha',
        shortenedDate: "Oct 8, '20 - Dec 24, '21",
        createdIn: 'React / Unity / Firebase',
        img: '/images/projects/TheSimpleRing.webp',
    },
    planet_destroyer: {
        title: 'Planet Destroyer',
        shortenedDate: "Dec 5, '20 - Apr 15, '21",
        createdIn: 'Unity VR',
        img: '/images/projects/PD-v1.7.webp',
    },
    abc_stories: {
        title: 'ABC Stories',
        shortenedDate: "Apr 12 - Dec 23, 2020",
        createdIn: 'Swift / React',
        img: '/images/projects/abcStories.webp',
        imgcss: { borderRadius: '10%' },
    },
    minesweeper_solver: {
        title: 'Minesweeper Solver',
        shortenedDate: "Nov 1 - Dec 4, 2020",
        createdIn: 'Unity',
        img: '/images/projects/minesweeper.webp',
    },
    cash_n_slash: {
        title: "Cash n' Slash",
        shortenedDate: "Sep 14 - Nov 17, 2020",
        createdIn: 'Unity VR',
        img: '/images/projects/CashnSlash.webp',
    },
    swordwhip: {
        title: 'Swordwhip',
        shortenedDate: "Sep 15 - 16, 2020",
        createdIn: 'Unity',
        img: '/images/projects/swordwhip.webp',
    },
    deadline: {
        title: 'Deadline',
        shortenedDate: "Sept 6 - 13, 2018",
        createdIn: 'Flash',
        img: '/images/projects/deadline.webp',
    },
    defend: {
        title: 'Defend',
        shortenedDate: "Aug 3 - 18, 2018",
        createdIn: 'Flash',
        img: '/images/projects/defend.webp',
    },
    uno_ai: {
        title: 'UNO AI',
        shortenedDate: "Nov 21 - Dec 10, 2017",
        createdIn: 'Flash',
        img: '/images/projects/uno.webp',
    },
    survive: {
        title: 'Survive',
        shortenedDate: "Sep 18 - Oct 31, 2017",
        createdIn: 'Flash',
        img: '/images/projects/survive.webp',
    },
    original_logo_animation: {
        title: 'Original Logo Animation',
        shortenedDate: "June 13, 2015",
        createdIn: 'Blender',
        img: '/images/projects/OriginalLogoAnimation.webp',
    },
}