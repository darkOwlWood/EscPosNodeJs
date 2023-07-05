const fs = require('fs');
const { promisify } = require('util');

const createFile = promisify(fs.open);
async function main() {
    const nombreImpresora = 'POS-58';
    const hostname = require('os').hostname();
    //The printer needs to be connected, register and share
    const ubicacionCompletaImpresora = `\\\\${hostname}\\${nombreImpresora}`;

    try {
        const fh = await createFile(ubicacionCompletaImpresora, 'w');
        const printer = fs.createWriteStream(null, { fd: fh });
        printer.write(Buffer.from([0x1B, 0x40]));



        //TITULO
        printer.write(Buffer.from([0x1D, 0x21, 0x11])); //Character size
        printer.write(Buffer.from([0x1B, 0x45, 0x01])); //Lock blod
        printer.write(Buffer.from([0x1B, 0x61, 0x01])); //Posion: Center
        printer.write('AGROVETERINARIA\nEL GRAN\nCHAPARRAL\n\n\n');
        printer.write(Buffer.from([0x1B, 0x45, 0x00])); //Unlock blod
        printer.write(Buffer.from([0x0A]));

        // // PRODUCTOS
        printer.write(Buffer.from([0x1B, 0x61, 0x00])); //Posion: Center
        printer.write(Buffer.from([0x1D, 0x21, 0x00])); //Character size
        printer.write('Oxitocina');
        printer.write(Buffer.from([0x1B, 0x24, 0xD1, 0x0])); //Absolute align
        printer.write('2');
        printer.write(Buffer.from([0x1B, 0x24, 0x31, 0x1])); //Absolute align
        printer.write('$220');
        printer.write(Buffer.from([0x0A]));

        printer.write('Ubricina');
        printer.write(Buffer.from([0x1B, 0x24, 0xD1, 0x0])); //Absolute align
        printer.write('1');
        printer.write(Buffer.from([0x1B, 0x24, 0x31, 0x1])); //Absolute align
        printer.write('$150');
        printer.write(Buffer.from([0x0A]));

        printer.write('Navaja');
        printer.write(Buffer.from([0x1B, 0x24, 0xD1, 0x0])); //Absolute align
        printer.write('1');
        printer.write(Buffer.from([0x1B, 0x24, 0x31, 0x1])); //Absolute align
        printer.write('$66.50');
        printer.write(Buffer.from([0x0A]));

        // //DIVIDE
        printer.write(Buffer.from([0x1B, 0x45, 0x01])); //Lock blod
        printer.write(Buffer.from([0x1D, 0x21, 0x11])); //Character size
        printer.write('________________');
        printer.write(Buffer.from([0x0A]));

        //TOTAL
        printer.write(Buffer.from([0x1B, 0x61, 0x02])); //Posion: RIGHT
        printer.write('\nTOTAL: $436.50');
        printer.write(Buffer.from([0x1B, 0x45, 0x00])); //Unlock blod
        printer.write(Buffer.from([0x0A]));

        //DATE
        printer.write(Buffer.from([0x1B, 0x61, 0x01])); //Posion: Center
        printer.write(Buffer.from([0x1D, 0x21, 0x00])); //Character size
        printer.write('\n08-06-2023\n\n\n\n');
        printer.write(Buffer.from([0x0A]));



        printer.end();
        console.log('Impresión completada.');
    } catch (error) {
        console.error('Error abriendo la impresora:', error);
    }
}

main();