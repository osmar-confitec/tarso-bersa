class Order {

    constructor( public Endereco:string,
                 public Numero:number,
                 public Complemento:string,
                 public optional:number,
                 public Itens: OrderItem[] = []
                ) {

    }

}

class OrderItem {

    constructor(public quantidade: number, public menuId: string) {


    }

}

export { Order, OrderItem }
