// import { readCSV } from "https://deno.land/x/csv/mod.ts";
// import { writeJson } from "https://raw.githubusercontent.com/denoland/deno/std/0.67.0/std/fs/write_json.ts";

// const f = await Deno.open("./cl-whitelist.csv");


// let list = []
// for await (const row of readCSV(f)) {
//   for await (const cell of row) {
//     if(cell.match(/(0x[a-zA-Z0-9]{20,50})/)){
//         console.log(`  cell: ${cell}`);
//         list.push(cell.replace(/(0x[a-zA-Z0-9]{20,25}).*/, "$1"))
//     }
//   }
// }
// await writeJson("./test.json", list)

// f.close();
// const csv = require('csvtojson')
import csv from "csvtojson"
import { promises as fs } from "fs";
const csvFilePath = 'cl-whitelist.csv'
const array = await csv().fromFile(csvFilePath);
let list =  new Set()
for(const row of array){
    list.add(row.wallet)
}
await fs.writeFile('./test.json', JSON.stringify(Array.from(list)), {encoding: 'utf8'})
