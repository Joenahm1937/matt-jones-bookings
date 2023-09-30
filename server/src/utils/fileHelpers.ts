import fs from "fs";

export const ensureDirExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export const writeJSONToFile = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
};
