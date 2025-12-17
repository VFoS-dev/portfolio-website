import skillData from '@/json/skillData.json';
import aboutData from '@/json/aboutData.json';

async function sleep(time = 250) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

export async function getSkills() {
  await sleep();
  return skillData.skills;
}

export async function getColors() {
  await sleep();
  return skillData.colors;
}

export async function getAbout() {
  await sleep();
  return aboutData.text.join('\n');
}
