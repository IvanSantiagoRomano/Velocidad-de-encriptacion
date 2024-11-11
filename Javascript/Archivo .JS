async  function  createRandomData(size)  {
        const  chunkSize  =  65536;  //  Tamaño  del  bloque
        const  numChunks  =  Math.ceil(size  /  chunkSize);
        const  data  =  new  Uint8Array(size);

        for  (let  i  =  0;  i  <  numChunks;  i++)  {
                const  randomValues  =  new  Uint8Array(Math.min(chunkSize,  size  -  i  *  chunkSize));
                window.crypto.getRandomValues(randomValues);
                data.set(randomValues,  i  *  chunkSize);
        }

        return  data;
}

async  function  encryptData(data,  key)  {
        const  iv  =  window.crypto.getRandomValues(new  Uint8Array(16));  //  Vector  de  inicialización
        const  cipher  =  await  window.crypto.subtle.importKey('raw',  key,  'AES-CBC',  false,  ['encrypt']);
        const  encrypted  =  await  window.crypto.subtle.encrypt({  name:  'AES-CBC',  iv:  iv  },  cipher,  data);
        return  {  encrypted,  iv  };
}

async  function  decryptData(encryptedData,  key,  iv)  {
        const  cipher  =  await  window.crypto.subtle.importKey('raw',  key,  'AES-CBC',  false,  ['decrypt']);
        const  decrypted  =  await  window.crypto.subtle.decrypt({  name:  'AES-CBC',  iv:  iv  },  cipher,  encryptedData);
        return  new  Uint8Array(decrypted);
}

async  function  main()  {
        const  sizeMB  =  1;
        const  size  =  sizeMB  *  1024  *  1024;  //  Convertir  MB  a  bytes

        const  key  =  window.crypto.getRandomValues(new  Uint8Array(16));  //  Clave  AES  de  16  bytes

        //  Crear  datos  aleatorios
        const  data  =  await  createRandomData(size);
        console.log(`Datos  de  ${sizeMB}  MB  creados.`);

        //  Medir  tiempo  de  encriptación
        const  startEncrypt  =  performance.now();
        const  {  encrypted,  iv  }  =  await  encryptData(data,  key);
        const  endEncrypt  =  performance.now();
        console.log(`Tiempo  de  encriptación:  ${(endEncrypt  -  startEncrypt)  /  1000}  segundos`);

        //  Medir  tiempo  de  desencriptación
        const  startDecrypt  =  performance.now();
        const  decryptedData  =  await  decryptData(encrypted,  key,  iv);
        const  endDecrypt  =  performance.now();
        console.log(`Tiempo  de  desencriptación:  ${(endDecrypt  -  startDecrypt)  /  1000}  segundos`);
}

//  Ejecutar  la  función  principal
main().catch(console.error);
