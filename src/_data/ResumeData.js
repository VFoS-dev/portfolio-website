import { Fragment } from "react";

export const resumeData = {
    experience: [
        {
            title: `Software Engineer`,
            company: `Matraex Inc.`,
            dates: `January 2023 - August 2023`,
            keyPoints: `
                \t Did full stack development on multiple web/app projects for clients
                \t Created scripts to automate tasks, making development faster and smoother
                \t Worked with the team to improve processes and increase documentation standards
                \t Made flexible tools and reusable features that are used across several projects
                \t Presented work to clients and responded to their feedback
                \t Collaborated with teammates, giving them feedback on problem solving and code optimization`,
        },
        {
            title: `Software Developer`,
            company: `GIMM Works`,
            dates: `January 2020 - January 2023`,
            keyPoints: `
                \t Worked with other student developers on unique software projects for clients
                \t Led back-end dev on several projects
                \t Did full stack development and 3D modeling for multiple projects
                \t Helped other teams implement security features on their projects
                \t Mentored two new hires to help them learn React`,
        },
        {
            title: `Independent Contractor`,
            subTitle: `App Development`,
            company: `The Simple Ring`,
            dates: `September 2020 - December 2021`,
            keyPoints: `
                \t Worked for the founders of The Simple Ring on a consumer-based mobile app
                \t Wrote the back-end data storage structure, designed and implemented the front-end UI, and integrated Firebase into the app
                \t Prompted improvements in code quality and structure that affected both the front-end and the back-end`,
        },
        {
            title: `GIMM Senior Peer Mentor`,
            company: `Boise State GIMM Program`,
            dates: `July 2018 - December 2019`,
            keyPoints: `
                \t Helped current GIMM students with debugging and gave advice about their code
                \t Assisted other peer mentors when they got stuck
                \t Presented previous projects of the department to prospective students and clients
                \t Managed checking out equipment to other students`,
        },
    ],
    education: [
        {
            school: 'Boise State University',
            years: '',
            majors: [
                { short: 'GIMM', long: 'Games, Interactive Media, and Mobile' }
            ],
            minors: [
                { short: 'MATH', long: 'Applied Mathematics' },
                { short: 'ITM', long: 'Information Technology Management' }
            ],
        }
    ]
}

const data = {
    flavored: <Fragment>
        <h2>Experience: </h2>
        <p><strong>Software Engineer - Matraex Inc.</strong></p>
        <p><em>January 2023 - August 2023</em></p>
        <ul>
            <li>Spearheaded end-to-end development across diverse web and app projects, showcasing adeptness in full-stack implementation.</li>
            <li>Pioneered the creation of meticulously engineered scripts, streamlining workflows and augmenting efficiency in development processes.</li>
            <li>Collaborated seamlessly within cross-functional teams to drive process enhancement initiatives, elevating documentation standards and ensuring a culture of continuous improvement.</li>
            <li>Architected adaptable tools and modular features, garnering utilization across a spectrum of projects and amplifying development scalability.</li>
            <li>Masterminded optimization strategies for multiple pages, functions, and intricate API calls, resulting in substantial performance enhancements and refined user experiences.</li>
        </ul>
        <p><strong>Software Developer - GIMM Works</strong></p>
        <p><em>January 2020 - January 2023</em></p>
        <ul>
            <li>Collaborated closely with a dynamic cohort of student developers, orchestrating the successful delivery of bespoke software projects that catered to discerning client needs.</li>
            <li>Assumed a pivotal role as the driving force behind the implementation of back-end solutions on multiple projects, showcasing proficiency in leading technical endeavors.</li>
            <li>Demonstrated mastery in executing full-stack development assignments while concurrently leveraging 3D modeling expertise to infuse innovation into diverse project landscapes.</li>
            <li>Played an instrumental role in bolstering project integrity by imparting security prowess to fellow teams, thereby fortifying applications with robust protective measures.</li>
            <li>Distinguished as a dedicated mentor, steering the growth of two newly onboarded professionals by equipping them with profound insights into React, thereby catalyzing their learning journeys.</li>
        </ul>
        <p><strong>Independent Contractor, App Development - The Simple Ring</strong></p>
        <p><em>September 2020 - December 2021</em></p>
        <ul>
            <li>Contributed significantly to The Simple Ring, an innovative consumer-centric mobile app, under the direct guidance of its founders.</li>
            <li>Devised and constructed the robust back-end data storage architecture, seamlessly aligning it with the cutting-edge front-end UI design, and seamlessly integrating Firebase functionality to enhance app performance.</li>
            <li>Championed a culture of excellence by driving advancements in code quality and structural optimization, exerting a profound impact on both the front-end and back-end components of the application.</li>
        </ul>
        <p><strong>GIMM Senior Peer Mentor - Boise State GIMM Program</strong></p>
        <p><em>July 2018 - December 2019</em></p>
        <ul>
            <li>Elevated the learning experience of current GIMM students by providing invaluable debugging insights and expert guidance on their code-related challenges.</li>
            <li>Demonstrated exceptional teamwork and expertise by stepping in to assist fellow peer mentors during times of technical impasse.</li>
            <li>Served as a captivating presenter, showcasing the department's past projects to both potential students and discerning clients, thereby bolstering its reputation and fostering engagement.</li>
            <li>Exhibited strong organizational skills through adept management of equipment lending, ensuring seamless checkout procedures and optimal resource allocation for fellow students.</li>
        </ul>
    </Fragment>,
    standard: <Fragment>
        <h2>Experience: </h2>
        {resumeData.experience.map(({ title, subTitle, company, dates, keyPoints }) => <Fragment key={`exp:${dates}`}>
            <p><strong>{title}{subTitle ? `, ${subTitle}` : ""} - {company}</strong></p>
            <p><em>{dates}</em></p>
            {keyPoints && <ul>
                {keyPoints.split("\t ").map((p, i) => (p.replace(/\s+/, '')) ?
                    <li key={`${i}-${dates}`}>{p}</li> : ''
                )}
            </ul>}
        </Fragment>)}
    </Fragment>,
}

export const resumeCombinedData = (flavored = false) => data[flavored ? 'flavored' : "standard"];