
    
        // Step 1
       let resultSum1 = function caculateSum1(x: number, y: number, z: number): number {
           var result;
           result = x + y + z;
           return result;
       }
    
        
    
        // Step 2
        let resultSum2 = (x: number, y: number, z: number) => {
            var result;
            result = x + y + z;
            return result;
        }
       
    
        // Step 3
        var resultSum3 = (x: number, y: number, z: number) => x + y + z;

        let nome = 'Osmar' ; 
        let call =  (nome:string) =>{ console.log(` Olá meu nome é ${nome} `)  };
    
        console.log(` esse é o resultado das arrow functions primeira: ${resultSum1(1,2,5)} `    );
        console.log(` esse é o resultado das arrow functions segunda: ${resultSum2(1,2,5)} ` );
        console.log(` esse é o resultado das arrow functions terceira: ${resultSum3} ` );
    
