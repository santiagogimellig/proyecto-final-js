// Proyecto Final JS
let productos;
obtenerJsonProductos();
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // operador de asignacion condicional
let shopcontent = document.getElementById("mainGrid");
let tablaBody = document.getElementById("tablabody");
let totalCarrito = document.getElementById("total");
let botonFinalizarCompra = document.getElementById("finalizar");
let botonVaciarCarrito = document.getElementById("vaciar");

// renderizo los productos
function renderizarProductos(productos){
    // cargo las cartas de los prodcutos
    productos.forEach((producto)=>{
        let cardContent = document.createElement("div");
        shopcontent.append(cardContent);
        cardContent.className = "card-img"
        cardContent.innerHTML = `
            <section class="seccion-1">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src=${producto.img}" alt="${producto.name}">
                    <div class="card-body">
                    <h4 class="card-title">${producto.name}</h4>
                    <p class="card-text">$${producto.price}<br> ${producto.type}</p> 
                    <a href="#" class="btn btn-primary">Comprar</a>
                    </div>
                </div>
            </section>
        `;
        // utilizo el boton comprar para que cuando se haga click se agregue al carrito
        let botonComprar = cardContent.querySelector(".btn-primary");
            botonComprar.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
    });
    colorBotones();
}

function colorBotones() {
    let botones = document.getElementsByClassName("btn btn-primary");
    for(const boton of botones){
        boton.onmouseover = () => {
            boton.classList.replace('btn-primary','btn-warning');
        }
        boton.onmouseout = () => {
            boton.classList.replace('btn-warning','btn-primary');
        }
    }
}

// // cambio de color en el boton comprar cuando se pasa por arriba con el mouse
// let botones = document.querySelectorAll(".btn.btn-primary");

// for (const boton of botones) {
//     boton.addEventListener("mouseover", () => {
//     boton.classList.replace("btn-primary", "btn-warning");
//     });

//     boton.addEventListener("mouseout", () => {
//     boton.classList.replace("btn-warning", "btn-primary");
//     });
// }
// funcion para que un producto se agregue al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find((item) => item.id === producto.id); // busco un producto especifico en el array
    // busco si hay un producto que ya existe para que se sume en la parte cantidad y no se agregue otra fila
    if (productoExistente) {
        productoExistente.cantidad++; // incrementa la cantidad si el producto ya está en el carrito
        const filaExistente = tablaBody.querySelector(`tr[data-producto-id="${producto.id}"]`); 
        const celdaCantidad = filaExistente.querySelector("td:nth-child(4)"); // td:nth-child(4) se utiliza para selecciona la cuarta celda
        celdaCantidad.textContent = productoExistente.cantidad;
        const Toast = Swal.mixin({ // sweet alert de cuando se agrega un producto repetido al carrito
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({ 
            icon: 'success',
            title: `Agregaste el producto ${producto.name} al carrito`
        })
    } else { // si el producto es la primera vez que se agrega entonces ahora si agrego una fila
        producto.cantidad = 1; // establece la cantidad en 1 si es la primera vez que se agrega al carrito
        carrito.push(producto);
        const Toast = Swal.mixin({ // sweet alert de cuando se agrega un producto al carrito
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: `Agregaste el producto ${producto.name} al carrito`
        })
        console.log("Producto agregado al carrito:", producto);
    }
    mostrarCarrito();
    calcularTotal();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// funcion para mostrar el carrito
function mostrarCarrito(){
    tablaBody.innerHTML = "";
    carrito.forEach((producto) => {
        let filaTabla = document.createElement("tr");
        filaTabla.setAttribute("data-producto-id", producto.id);
        filaTabla.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.name}</td>
            <td>${producto.type}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.price}</td>
            <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
        `;
        
        tablaBody.appendChild(filaTabla);

        // agrego el boton eliminar para que cuando se quiera eliminar se llame a la funcion eliminarDelCarrito
        let botonEliminar = filaTabla.querySelector(".btn-danger");
        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(producto);
        });
    });
}

// funcion para eliminar un prodcuto del carrito
function eliminarDelCarrito(producto) {
    const index = carrito.findIndex((item) => item.id === producto.id); //busco el elemento que quiero eliminar, si findIndex no encuentra nada devuelve -1. Por eso en el if me fijo si es distinto de -1
    if (index !== -1) {  
        const productoExistente = carrito[index];
        if (productoExistente.cantidad > 1) { // si el que quiero elminar esta mas de una vez en el carrito entonces reduzco la cantidad restandole 1
        productoExistente.cantidad--; // elimina un producto si hay mas de uno
        const filaExistente = tablaBody.querySelector(`tr[data-producto-id="${producto.id}"]`);
        const celdaCantidad = filaExistente.querySelector("td:nth-child(4)"); // td:nth-child(4) se utiliza para selecciona la cuarta celda
        celdaCantidad.textContent = productoExistente.cantidad;
        const Toast = Swal.mixin({ // sweet alert de cuando se elimina un producto repetido del carrito
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: `Eliminaste el producto ${producto.name} del carrito`
        })
        } else {
        carrito.splice(index, 1); // elimina el elemento especifico del array
        const filaExistente = tablaBody.querySelector(`tr[data-producto-id="${producto.id}"]`);
        filaExistente.remove(); // si el producto tiene cantidad = 1 entonces elimino la fila del carrito
        }
        const Toast = Swal.mixin({ // sweet alert de cuando se elimina un producto del carrito
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: `Eliminaste el producto ${producto.name} del carrito`
        })
        console.log("Producto eliminado del carrito:", producto);
        calcularTotal();
    }
    // guardo los datos del carrito en el localstorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// boton finalizar compra
botonFinalizarCompra.onclick = () => {
    if (carrito.length === 0) { // verifica que cuando se toca el boton finalizar compra no tiene nada en el carrito, entonces devulve un sweet alert
        Swal.fire('El carrito está vacío', 'Agrega productos antes de finalizar la compra', 'warning');
    } else {
        carrito = [];
        document.getElementById('tablabody').innerHTML = '';
        document.getElementById('total').innerText = 'Total a pagar $:';
        Swal.fire('Gracias por tu compra', 'Pronto la recibirás', 'success');
        // storage NEW
        localStorage.removeItem("carrito");
    }
}

// vaciar carrito
botonVaciarCarrito.onclick = () => {
    if (carrito.length === 0) { // verifica que cuando se toca el boton vaciar carrito no tiene nada en el carrito, entonces devulve un sweet alert
        Swal.fire('El carrito ya está vacío', 'No hay productos para vaciar', 'warning');
    } else {
        carrito = [];
        document.getElementById('tablabody').innerHTML = '';
        document.getElementById('total').innerText = 'Total a pagar $:';
        Swal.fire('El carrito quedó vacío', 'Puedes volver a comprar', 'success');
        //storage NEW
        localStorage.removeItem("carrito");
    }
}

// calculo el total a pagar
function calcularTotal() {
    let total = 0;
    carrito.forEach((producto) => {
        total += producto.price * producto.cantidad;
    });

    const totalElement = document.getElementById("total");
    totalElement.textContent = `Total a pagar $: ${total}`;
}

async function obtenerJsonProductos(){
    const URLJSON = './productos.json';
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    console.log(data);
    productos = data;
    renderizarProductos(productos);
    mostrarCarrito();
}