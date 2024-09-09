import skillData from '@/json/skillData.json'

async function sleep(time = 0) {
    return new Promise((res) => {
        setTimeout(res, time)
    })
}

export async function getSkills() {
    await sleep()
    return skillData.skills
}

export async function getColors() {
    await sleep()
    return skillData.colors
}