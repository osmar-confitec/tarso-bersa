
import * as _ from 'lodash';

class PrimeiraClasse {

    constructor(public nome: string = '') {

        
    }

    public executarNome(): void {
        console.log(` Esse 
                          é meu nome ${this.nome}}  `)

    }

}


interface Muleta {


    viajarNaPrimeiraClasse(): void;

}

class Tribileu implements Muleta {


    viajarNaPrimeiraClasse(): void {
        console.log(` Sou Tribileu `)
    }

}

class Jubileu implements Muleta {

    jubileu?: string;
    viajarNaPrimeiraClasse(): void {
        console.log(` Sou Jubileu `)
    }


}

class SegundaClasse extends PrimeiraClasse {

    constructor() {
        super('nome')

    }

    public executarNome(): void {
        super.executarNome();
        console.log(` Esse 
                          é meu nome sobreescrito ${this.nome}}  `)

    }

}

/* export { PrimeiraClasse, Jubileu }
import { PrimeiraClasse } from 'Bla' */

let classe = new PrimeiraClasse();
classe.executarNome();

classe = new SegundaClasse();
classe.executarNome();

let jub: Muleta = new Jubileu();
jub.viajarNaPrimeiraClasse();
jub = new Tribileu();
jub.viajarNaPrimeiraClasse();

 console.log( _.pad(" Typescript examples ",1000,"="));


