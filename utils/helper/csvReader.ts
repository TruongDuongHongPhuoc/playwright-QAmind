import csv from 'csvtojson';

export async function readCsv(path: string) {
  return await csv().fromFile(path);
}

export async function getDataFilePath(fileName:string):Promise<string>{
    return "./test_data/"+fileName
}