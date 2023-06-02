import fs from "fs";

export const saveDeployedAddress = (name: string, address: string) => {
  if (!fs.existsSync("./deploy-data.json")) {
    fs.writeFileSync("./deploy-data.json", "{}");
  }

  const deployData = JSON.parse(
    fs.readFileSync("./deploy-data.json").toString()
  );

  deployData[name] = address;

  fs.writeFileSync("./deploy-data.json", JSON.stringify(deployData, null, 2));
};

export const getDeployedAddress = (name: string) => {
  if (!fs.existsSync("./deploy-data.json")) {
    fs.writeFileSync("./deploy-data.json", "{}");
  }

  const deployData = JSON.parse(
    fs.readFileSync("./deploy-data.json").toString()
  );

  if (!deployData[name]) throw new Error(`No address found for ${name}`);

  return deployData[name];
};
