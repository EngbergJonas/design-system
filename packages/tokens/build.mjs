import StyleDictionary from "style-dictionary";

const BRANDS = [
  {
    name: "bar",
    components: ["colors", "spacing"],
    platforms: ["css", "scss"],
  },
  {
    name: "foo",
    components: ["colors", "spacing", "other"],
    platforms: ["css", "scss"],
  },
];

/**
 * Generates Style Dictionary files for specific components and platform.
 *
 * @param {Object} params - Configuration for generating files
 * @param {Array} params.components - List of components to include (e.g., colors, spacing)
 * @param {string} params.platform - Platform for which the files are generated (e.g., css, scss)
 * @param {string} params.brandName - Brand for which the files are generated
 * @returns {Array} - List of Style Dictionary file configurations
 */
const generateComponentFiles = ({ components, platform, brandName }) =>
  components.map((comp) => ({
    destination: `lib/${brandName}/${comp}/${comp}.${platform}`,
    format: `${platform}/variables`,
    filter: (token) => token.path[0] === comp,
  }));

/**
 * Creates Style Dictionary configuration for a specific brand.
 *
 * @param {Object} brand - Brand configuration with name, components, and platforms
 * @returns {Object} - Configuration object for Style Dictionary
 */
const getBrandDictionaryConfig = ({
  name: brandName,
  components,
  platforms,
}) => ({
  source: [`configs/${brandName}/**.json`],
  platforms: Object.fromEntries(
    platforms.map((platform) => [
      platform,
      {
        transformGroup: platform,
        files: generateComponentFiles({ components, platform, brandName }),
      },
    ])
  ),
});

const buildBrandDictionaries = async () => {
  console.log("Starting build...");
  for (const brand of BRANDS) {
    console.log("\n======================================");
    console.log(`\nBuilding tokens for ${brand.name}`);

    const sd = new StyleDictionary(getBrandDictionaryConfig(brand));
    await sd.buildAllPlatforms();

    console.log(`\nTokens successfully built for ${brand.name}`);
  }

  console.log("\n======================================");
  console.log("\nBuild completed!");
};

await buildBrandDictionaries();
