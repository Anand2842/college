import { getThemesPageData } from './src/lib/cms';

async function main() {
  const data = await getThemesPageData();
  console.log(JSON.stringify(data.themes, null, 2));
}
main();
